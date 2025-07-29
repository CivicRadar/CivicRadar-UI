import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  useTheme,
  useMediaQuery,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from '@mui/material';
import { motion } from 'framer-motion';
import SecurityIcon from '@mui/icons-material/Security';
import LockIcon from '@mui/icons-material/Lock';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ShieldIcon from '@mui/icons-material/Shield';
import AppBar from "../Components/AppBar";
import Footer from "../Components/Footer";

const theme = createTheme({
  typography: {
    fontFamily: "Vazir, IranSans, IRANYekan, Vazirmatn, Shabnam, sans-serif",
    fontSize: 18,
    h1: { fontSize: "28px", fontWeight: 700 },
    h2: { fontSize: "24px", fontWeight: 700 },
    h3: { fontSize: "20px", fontWeight: 700 },
    body1: { fontSize: "18px", fontWeight: 400 },
    button: { fontSize: "20px", fontWeight: 700 },
    subtitle1: { fontSize: "16px", fontWeight: 400, color: "#666" },
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: "Vazir, IranSans, IRANYekan, Vazirmatn, Shabnam, sans-serif",
        },
      },
    },
  },
});

const Privacy = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const privacySections = [
    {
      icon: <SecurityIcon sx={{ fontSize: 40, color: '#00cc88' }} />,
      title: 'جمع‌آوری اطلاعات',
      content: 'ما فقط اطلاعات ضروری برای ارائه خدمات را جمع‌آوری می‌کنیم. این اطلاعات شامل نام، ایمیل، شماره تماس و موقعیت مکانی گزارش‌ها می‌شود. تمامی اطلاعات با رضایت شما و به صورت داوطلبانه جمع‌آوری می‌شوند.'
    },
    {
      icon: <LockIcon sx={{ fontSize: 40, color: '#00cc88' }} />,
      title: 'حفاظت از اطلاعات',
      content: 'اطلاعات شما با استفاده از پروتکل‌های امنیتی پیشرفته محافظت می‌شوند. ما از رمزنگاری SSL برای انتقال داده‌ها و سیستم‌های امنیتی چندلایه برای ذخیره‌سازی استفاده می‌کنیم.'
    },
    {
      icon: <VerifiedUserIcon sx={{ fontSize: 40, color: '#00cc88' }} />,
      title: 'استفاده از اطلاعات',
      content: 'اطلاعات شما فقط برای اهداف مشخص شده در سامانه استفاده می‌شود. این اهداف شامل پردازش گزارش‌ها، ارتباط با شما و بهبود خدمات است. ما اطلاعات شما را به هیچ شخص ثالثی بدون اجازه شما نمی‌فروشیم یا منتقل نمی‌کنیم.'
    },
    {
      icon: <ShieldIcon sx={{ fontSize: 40, color: '#00cc88' }} />,
      title: 'حقوق کاربران',
      content: 'شما حق دارید به اطلاعات شخصی خود دسترسی داشته باشید، آن‌ها را اصلاح کنید یا حذف کنید. همچنین می‌توانید در هر زمان از دریافت پیام‌های ما انصراف دهید.'
    }
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ overflowX: "hidden", direction: 'rtl' }}>
        <AppBar />
        <Box sx={{ 
          minHeight: '100vh', 
          bgcolor: '#f5f5f5', 
          pt: { xs: 12, sm: 16, md: 20 }, 
          pb: { xs: 8, sm: 12, md: 16 },
          fontFamily: "Vazir, IranSans, IRANYekan, Vazirmatn, Shabnam, sans-serif",
        }}>
          <Container maxWidth="lg">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
                <Typography
                  variant="h2"
                  sx={{
                    color: '#023',
                    fontWeight: 'bold',
                    mb: { xs: 2, md: 3 },
                    fontSize: { xs: '1.5rem', sm: '2rem', md: '3rem' },
                    fontFamily: "Vazir, IranSans, IRANYekan, Vazirmatn, Shabnam, sans-serif",
                  }}
                >
                  حریم خصوصی
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    color: '#666',
                    maxWidth: { xs: '100%', md: '800px' },
                    mx: 'auto',
                    lineHeight: 1.8,
                    fontSize: { xs: '1rem', sm: '1.2rem', md: '1.5rem' },
                    fontFamily: "Vazir, IranSans, IRANYekan, Vazirmatn, Shabnam, sans-serif",
                  }}
                >
                  ما متعهد به حفاظت از حریم خصوصی شما هستیم
                </Typography>
              </Box>
            </motion.div>

            {/* Privacy Policy Content */}
            <Box sx={{ mb: { xs: 6, md: 8 } }}>
              <Typography
                variant="body1"
                sx={{
                  color: '#666',
                  lineHeight: 2,
                  textAlign: 'right',
                  fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                  mb: { xs: 3, md: 4 },
                  fontFamily: "Vazir, IranSans, IRANYekan, Vazirmatn, Shabnam, sans-serif",
                }}
              >
                در سامانه هوشمند گزارش مشکلات شهری، حفظ حریم خصوصی کاربران یکی از اولویت‌های اصلی ماست. 
                این سیاست حریم خصوصی توضیح می‌دهد که چگونه اطلاعات شما را جمع‌آوری، استفاده و محافظت می‌کنیم.
              </Typography>

              {privacySections.map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Paper
                    elevation={3}
                    sx={{
                      p: { xs: 2, sm: 3, md: 4 },
                      mb: { xs: 3, md: 4 },
                      borderRadius: 8,
                      bgcolor: 'white',
                      transition: 'transform 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 6px 25px rgba(0,0,0,0.15)',
                      }
                    }}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: { xs: 1, md: 2 }, 
                      mb: { xs: 1, md: 2 },
                      justifyContent: 'flex-start'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {section.icon}
                      </Box>
                      <Typography
                        variant="h5"
                        sx={{
                          color: '#023',
                          fontWeight: 'bold',
                          fontSize: { xs: '1rem', sm: '1.2rem', md: '1.5rem' },
                          fontFamily: "Vazir, IranSans, IRANYekan, Vazirmatn, Shabnam, sans-serif",
                        }}
                      >
                        {section.title}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{
                        color: '#666',
                        lineHeight: 2,
                        textAlign: 'right',
                        fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                        fontFamily: "Vazir, IranSans, IRANYekan, Vazirmatn, Shabnam, sans-serif",
                      }}
                    >
                      {section.content}
                    </Typography>
                  </Paper>
                </motion.div>
              ))}
            </Box>

            {/* Contact Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Paper
                elevation={3}
                sx={{
                  p: { xs: 2, sm: 3, md: 4 },
                  borderRadius: 8,
                  bgcolor: 'white',
                  textAlign: 'right',
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    color: '#023',
                    fontWeight: 'bold',
                    mb: { xs: 2, md: 3 },
                    fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2rem' },
                    fontFamily: "Vazir, IranSans, IRANYekan, Vazirmatn, Shabnam, sans-serif",
                  }}
                >
                  سوالات و نظرات
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: '#666',
                    lineHeight: 2,
                    mb: { xs: 1, md: 2 },
                    fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                    fontFamily: "Vazir, IranSans, IRANYekan, Vazirmatn, Shabnam, sans-serif",
                  }}
                >
                  اگر سوال یا نظری در مورد سیاست حریم خصوصی ما دارید، می‌توانید با ما تماس بگیرید:
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1, md: 2 } }}>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: '#666',
                      fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                      fontFamily: "Vazir, IranSans, IRANYekan, Vazirmatn, Shabnam, sans-serif",
                    }}
                  >
                    ایمیل: info@shahrsanj.ir
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: '#666',
                      fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                      fontFamily: "Vazir, IranSans, IRANYekan, Vazirmatn, Shabnam, sans-serif",
                    }}
                  >
                    تلفن: ۷۳۲۲۵۳۰۳-۰۲۱
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: '#666',
                      fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                      fontFamily: "Vazir, IranSans, IRANYekan, Vazirmatn, Shabnam, sans-serif",
                    }}
                  >
                    آدرس: تهران، رسالت، خیابان هنگام، خیابان دانشگاه، دانشگاه علم و صنعت ایران
                  </Typography>
                </Box>
              </Paper>
            </motion.div>
          </Container>
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  );
};

export default Privacy;