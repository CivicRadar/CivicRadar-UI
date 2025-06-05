import { Box, Container, Grid, Typography, Link, ThemeProvider, createTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import logo from "../assets/lgo.png";

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

const Footer = () => {
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={theme}>
      <Box
        component="footer"
        sx={{
          bgcolor: '#023',
          color: 'white',
          py: 8,
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          direction: 'rtl',
          fontFamily: "Vazir, IranSans, IRANYekan, Vazirmatn, Shabnam, sans-serif",
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
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-end', direction: 'ltr' }}>
                  <Link 
                    component="button"
                    onClick={() => navigate("/about")}
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)',
                      textDecoration: 'none',
                      '&:hover': { color: 'white' },
                      fontFamily: "Vazir, IranSans, IRANYekan, Vazirmatn, Shabnam, sans-serif",
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
                      '&:hover': { color: 'white' },
                      fontFamily: "Vazir, IranSans, IRANYekan, Vazirmatn, Shabnam, sans-serif",
                    }}
                  >
                    حریم خصوصی
                  </Link>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'right', direction: 'ltr' }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                  تماس با ما
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-end' }}>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    ایمیل: info@shahrsanj.ir
                  </Typography>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
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
    </ThemeProvider>
  );
};

export default Footer; 