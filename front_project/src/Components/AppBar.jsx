import { Box, Button, ThemeProvider, createTheme } from "@mui/material";
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import logo from "../assets/lgo.png";
import { useMediaQuery } from "@mui/material";

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

const AppBar = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');
  const { scrollY } = useScroll();
  const buttonTextColor = useTransform(scrollY, [0, 0], ['white', '#02634b']);
  const buttonBorder = useTransform(scrollY, [0, 0], ['none', '1px solid #02634b']);
  const navOpacity = useTransform(scrollY, [0, 100], [1, 0]);
  const navY = useTransform(scrollY, [0, 100], [0, -100]);

  const scrollToTop = () => {
    navigate("/")
  };

  return (
    <ThemeProvider theme={theme}>
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          direction: "ltr",
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
            fontFamily: "Vazir, IranSans, IRANYekan, Vazirmatn, Shabnam, sans-serif",
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
    </ThemeProvider>
  );
};

export default AppBar; 