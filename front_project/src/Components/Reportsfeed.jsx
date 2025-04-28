import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  Divider,
  Button,
  Chip,
  Avatar,
  Grid,
  CircularProgress,
  TextField,
  CardContent,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  IconButton,
  InputLabel
} from '@mui/material';
import { 
  HowToVote, 
  Person, 
  ArrowForward, 
  LocationOn, 
  CalendarToday,
  Search,
  FilterList 
} from '@mui/icons-material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ReportIcon from '@mui/icons-material/Report';
import Menu from '@mui/material/Menu';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { getProvince } from '../services/admin-api';

const ReportFeed = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('همه');
  const [filterProvince, setFilterProvince] = useState('همه');
  const [sortOption, setSortOption] = useState('جدیدترین ها');
  const [provinces, setProvinces] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);

  // Fetch reports
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/supervise/all-citizen-report/`);
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setReports(data);
        setFilteredReports(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching reports:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // Fetch provinces
  useEffect(() => {
    const fetchProvince = async () => {
      try {
        const response = await getProvince();
        setProvinces(response);
        // setLoading(false);
      } catch (error) {
        console.error("Error fetching Provinces:", error);
      }
    };
    fetchProvince();
  }, []);

  useEffect(() => {
    // Apply filters whenever search term or filters change
    let results = [...reports];
    
    // Apply search filter
    if (searchTerm) {
      results = results.filter(report => 
        report.Information.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (report.FullAdress && report.FullAdress.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply type filter
    if (filterType !== 'همه') {
      results = results.filter(report => report.Type === filterType);
    }
    
    // Apply province filter
    if (filterProvince !== 'همه') {
      results = results.filter(report => report.ProvinceName === filterProvince);
    }
    
    // Apply sorting
    if (sortOption === 'جدیدترین ها') {
      results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortOption === 'محبوب ترین ها') {
      results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    
    setFilteredReports(results);
  }, [searchTerm, filterType, filterProvince, sortOption, reports]);

  // Get unique types for filter dropdown
  const uniqueTypes = ['همه', ...new Set(reports.map(report => report.Type))];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">خطا در دریافت گزارشات: {error}</Typography>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
          sx={{ mt: 2 }}
        >
          تلاش مجدد
        </Button>
      </Box>
    );
  }

  const trans = (type) => {
    switch (type) {
      case "Lighting":
      case "lighting":
        return "روشنایی"
      case "Street":
      case "street":
        return "خیابان"
      case "Garbage":
      case "garbage":
        return "زباله"
      case "Other":
      case "other":
        return "سایر"
      default:
        return type 
    }
  }

  const handleMenuClick = (event, report) => {
    setAnchorEl(event.currentTarget);
    setSelectedReport(report);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedReport(null);
  };

  const handleReportViolation = () => {
    // Handle report violation logic here
    console.log('Reporting violation for:', selectedReport);
    // You can add your API call or other logic here
    handleMenuClose();
  };

  return (
    <Box sx={{ 
      maxWidth: 1200, 
      mx: 'auto', 
      p: { xs: 1, sm: 2 }, // Less padding on mobile
      width: '100%' // Ensure full width
    }}>
      {/* Search and Filter Section */}
      <Box sx={{ 
        mb: 3,
        p: 2,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 1
      }}>
        {/* Search Field - Full width on all screens */}
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="جستجو در گزارشات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiInputBase-root': {
                borderRadius: 2
              }
            }}
          />
        </Box>
        
        {/* Filter Row - Responsive layout */}
        <Grid container spacing={2}>
          {/* Type Filter */}
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>نوع گزارش</InputLabel>
              <Select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                label="نوع گزارش"
                startAdornment={
                  <InputAdornment position="start">
                    <FilterList fontSize="small" />
                  </InputAdornment>
                }
              >
                {uniqueTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {trans(type)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          {/* Province Filter */}
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>استان</InputLabel>
              <Select
                value={filterProvince}
                onChange={(e) => setFilterProvince(e.target.value)}
                label="استان"
              >
                <MenuItem value="همه">همه استان‌ها</MenuItem>
                {provinces.map((province) => (
                  <MenuItem key={province.id} value={province.Name}>
                    {province.Name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          {/* Sort Filter */}
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>مرتب‌سازی</InputLabel>
              <Select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                label="مرتب‌سازی"
              >
                <MenuItem value="جدیدترین ها">جدیدترین ها</MenuItem>
                <MenuItem value="محبوب ترین ها">محبوب ترین ها</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
      
      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <Box sx={{ 
          p: 4, 
          textAlign: 'center',
          bgcolor: 'background.paper',
          borderRadius: 2
        }}>
          <Typography>هیچ گزارشی با معیارهای جستجو یافت نشد</Typography>
          <Button 
            variant="outlined" 
            sx={{ mt: 2 }}
            onClick={() => {
              setSearchTerm('');
              setFilterType('همه');
              setFilterProvince('همه');
              setSortOption('جدیدترین ها');
            }}
          >
            حذف فیلترها
          </Button>
        </Box>
      ) : (
        <Box sx={{ 
          width: '100%', // Full width container
          mx: 'auto',
          p: { xs: 0, sm: 2 } // Remove padding on mobile
        }}>
          <Grid container spacing={{ xs: 1, sm: 3 }}> {/* Smaller gap on mobile */}
            {filteredReports.map((report) => (
              <Grid 
                item 
                xs={12} // Full width on mobile
                sm={6}  // 2 columns on small screens
                md={4}  // 3 columns on medium screens
                key={report.id}
                sx={{
                  display: 'flex', // Ensure cards stretch to full height
                  justifyContent: 'center' // Center cards if needed
                }}
              >
                <Card 
                  sx={{ 
                    width: '100%', // Full width of grid item
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 2,
                    boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0px 4px 12px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                  {/* Thumbnail */}
                  <Box sx={{
                    width: '100%',
                    height: 160,
                    bgcolor: '#f5f5f5',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden'
                  }}>
                    {report.Picture ? (
                      <Box
                        component="img"
                        src={`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}${report.Picture}`}
                        alt=""
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        بدون تصویر
                      </Typography>
                    )}
                  </Box>

                  {/* Content */}
                  <Box sx={{ p: 2, flexGrow: 1 }}>
                    {/* Rating */}
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 1,
                      color: '#1b9476'
                    }}>
                      <Typography variant="body2">
                        امتیاز: 
                      </Typography>
                      <Typography variant="body2" sx={{ ml: 0.5, fontWeight: 'bold' }}>
                        {report.rating || '۰'}
                      </Typography>
                      <Typography variant="caption" sx={{ ml: 1 }}>
                        ({report.ratingCount || '۰'})
                      </Typography>
                      <Box>
                        <IconButton
                          aria-label="more"
                          aria-controls="report-menu"
                          aria-haspopup="true"
                          onClick={(e) => handleMenuClick(e, report)}
                          size="small"
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Box>
                    </Box>

                    {/* Report Title */}
                    <Typography variant="subtitle1" component="h2" sx={{ 
                      fontWeight: 'bold',
                      mb: 1,
                      height: 60,
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {report.Information}
                    </Typography>

                    {/* Location Info */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOn fontSize="small" color="action" />
                      <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>
                        {report.CityName && report.ProvinceName 
                          ? `${report.CityName}، ${report.ProvinceName}`
                          : report.CityName || report.ProvinceName || 'موقعیت نامشخص'}
                      </Typography>
                    </Box>

                    {/* Reporter Info */}
                    <Typography variant="caption" color="text.secondary">
                      از طرف: {report.ReporterName || "کاربر ناشناس"}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )} 
      <Menu
        id="report-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleReportViolation}>
          <ListItemIcon>
            <ReportIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText primary="ثبت تخلف" />
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ReportFeed;