import React, { useEffect } from 'react';
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
import { Person, People, Campaign } from "@mui/icons-material";
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

const About = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
                  درباره ما
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
              <Box sx={{ mb: { xs: 6, md: 8 } }}>
                <Typography
                  variant="h4"
                  sx={{
                    color: '#023',
                    fontWeight: 'bold',
                    mb: { xs: 3, md: 4 },
                    textAlign: 'right',
                    fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2rem' },
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
                    fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
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

            {/* Team Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Box sx={{ mt: { xs: 6, md: 8 }, mb: { xs: 6, md: 8 } }}>
                <Typography
                  variant="h4"
                  sx={{
                    color: '#023',
                    fontWeight: 'bold',
                    mb: { xs: 3, md: 4 },
                    textAlign: 'center',
                    fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2rem' },
                    fontFamily: "Vazir, IranSans, IRANYekan, Vazirmatn, Shabnam, sans-serif",
                  }}
                >
                  تیم ما
                </Typography>
                <Grid container spacing={3} justifyContent="center">
                  {[
                    'ارسلان دوست زنگنه',
                    'پارسا ایمانی',
                    'محسن معین فر',
                    'آرش طاهری',
                    'رضا محمدی'
                  ].map((member, index) => (
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
                            borderRadius: 8,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                            transition: 'transform 0.3s ease-in-out',
                            '&:hover': {
                              transform: 'translateY(-8px)',
                              boxShadow: '0 6px 25px rgba(0,0,0,0.15)',
                            },
                            p: { xs: 2, sm: 3 },
                          }}
                        >
                          <CardContent sx={{ p: { xs: 1, sm: 2 }, textAlign: 'center' }}>
                            <Typography
                              variant="h6"
                              sx={{
                                color: '#023',
                                fontWeight: 'bold',
                                fontSize: { xs: '1rem', sm: '1.2rem', md: '1.5rem' },
                                fontFamily: "Vazir, IranSans, IRANYekan, Vazirmatn, Shabnam, sans-serif",
                              }}
                            >
                              {member}
                            </Typography>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </motion.div>

            {/* Contact Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Box
                sx={{
                  mt: { xs: 6, md: 8 },
                  p: { xs: 2, sm: 3, md: 4 },
                  bgcolor: 'white',
                  borderRadius: 8,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  textAlign: 'right',
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    color: '#023',
                    fontWeight: 'bold',
                    mb: { xs: 2, md: 3 },
                    fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2rem' },
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
                    mb: { xs: 1, md: 2 },
                    fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                    fontFamily: "Vazir, IranSans, IRANYekan, Vazirmatn, Shabnam, sans-serif",
                  }}
                >
                  برای ارتباط با ما می‌توانید از طریق راه‌های زیر اقدام کنید:
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
              </Box>
            </motion.div>
          </Container>
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  );
};

export default About;