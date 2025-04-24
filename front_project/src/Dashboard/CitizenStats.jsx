import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from '@mui/material';
import { MoreHoriz, Person } from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// تبدیل عدد به فارسی با پشتیبانی از اعداد منفی
const toPersianNumber = (num) => {
  const isNegative = num < 0;
  const absNum = Math.abs(num);
  const persianDigits = String(absNum).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
  return isNegative ? `${persianDigits}-` : persianDigits;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Paper elevation={3} sx={{ p: 1 }}>
        <Typography variant="subtitle2">{label}</Typography>
        <Typography variant="body2">
          امتیاز: {toPersianNumber(payload[0].value)}
        </Typography>
      </Paper>
    );
  }
  return null;
};

// Map month keys (e.g., "2025-04") to Persian month names
const monthMap = {
  '01': 'بهمن',
  '02': 'اسفند',
  '03': 'فروردین',
  '04': 'اردیبهشت',
  '05': 'خرداد',
  '06': 'تیر',
  '07': 'مرداد',
  '08': 'شهریور',
  '09': 'مهر',
  '10': 'آبان',
  '11': 'آذر',
  '12': 'دی',
};

// Base URL for the backend API
const BASE_URL = 'http://127.0.0.1:8000';

const CitizenStats = () => {
  const [monthlyPoints, setMonthlyPoints] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [totalReports, setTotalReports] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('http://127.0.0.1:8000/communicate/points/', {
          method: "GET",
          credentials: "include",
        });

        // Check for authentication issues
        if (response.status === 401 || response.status === 403) {
          console.error("User not authenticated, redirecting to login...");
          window.location.href = '/login';
          return;
        }

        if (response.ok) {
          const data = await response.json();
          console.log("Full API Response:", data);

          // Validate API response
          if (!data || typeof data !== 'object') {
            throw new Error('داده‌های دریافت‌شده از سرور نامعتبر است');
          }

          // Set total reports and points with fallback to 0
          setTotalReports(data.Sum_of_Reports || 0);
          setTotalPoints(data.Sum_of_Points || 0);

          // Process monthly points with fallback to empty object
          const monthlyData = data.Monthly_Points || {};
          const monthlyPointsArray = Object.keys(monthlyData)
            .map((key) => {
              const [year, month] = key.split('-');
              const monthLabel = monthMap[month] || month;
              return {
                month: monthLabel === 'اردیبهشت' ? `${monthLabel}\u00A0` : monthLabel,
                points: monthlyData[key] || 0,
                key,
              };
            })
            .sort((a, b) => {
              // Improved sorting to handle invalid dates
              const dateA = new Date(a.key);
              const dateB = new Date(b.key);
              if (isNaN(dateA) || isNaN(dateB)) {
                return a.key.localeCompare(b.key); // Fallback to string comparison (oldest to newest)
              }
              return dateA - dateB; // Sort ascending: oldest to newest
            })
            .slice(0, 5); // Take the first 5 months
          setMonthlyPoints(monthlyPointsArray);

          // Process leaderboard with fallback to empty array
          const usersRanking = Array.isArray(data.Users_Ranking) ? data.Users_Ranking : [];
          const leaderboardData = usersRanking
            .slice(0, 10) // Take top 10 users
            .map((user, index) => ({
              id: index + 1,
              name: user.is_current_user ? 'کاربر شما' : (user.FullName || 'کاربر ناشناس'),
              picture: user.Picture ? `${BASE_URL}${user.Picture}` : null,
              points: user.points || 0,
              rank: user.rank || (index + 1),
              isCurrentUser: user.is_current_user || false,
            }));
          setLeaderboard(leaderboardData);

          // Process current user's rank
          const currentUser = usersRanking.find(user => user.is_current_user);
          if (currentUser) {
            const userRankData = {
              rank: currentUser.rank || 0,
              name: 'کاربر شما',
              picture: currentUser.Picture ? `${BASE_URL}${currentUser.Picture}` : null,
              points: currentUser.points || 0,
            };
            setUserRank(userRankData);
          } else {
            const userRankData = data.User_Rank ? {
              rank: data.User_Rank,
              name: 'کاربر شما',
              picture: null,
              points: 0,
            } : null;
            setUserRank(userRankData);
          }
        } else {
          throw new Error(`خطا در دریافت داده‌ها: ${response.statusText}`);
        }
      } catch (error) {
        console.error("Error fetching points:", error);
        setError(error.message || 'خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2, direction: 'rtl' }}>
        <Typography color="error" align="center">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ direction: 'rtl', p: 2 }}>
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2, boxShadow: 3, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold" color="green">
              مجموع گزارشات
            </Typography>
            <Typography variant="h4" color="black">
              {toPersianNumber(totalReports)}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2, boxShadow: 3, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold" color="green">
              مجموع امتیازات
            </Typography>
            <Typography variant="h4" color="black">
              {toPersianNumber(totalPoints)}
            </Typography>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              p: 3,
              boxShadow: '0 0 25px 8px rgba(76, 175, 80, 0.4)',
              borderRadius: 3,
            }}
          >
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              امتیازات ماهانه (۵ ماه اخیر)
            </Typography>
            {monthlyPoints.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart
                  data={monthlyPoints}
                  margin={{ top: 10, right: 20, left: 20, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    interval={0}
                    tick={{ dy: 15, fontSize: 12, fill: '#000' }}
                    height={30} // Increased height to accommodate longer labels
                    angle={-55} // Rotate labels to prevent truncation
                
                  />
                  <YAxis
                    tickFormatter={(value) => toPersianNumber(value)}
                    tick={{ dx: -10, fontSize: 12, fill: '#000' }}
                    domain={[-20, 20]}
                    allowDataOverflow={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="points"
                    stroke="#4caf50"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <Typography variant="body1" color="textSecondary" align="center">
                داده‌ای برای نمایش وجود ندارد
              </Typography>
            )}
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card
            sx={{
              p: 3,
              boxShadow: '0 0 25px 8px rgba(76, 175, 80, 0.4)',
              borderRadius: 3,
            }}
          >
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              رتبه‌بندی کاربران
            </Typography>
            <TableContainer
              component={Paper}
              sx={{ borderRadius: 2, maxHeight: 280 }}
            >
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell align="right">رتبه</TableCell>
                    <TableCell align="right">تصویر کاربر</TableCell>
                    <TableCell align="right">نام کاربر</TableCell>
                    <TableCell align="right">امتیاز</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {leaderboard.length > 0 ? (
                    leaderboard.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell align="right" sx={{ color: user.isCurrentUser ? '#00C853' : 'inherit' }}>
                          {toPersianNumber(user.rank)}
                        </TableCell>
                        <TableCell align="right" sx={{ color: user.isCurrentUser ? '#00C853' : 'inherit', paddingRight: '32px' }}>
                          {user.picture ? (
                            <img
                              src={user.picture}
                              alt={`${user.name} profile`}
                              style={{ width: 24, height: 24, borderRadius: '50%' }}
                            />
                          ) : (
                            <Box
                              sx={{
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                border: '2px solid #4CAF50',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Person sx={{ width: 20, height: 20, color: '#ccc' }} />
                            </Box>
                          )}
                        </TableCell>
                        <TableCell align="right" sx={{ color: user.isCurrentUser ? '#00C853' : 'inherit' }}>
                          {user.name}
                        </TableCell>
                        <TableCell align="right" sx={{ color: user.isCurrentUser ? '#00C853' : 'inherit' }}>
                          {toPersianNumber(user.points)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <Typography variant="body2" color="textSecondary">
                          هیچ کاربری در رتبه‌بندی موجود نیست
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}

                  {leaderboard.length > 0 && (
                    <TableRow>
                      <TableCell align="center" colSpan={4}>
                        <MoreHoriz sx={{ color: 'gray' }} />
                      </TableCell>
                    </TableRow>
                  )}

                  {userRank && (
                    <TableRow>
                      <TableCell align="right" sx={{ color: '#00C853' }}>
                        {toPersianNumber(userRank.rank)}
                      </TableCell>
                      <TableCell align="right" sx={{ color: '#00C853', paddingRight: '32px' }}>
                        {userRank.picture ? (
                          <img
                            src={userRank.picture}
                            alt={`${userRank.name} profile`}
                            style={{ width: 24, height: 24, borderRadius: '50%' }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: 24,
                              height: 24,
                              borderRadius: '50%',
                              border: '2px solid #4CAF50',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Person sx={{ width: 20, height: 20, color: '#ccc' }} />
                          </Box>
                        )}
                      </TableCell>
                      <TableCell align="right" sx={{ color: '#00C853' }}>
                        {userRank.name}
                      </TableCell>
                      <TableCell align="right" sx={{ color: '#00C853' }}>
                        {toPersianNumber(userRank.points)}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CitizenStats;