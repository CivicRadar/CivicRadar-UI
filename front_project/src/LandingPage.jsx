import { Typography, Box, Button, Container, Grid, Card, CardContent } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Person, People, Campaign } from "@mui/icons-material";
import { useState, useEffect } from "react";
import logo from "./assets/lgo.png";
import heroImage from "./assets/landing01.svg";
import IranMap from "./components/iranmap";
import { keyframes } from '@emotion/react';

function LandingPage() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    users: 0,
    admins: 0,
    reportsToday: 0,
  });
  const BASE = `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}`;

  const toPersianNumber = (num) => {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return num.toString().replace(/\d/g, x => persianDigits[x]);
  };

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await fetch(`${BASE}/stats/counter/`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("خطا در دریافت آمار");
        const data = await res.json();
        setDashboardData({
          users: data.UserCount,
          admins: data.MayorCount,
          reportsToday: data.DailyReportCount,
        });
      } catch (err) {
        console.error("Dashboard stats error:", err);
      }
    };

    fetchDashboardStats();
  }, []);

  const featuresList = [
    {
      title: "گزارش مشکلات شهری",
      description: "به راحتی مشکلات شهری را گزارش دهید"
    },
    {
      title: "پیگیری آنلاین",
      description: "وضعیت گزارش‌های خود را پیگیری کنید"
    },
    {
      title: "همکاری با شهرداری",
      description: "ارتباط مستقیم با مسئولین شهری"
    }
  ];

  const gradientAnimation = keyframes`
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  `;

  const networkLines = keyframes`
    0% {
      opacity: 0.3;
    }
    50% {
      opacity: 0.7;
    }
    100% {
      opacity: 0.3;
    }
  `;

  return (
    <Box sx={{ overflowX: "hidden" }}>
      {/* Hero Section */}
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #021524, #023, #034, #056)",
          backgroundSize: "400% 400%",
          animation: "gradientAnimation 10s ease infinite",
          color: "white",
          position: "relative",
        }}
      >
        {/* Navigation */}
        <Box sx={{ position: "absolute", width: "100%", top: 0, p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <motion.img
            src={logo}
            alt="Logo"
            style={{ height: "50px" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          />
          <Button
            variant="contained"
            sx={{
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              color: "white",
              ':hover': {
                background: "rgba(255, 255, 255, 0.2)",
              },
            }}
            onClick={() => navigate("/signuplogin")}
          >
            ورود / ثبت نام
          </Button>
        </Box>

        {/* Hero Content */}
        <Container>
          <Grid container spacing={4} sx={{ minHeight: "100vh", alignItems: "center" }}>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
              >
                <Typography variant="h2" component="h1" sx={{ fontWeight: "bold", mb: 3, textAlign: "right" }}>
                  سامانه هوشمند گزارش مشکلات شهری
                </Typography>
                <Typography variant="h5" sx={{ color: "#b0bec5", mb: 4, textAlign: "right" }}>
                  با ما در ساختن شهری بهتر همراه شوید
                </Typography>
                <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                  <Button
                    variant="contained"
                    size="large"
                    sx={{
                      background: "#00e5ff",
                      color: "#023",
                      ':hover': {
                        background: "#00b8d4",
                      },
                    }}
                    onClick={() => navigate("/register")}
                  >
                    شروع کنید
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    sx={{
                      color: "#00e5ff",
                      borderColor: "#00e5ff",
                      ':hover': {
                        borderColor: "#00b8d4",
                        background: "rgba(0, 229, 255, 0.1)",
                      },
                    }}
                    onClick={() => navigate("/about")}
                  >
                    اطلاعات بیشتر
                  </Button>
                </Box>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%'
                }}
              >
                <img 
                  src={heroImage} 
                  alt="Hero Illustration" 
                  style={{
                    maxWidth: '100%',
                    height: 'auto',
                    filter: 'drop-shadow(0px 10px 20px rgba(0, 0, 0, 0.15))'
                  }}
                />
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Statistics Section */}
      <Box
        sx={{
          py: 8,
          position: 'relative',
          background: '#f8f9fa',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              linear-gradient(to right, transparent 49.5%, #e9ecef 49.5%, #e9ecef 50.5%, transparent 50.5%),
              linear-gradient(to bottom, transparent 49.5%, #e9ecef 49.5%, #e9ecef 50.5%, transparent 50.5%)
            `,
            backgroundSize: '40px 40px',
            opacity: 0.5,
          }
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Grid container spacing={4} justifyContent="center">
              {[
                {
                  title: "تعداد کل کاربران",
                  value: dashboardData.users,
                  color: "#0288d1"
                },
                {
                  title: "دانشگاه و مرکز آموزشی",
                  value: dashboardData.admins,
                  color: "#0288d1"
                },
                {
                  title: "شرکت",
                  value: dashboardData.reportsToday,
                  color: "#0288d1"
                }
              ].map((item, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    viewport={{ once: true }}
                  >
                    <Card
                      sx={{
                        textAlign: "center",
                        p: 4,
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: 4,
                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-10px)',
                          boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.25)',
                        },
                      }}
                    >
                      <Typography
                        variant="h2"
                        sx={{
                          mb: 2,
                          color: item.color,
                          fontWeight: 'bold',
                          fontSize: { xs: '2.5rem', md: '3.5rem' },
                        }}
                      >
                        {toPersianNumber(item.value)}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          mb: 2,
                          color: '#1a237e',
                          fontWeight: 'medium',
                        }}
                      >
                        {item.title}
                      </Typography>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* Iran Map Section */}
      <Box sx={{ py: 8, background: "#fff" }}>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Typography variant="h3" component="h2" sx={{ textAlign: "center", mb: 6, color: "#023" }}>
              پراکندگی گزارشات در کشور
            </Typography>
            <Box sx={{ height: "500px", width: "100%" }}>
              <IranMap />
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8, background: "#fff" }}>
        <Container>
          <Typography variant="h3" component="h2" sx={{ textAlign: "center", mb: 6, color: "#023" }}>
            ویژگی‌های سامانه
          </Typography>
          <Grid container spacing={4}>
            {featuresList.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <Card sx={{ height: "100%", boxShadow: 3 }}>
                    <CardContent>
                      <Typography variant="h5" component="h3" sx={{ mb: 2, color: "#034", textAlign: "right" }}>
                        {feature.title}
                      </Typography>
                      <Typography sx={{ color: "#666", textAlign: "right" }}>
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default LandingPage;
