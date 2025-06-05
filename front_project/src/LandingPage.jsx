import { Typography, Box, Button, Container, Grid, Card, CardContent, useMediaQuery } from "@mui/material";
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Person, People, Campaign } from "@mui/icons-material";
import { useState, useEffect } from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AppBar, Toolbar } from "@mui/material";
import logo from "./assets/lgo.png";
import heroImage from "./assets/landing01.svg";
import searchingImage from "./assets/searching.svg";
import reportingImage from "./assets/reporting.svg";
import solvingImage from "./assets/solving.svg";
import IranMap from "./Components/iranmap";
import ReportFeed from "./Components/Reportsfeed";
import { keyframes } from '@emotion/react';
import { GlobalStyles } from '@mui/system';
import { Link } from '@mui/material';
import Typewriter from 'typewriter-effect';
import { getLandingStats } from "./services/mayor-api";

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
});

const globalStyles = (
  <GlobalStyles
    styles={{
      ':root': {
        '--color-primary': '#2584ff',
        '--color-secondary': '#00d9ff',
        '--color-accent': '#ff3400',
        '--color-headings': '#1b0760',
        '--color-body': '#918ca4',
      },
      '*': {
        boxSizing: 'border-box',
        margin: 0,
        padding: 0,
      },
      body: {
        overflowX: 'hidden',
        fontFamily: "Vazir, IranSans, IRANYekan, Vazirmatn, Shabnam, sans-serif",
      }
    }}
  />
);

const WaveShape = () => (
  <Box
    sx={{
      position: 'absolute',
      bottom: -2,
      left: 0,
      width: '100%',
      overflow: 'hidden',
      lineHeight: 0,
      zIndex: 1,
    }}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      style={{
        position: 'relative',
        display: 'block',
        width: 'calc(100% + 1.3px)',
        height: '150px',
        transform: 'rotateY(180deg)',
      }}
    >
      <path
        d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
        style={{
          fill: '#ffffff',
        }}
      />
    </svg>
  </Box>
);


function LandingPage() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');
  const [stats, setStats] = useState({
    MayorCount: 0,
    UserCount: 0,
    TotalReportCount: 0,
    TotalResolvedReportCount: 0
  });
  const BASE = `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}`;
  const { scrollY } = useScroll();
  const buttonTextColor = useTransform(scrollY, [500, 1000], ['white', '#02634b']);
  const buttonBorder = useTransform(scrollY, [500, 1000], ['none', '1px solid #02634b']);
  const navOpacity = useTransform(scrollY, [0, 100], [1, 0]);
  const navY = useTransform(scrollY, [0, 100], [0, -100]);

  const scrollToTop = () => {
    const currentPosition = window.pageYOffset;
    const targetPosition = 0;
    const distance = targetPosition - currentPosition;
    const duration = 800; // Duration in milliseconds
    let start = null;

    function animation(currentTime) {
      if (start === null) start = currentTime;
      const timeElapsed = currentTime - start;
      const progress = Math.min(timeElapsed / duration, 1);
      
      // Easing function for smooth landing
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      window.scrollTo(0, currentPosition + distance * easeOutQuart);
      
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    }

    requestAnimationFrame(animation);
  };

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const toPersianNumber = (num) => {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return num.toString().replace(/\d/g, x => persianDigits[x]);
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getLandingStats();
        console.log("Fetched stats:", data); // Debug log
        setStats(data);
      } catch (err) {
        console.error("Error fetching landing stats:", err);
      }
    };

    fetchStats();
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
    <ThemeProvider theme={theme}>
      <Box sx={{ overflowX: "hidden" }}>
        {globalStyles}
        
        {/* Top Navigation */}
        <motion.div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            padding: isMobile ? '16px' : '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            opacity: isMobile ? navOpacity : 1,
            transform: isMobile ? `translateY(${navY}px)` : 'none',
            transition: 'all 0.3s ease'
          }}
        >
          <motion.img 
            src={logo} 
            alt="Logo" 
            style={{ 
              height: "40px",
              filter: 'drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.1))',
              cursor: 'pointer'
            }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onClick={scrollToTop}
            whileHover={{ scale: 1.05 }}
          />
          <motion.button
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              border: buttonBorder,
              borderRadius: "4px",
              padding: "8px 16px",
              cursor: "pointer",
              color: buttonTextColor,
              fontSize: "1rem",
              fontWeight: "bold",
              transition: "all 0.3s ease",
            }}
            whileHover={{
              background: "rgba(255, 255, 255, 0.2)",
              transform: "translateY(-2px)",
            }}
            onClick={() => navigate("/signuplogin")}
          >
            ورود / ثبت نام
          </motion.button>
        </motion.div>

        {/* Hero Section */}
        <Box
          component="section"
          sx={{
            minHeight: { xs: "80vh", md: "90vh" },
            width: "100vw",
            margin: 0,
            padding: 0,
            background: "linear-gradient(135deg, rgb(2, 99, 75), #023, #034, #056)",
            backgroundSize: { xs: "200% 200%", md: "400% 400%" },
            animation: "gradientAnimation 10s ease infinite",
            color: "white",
            position: "relative",
            overflow: "hidden",
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: {
                xs: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.1) 0%, rgba(0, 0, 0, 0) 50%)',
                md: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, rgba(0, 0, 0, 0) 50%)'
              },
              pointerEvents: 'none',
            }
          }}
        >
          {/* Hero Content */}
          <Container maxWidth="lg" sx={{ height: "100%", pt: { xs: 12, md: 16 } }}>
            <Grid 
              container 
              spacing={4} 
              sx={{ 
                height: "100%",
                alignItems: "center",
                position: "relative",
                zIndex: 1,
              }}
            >
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <Typography 
                    variant="h1" 
                    component="h1" 
                    sx={{ 
                      fontWeight: "bold", 
                      mb: 3, 
                      textAlign: "right",
                      fontSize: { xs: "2rem", sm: "2.5rem", md: "3.5rem", lg: "4rem" },
                      background: "linear-gradient(45deg, #fff, #e0e0e0)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      lineHeight: 1.2,
                      maxWidth: "800px",
                      marginRight: "auto",
                    }}
                  >
                    سامانه هوشمند گزارش مشکلات شهری
                  </Typography>
                  <Typography 
                    variant="h2" 
                    sx={{ 
                      color: "rgba(255, 255, 255, 0.8)", 
                      mb: 4, 
                      textAlign: "right",
                      fontSize: { xs: "1.2rem", sm: "1.5rem", md: "1.8rem" },
                    }}
                  >
                    با ما در ساختن شهری بهتر همراه شوید
                  </Typography>
                  <Box sx={{ 
                    display: "flex", 
                    gap: 2, 
                    justifyContent: "flex-end",
                    flexDirection: { xs: "column", sm: "row" }
                  }}>
                    <Button
                      variant="contained"
                      size="large"
                      sx={{
                        background: "var(--color-secondary)",
                        color: "#023",
                        padding: { xs: "0.8rem 2rem", md: "1rem 3rem" },
                        fontSize: { xs: "1rem", md: "1.2rem" },
                        transition: "all 0.3s ease",
                        '&:hover': {
                          background: "#00b8d4",
                          transform: "translateY(-2px)",
                        },
                      }}
                      onClick={() => navigate("/signuplogin")}
                    >
                      شروع کنید
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      sx={{
                        color: "var(--color-secondary)",
                        borderColor: "var(--color-secondary)",
                        padding: { xs: "0.8rem 2rem", md: "1rem 3rem" },
                        fontSize: { xs: "1rem", md: "1.2rem" },
                        transition: "all 0.3s ease",
                        '&:hover': {
                          borderColor: "#00b8d4",
                          background: "rgba(0, 229, 255, 0.1)",
                          transform: "translateY(-2px)",
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
                  transition={{ duration: 1, delay: 0.3 }}
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
                      maxHeight: { xs: '300px', md: '500px' },
                      filter: 'drop-shadow(0px 20px 40px rgba(0, 0, 0, 0.25))',
                    }}
                  />
                </motion.div>
              </Grid>
            </Grid>
          </Container>
          <WaveShape />
        </Box>

        {/* Statistics Section */}
        <Box
          sx={{
            py: { xs: 8, md: 12 },
            mt: 0,
            position: 'relative',
            background: '#ffffff',
            overflow: 'hidden',
          }}
        >
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
            <Typography 
              variant="h3" 
              component="h2" 
              sx={{ 
                textAlign: "center", 
                mb: 8, 
                color: "#023",
                fontSize: { xs: '2.5rem', md: '3rem' },
                fontWeight: 'bold'
              }}
            >
              <Typewriter
                onInit={(typewriter) => {
                  typewriter
                    .typeString('آمار و دستاوردها')
                    .start();
                }}
                options={{
                  cursor: '|',
                  delay: 50,
                  deleteSpeed: null,
                  autoStart: false,
                }}
              />
            </Typography>

            {/* First Stat - Citizens */}
            <Grid 
              container 
              spacing={6} 
              alignItems="center" 
              sx={{ mb: 12 }}
            >
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography
                      variant="h1"
                      sx={{
                        color: '#0288d1',
                        fontWeight: 'bold',
                        fontSize: { xs: '2.5rem', md: '3.5rem' },
                        mb: 2,
                        textAlign: 'right',
                      }}
                    >
                      <Typewriter
                        key={`user-count-${stats.UserCount}`}
                        onInit={(typewriter) => {
                          typewriter
                            .typeString(toPersianNumber(stats.UserCount))
                            .start();
                        }}
                        options={{
                          cursor: '|',
                          delay: 30,
                          deleteSpeed: null,
                          autoStart: true,
                        }}
                      />
                    </Typography>
                    <Typography
                      variant="h2"
                      sx={{
                        color: '#333',
                        mb: 2,
                        fontSize: { xs: '1.8rem', md: '2.2rem' },
                        textAlign: 'right',
                      }}
                    >
                      <Typewriter
                        onInit={(typewriter) => {
                          typewriter
                            .typeString('شهروند وظیفه شناس')
                            .start();
                        }}
                        options={{
                          cursor: '|',
                          delay: 40,
                          deleteSpeed: null,
                          autoStart: false,
                        }}
                      />
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: '#666',
                        fontSize: { xs: '1rem', md: '1.1rem' },
                        lineHeight: 1.8,
                        textAlign: 'right',
                      }}
                    >
                      <Typewriter
                        key={`user-desc-${stats.TotalReportCount}`}
                        onInit={(typewriter) => {
                          typewriter
                            .typeString(`شهروندان فعال ما از سراسر کشور، با ارسال ${toPersianNumber(stats.TotalReportCount)} گزارش، نقش مهمی در بهبود وضعیت شهری ایفا کرده‌اند. این مشارکت گسترده نشان‌دهنده اعتماد و همکاری مؤثر مردم در مدیریت شهری است.`)
                            .start();
                        }}
                        options={{
                          cursor: '|',
                          delay: 20,
                          deleteSpeed: null,
                          autoStart: true,
                        }}
                      />
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <img 
                    src={searchingImage} 
                    alt="Citizens Statistics" 
                    style={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: '400px',
                      objectFit: 'contain'
                    }}
                  />
                </motion.div>
              </Grid>
            </Grid>

            {/* Second Stat - Administrations */}
            <Grid 
              container 
              spacing={6} 
              alignItems="center" 
              sx={{ mb: 12 }}
              direction={{ xs: 'column-reverse', md: 'row' }}
            >
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <img 
                    src={reportingImage} 
                    alt="Administration Statistics" 
                    style={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: '400px',
                      objectFit: 'contain'
                    }}
                  />
                </motion.div>
              </Grid>
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography
                      variant="h1"
                      sx={{
                        color: '#0288d1',
                        fontWeight: 'bold',
                        fontSize: { xs: '2.5rem', md: '3.5rem' },
                        mb: 2,
                        textAlign: 'right',
                      }}
                    >
                      <Typewriter
                        key={`mayor-count-${stats.MayorCount}`}
                        onInit={(typewriter) => {
                          typewriter
                            .typeString(toPersianNumber(stats.MayorCount))
                            .start();
                        }}
                        options={{
                          cursor: '|',
                          delay: 30,
                          deleteSpeed: null,
                          autoStart: true,
                        }}
                      />
                    </Typography>
                    <Typography
                      variant="h2"
                      sx={{
                        color: '#333',
                        mb: 2,
                        fontSize: { xs: '1.8rem', md: '2.2rem' },
                        textAlign: 'right',
                      }}
                    >
                      <Typewriter
                        onInit={(typewriter) => {
                          typewriter
                            .typeString('مسئولین شهری')
                            .start();
                        }}
                        options={{
                          cursor: '|',
                          delay: 40,
                          deleteSpeed: null,
                          autoStart: false,
                        }}
                      />
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: '#666',
                        fontSize: { xs: '1rem', md: '1.1rem' },
                        lineHeight: 1.8,
                        textAlign: 'right',
                      }}
                    >
                      <Typewriter
                        key={`mayor-desc-${stats.MayorCount}`}
                        onInit={(typewriter) => {
                          typewriter
                            .typeString(`همکاری ${toPersianNumber(stats.MayorCount)} مسئول شهری در سامانه، نشان‌دهنده اعتماد نهادهای رسمی به این پلتفرم است. این مشارکت باعث تسهیل ارتباط مستقیم بین مردم و مسئولین شده و روند رسیدگی به مشکلات شهری را سرعت بخشیده است.`)
                            .start();
                        }}
                        options={{
                          cursor: '|',
                          delay: 20,
                          deleteSpeed: null,
                          autoStart: true,
                        }}
                      />
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            </Grid>

            {/* Third Stat - Solved Problems */}
            <Grid 
              container 
              spacing={6} 
              alignItems="center"
            >
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography
                      variant="h1"
                      sx={{
                        color: '#0288d1',
                        fontWeight: 'bold',
                        fontSize: { xs: '2.5rem', md: '3.5rem' },
                        mb: 2,
                        textAlign: 'right',
                      }}
                    >
                      <Typewriter
                        key={`resolved-count-${stats.TotalResolvedReportCount}`}
                        onInit={(typewriter) => {
                          typewriter
                            .typeString(toPersianNumber(stats.TotalResolvedReportCount))
                            .start();
                        }}
                        options={{
                          cursor: '|',
                          delay: 30,
                          deleteSpeed: null,
                          autoStart: true,
                        }}
                      />
                    </Typography>
                    <Typography
                      variant="h2"
                      sx={{
                        color: '#333',
                        mb: 2,
                        fontSize: { xs: '1.8rem', md: '2.2rem' },
                        textAlign: 'right',
                      }}
                    >
                      <Typewriter
                        onInit={(typewriter) => {
                          typewriter
                            .typeString('مشکل شهری رسیدگی شده')
                            .start();
                        }}
                        options={{
                          cursor: '|',
                          delay: 40,
                          deleteSpeed: null,
                          autoStart: false,
                        }}
                      />
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: '#666',
                        fontSize: { xs: '1rem', md: '1.1rem' },
                        lineHeight: 1.8,
                        textAlign: 'right',
                      }}
                    >
                      <Typewriter
                        key={`resolved-desc-${stats.TotalResolvedReportCount}-${stats.MayorCount}`}
                        onInit={(typewriter) => {
                          typewriter
                            .typeString(`با همکاری ${toPersianNumber(stats.MayorCount)} مسئول شهری، تاکنون ${toPersianNumber(stats.TotalResolvedReportCount)} مشکل شهری با موفقیت حل شده است. این آمار نشان‌دهنده کارآمدی سیستم و تعهد مسئولین به رسیدگی به مشکلات گزارش شده توسط شهروندان است.`)
                            .start();
                        }}
                        options={{
                          cursor: '|',
                          delay: 20,
                          deleteSpeed: null,
                          autoStart: true,
                        }}
                      />
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <img 
                    src={solvingImage} 
                    alt="Solved Problems Statistics" 
                    style={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: '400px',
                      objectFit: 'contain'
                    }}
                  />
                </motion.div>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Iran Map Section */}
        <Box sx={{ 
          pt: 12,
          background: "#fff",
          position: 'relative',
          overflow: 'hidden'
        }}>
          <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Typography 
                variant="h3" 
                component="h2" 
                sx={{ 
                  textAlign: "center", 
                  mb: 6, 
                  color: "#023",
                  fontSize: { xs: '2.5rem', md: '3rem' },
                  fontWeight: 'bold'
                }}
              >
                پراکندگی گزارشات در کشور
              </Typography>
              <Box sx={{ 
                height: { xs: "400px", sm: "600px", md: "800px" },
                width: "100%",
                maxWidth: "1600px",
                mx: "auto",
                borderRadius: 4,
                overflow: 'hidden'
              }}>
                <IranMap />
              </Box>
            </motion.div>
          </Container>
        </Box>

        {/* Reports Feed Section */}
        <Box sx={{ 
          pb: 12, 
          background: "#fff",
          position: 'relative',
          overflow: 'hidden'
        }}>
          <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Typography 
                variant="h3" 
                component="h2" 
                sx={{ 
                  textAlign: "center", 
                  mb: 6, 
                  color: "#023",
                  fontSize: { xs: '2.5rem', md: '3rem' },
                  fontWeight: 'bold'
                }}
              >
                آخرین گزارشات
              </Typography>
              <ReportFeed />
            </motion.div>
          </Container>
        </Box>

        {/* Features Section */}
        <Box sx={{ 
          py: 8, 
          background: "#fff",
          position: 'relative',
          overflow: 'hidden'
        }}>
          <Container sx={{ position: 'relative', zIndex: 1 }}>
            <Grid container spacing={4}>
              {[
                {
                  title: "گزارش مشکلات شهری",
                  description: "به راحتی مشکلات شهری را گزارش دهید",
                  color: "linear-gradient(135deg, #0288d1, #01579b)"
                },
                {
                  title: "پیگیری آنلاین",
                  description: "وضعیت گزارش‌های خود را پیگیری کنید",
                  color: "linear-gradient(135deg, #0097a7, #006064)"
                },
                {
                  title: "همکاری با شهرداری",
                  description: "ارتباط مستقیم با مسئولین شهری",
                  color: "linear-gradient(135deg, #00897b, #004d40)"
                }
              ].map((feature, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    viewport={{ once: true }}
                  >
                    <Card
                      sx={{
                        height: "100%",
                        background: feature.color,
                        color: 'white',
                        borderRadius: 4,
                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-10px)',
                          boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.25)',
                        },
                      }}
                    >
                      <CardContent>
                        <Typography 
                          variant="h5" 
                          component="h3" 
                          sx={{ 
                            mb: 2, 
                            color: 'rgba(255, 255, 255, 0.9)',
                            textAlign: "right" 
                          }}
                        >
                          {feature.title}
                        </Typography>
                        <Typography 
                          sx={{ 
                            color: 'rgba(255, 255, 255, 0.8)',
                            textAlign: "right"
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
          </Container>
        </Box>

        {/* Join Now Section */}
        <Box
          sx={{
            py: 5,
            background: 'linear-gradient(135deg, rgb(2, 99, 75), #023)',
            position: 'relative',
            overflow: 'hidden',
            color: 'white',
            textAlign: 'center'
          }}
        >
          <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Typography
                variant="h5"
                sx={{
                  mb: 6,
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: { xs: '1.2rem', md: '1.5rem' },
                }}
              >
                به جمع هزاران شهروند مسئولیت‌پذیر بپیوندید و در ساختن شهری بهتر سهیم باشید
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate("/signuplogin")}
                sx={{
                  bgcolor: 'white',
                  color: '#023',
                  px: 6,
                  py: 2,
                  fontSize: '1.2rem',
                  borderRadius: '50px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
                  }
                }}
              >
                ثبت نام کنید
              </Button>
            </motion.div>
          </Container>
        </Box>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            bgcolor: '#023',
            color: 'white',
            py: 8,
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            direction: 'rtl'
          }}
        >
          <Container>
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Box sx={{ mb: 4, textAlign: 'right' }}>
                  <img src={logo} alt="Logo" style={{ height: '50px', marginBottom: '20px' }} />
                  <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    سامانه هوشمند گزارش مشکلات شهری
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                    لینک‌های مفید
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-end' ,direction: 'ltr'}}>
                    <Link 
                      component="button"
                      onClick={() => navigate("/about")}
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.7)',
                        textDecoration: 'none',
                        '&:hover': { color: 'white' }
                      }}
                    >
                      درباره ما
                    </Link>
                    <Link 
                      component="button"
                      onClick={() => navigate("/privacy")}
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.7)',
                        textDecoration: 'none',
                        '&:hover': { color: 'white' }
                      }}
                    >
                      حریم خصوصی
                    </Link>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'right' ,direction: 'ltr'}}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                    تماس با ما
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-end' }}>
                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      ایمیل: info@shahrsanj.ir
                    </Typography>
                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)'}}>
                      تلفن: ۷۳۲۲۵۳۰۳-۰۲۱
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
            <Box sx={{ mt: 8, pt: 4, borderTop: '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'center' }}>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                © {new Date().getFullYear()} شهرسنج. تمامی حقوق محفوظ است.
              </Typography>
            </Box>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default LandingPage;
