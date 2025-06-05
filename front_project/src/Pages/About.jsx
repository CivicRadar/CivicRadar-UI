import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from '@mui/material';
import { motion } from 'framer-motion';
import PeopleIcon from '@mui/icons-material/People';
import CampaignIcon from '@mui/icons-material/Campaign';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import PublicIcon from '@mui/icons-material/Public';

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

const About = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const features = [
    {
      icon: <PeopleIcon sx={{ fontSize: 40, color: '#00cc88' }} />,
      title: 'مشارکت شهروندی',
      description: 'فرصتی برای شهروندان تا در بهبود محیط زندگی خود نقش فعال داشته باشند'
    },
    {
      icon: <CampaignIcon sx={{ fontSize: 40, color: '#00cc88' }} />,
      title: 'گزارش‌دهی آسان',
      description: 'سیستم ساده و کاربرپسند برای گزارش مشکلات شهری'
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40, color: '#00cc88' }} />,
      title: 'امنیت اطلاعات',
      description: 'حفاظت از اطلاعات شخصی و گزارش‌های شهروندان'
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40, color: '#00cc88' }} />,
      title: 'پیگیری سریع',
      description: 'سیستم پیگیری آنلاین برای اطلاع از وضعیت گزارش‌ها'
    },
    {
      icon: <EmojiObjectsIcon sx={{ fontSize: 40, color: '#00cc88' }} />,
      title: 'راهکارهای هوشمند',
      description: 'استفاده از هوش مصنوعی برای تحلیل و اولویت‌بندی مشکلات'
    },
    {
      icon: <PublicIcon sx={{ fontSize: 40, color: '#00cc88' }} />,
      title: 'پوشش سراسری',
      description: 'خدمات در تمامی شهرهای کشور'
    }
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        minHeight: '100vh', 
        bgcolor: '#f5f5f5', 
        pt: 8, 
        pb: 12,
        fontFamily: "Vazir, IranSans, IRANYekan, Vazirmatn, Shabnam, sans-serif",
      }}>
        <Container maxWidth="lg">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography
                variant="h2"
                sx={{
                  color: '#023',
                  fontWeight: 'bold',
                  mb: 3,
                  fontSize: { xs: '2rem', md: '3rem' },
                  fontFamily: "Vazir, IranSans, IRANYekan, Vazirmatn, Shabnam, sans-serif",
                }}
              >
                درباره ما
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: '#666',
                  maxWidth: '800px',
                  mx: 'auto',
                  lineHeight: 1.8,
                  fontFamily: "Vazir, IranSans, IRANYekan, Vazirmatn, Shabnam, sans-serif",
                }}
              >
                سامانه هوشمند گزارش مشکلات شهری، پلتفرمی برای مشارکت شهروندان در بهبود محیط زندگی
              </Typography>
            </Box>
          </motion.div>

          {/* Mission Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Box sx={{ mb: 8 }}>
              <Typography
                variant="h4"
                sx={{
                  color: '#023',
                  fontWeight: 'bold',
                  mb: 4,
                  textAlign: 'right',
                  fontFamily: "Vazir, IranSans, IRANYekan, Vazirmatn, Shabnam, sans-serif",
                }}
              >
                ماموریت ما
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#666',
                  lineHeight: 2,
                  textAlign: 'right',
                  fontSize: '1.1rem',
                  fontFamily: "Vazir, IranSans, IRANYekan, Vazirmatn, Shabnam, sans-serif",
                }}
              >
                ما در سامانه هوشمند گزارش مشکلات شهری، با هدف ایجاد پلی بین شهروندان و مسئولین شهری، 
                بستری امن و کارآمد برای گزارش مشکلات شهری فراهم کرده‌ایم. با استفاده از تکنولوژی‌های 
                روز و رویکردهای نوین، تلاش می‌کنیم تا مشارکت شهروندی را در بهبود محیط زندگی تقویت کنیم 
                و به ایجاد شهری بهتر و زندگی راحت‌تر برای همه کمک کنیم.
              </Typography>
            </Box>
          </motion.div>

          {/* Features Grid */}
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      bgcolor: 'white',
                      borderRadius: 4,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      transition: 'transform 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-10px)'
                      }
                    }}
                  >
                    <CardContent sx={{ p: 4, textAlign: 'right' }}>
                      <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                      <Typography
                        variant="h6"
                        sx={{
                          color: '#023',
                          fontWeight: 'bold',
                          mb: 2,
                          fontFamily: "Vazir, IranSans, IRANYekan, Vazirmatn, Shabnam, sans-serif",
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#666',
                          lineHeight: 1.8,
                          fontFamily: "Vazir, IranSans, IRANYekan, Vazirmatn, Shabnam, sans-serif",
                        }}
                      >
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Box
              sx={{
                mt: 8,
                p: 4,
                bgcolor: 'white',
                borderRadius: 4,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                textAlign: 'right'
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  color: '#023',
                  fontWeight: 'bold',
                  mb: 3,
                  fontFamily: "Vazir, IranSans, IRANYekan, Vazirmatn, Shabnam, sans-serif",
                }}
              >
                تماس با ما
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#666',
                  lineHeight: 2,
                  mb: 2,
                  fontFamily: "Vazir, IranSans, IRANYekan, Vazirmatn, Shabnam, sans-serif",
                }}
              >
                برای ارتباط با ما می‌توانید از طریق راه‌های زیر اقدام کنید:
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: '#666',
                    fontFamily: "Vazir, IranSans, IRANYekan, Vazirmatn, Shabnam, sans-serif",
                  }}
                >
                  ایمیل: info@civicradar.ir
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: '#666',
                    fontFamily: "Vazir, IranSans, IRANYekan, Vazirmatn, Shabnam, sans-serif",
                  }}
                >
                  تلفن: ۰۲۱-۱۲۳۴۵۶۷۸
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: '#666',
                    fontFamily: "Vazir, IranSans, IRANYekan, Vazirmatn, Shabnam, sans-serif",
                  }}
                >
                  آدرس: تهران، خیابان ولیعصر، ساختمان نوآوری
                </Typography>
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default About; 