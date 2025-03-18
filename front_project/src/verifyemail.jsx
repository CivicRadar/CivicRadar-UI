import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { Container, Typography, Box, CircularProgress, Paper, Button } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading");
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      axios
        .get(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/auth/email-verification/${token}/`)
        .then((res) => {
          setStatus(res.data.success ? "success" : "fail");
        })
        .catch(() => {
          setStatus("fail");
        });
    } else {
      setStatus("fail");
    }
  }, [searchParams]);

  const theme = createTheme({
    typography: {
      fontFamily: "Vazir ,IranSans, IRANYekan, Vazirmatn, Shabnam, sans-serif",
      fontSize: 18,
      h1: {
        fontSize: "28px",
        fontWeight: 700,
      },
      h2: {
        fontSize: "24px",
        fontWeight: 700,
      },
      h3: {
        fontSize: "20px",
        fontWeight: 700,
      },
      body1: {
        fontSize: "16px", 
        fontWeight: 400,
      },
      button: {
        fontSize: "18px", 
        fontWeight: 700,
      },
      subtitle1: {
        fontSize: "14px",
        fontWeight: 400,
        color: "#666",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
          "linear-gradient(135deg, #6b48ff 0%, #c9a7ff 50%, #e0c3fc 100%)",
          backgroundImage: "url('https://www.transparenttextures.com/patterns/fabric-of-squares.png')",
          backgroundBlendMode: "overlay",
          padding: "20px", 
        }}
      >
        <Paper
          elevation={6}
          sx={{
            padding: { xs: "20px", sm: "30px" }, 
            borderRadius: "12px",
            textAlign: "center",
            maxWidth: { xs: "90%", sm: "450px" }, 
            width: "100%",
            background: "white",
          }}
        >
          {status === "loading" && (
            <>
              <HourglassEmptyIcon sx={{ fontSize: 50, color: "#ff9800" }} />
              <Typography variant="h5" sx={{ mt: 2, fontWeight: "bold", color: "#ff9800", fontSize: { xs: "20px", sm: "24px" } }}>
                در حال تأیید ایمیل...
              </Typography>
              <CircularProgress sx={{ mt: 2, color: "#ff9800" }} />
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircleIcon sx={{ fontSize: 50, color: "#4caf50" }} />
              <Typography variant="h5" sx={{ mt: 2, fontWeight: "bold", color: "#4caf50", fontSize: { xs: "20px", sm: "24px" } }}>
                ✅! ایمیل شما با موفقیت تأیید شد
              </Typography>
              <Typography variant="body1" sx={{ mt: 1, color: "#333", fontSize: { xs: "14px", sm: "16px" } }}>
                اکنون می‌توانید وارد حساب کاربری خود شوید
              </Typography>
              <Button
                variant="contained"
                color="success"
                sx={{
                  mt: 3,
                  px: { xs: 3, sm: 4 }, 
                  py: { xs: 1, sm: 1.5 },
                  fontSize: { xs: "14px", sm: "18px" },
                }}
                onClick={() => navigate("/signuplogin")}
              >
                ورود به حساب
              </Button>
            </>
          )}

          {status === "fail" && (
            <>
              <ErrorIcon sx={{ fontSize: 50, color: "#d32f2f" }} />
              <Typography variant="h5" sx={{ mt: 2, fontWeight: "bold", color: "#d32f2f", fontSize: { xs: "20px", sm: "24px" } }}>
                ❌ خطا در تأیید ایمیل
              </Typography>
              <Typography variant="body1" sx={{ mt: 1, color: "#333", fontSize: { xs: "14px", sm: "16px" } }}>
                لینک نامعتبر است یا قبلاً استفاده شده است
              </Typography>
              <Button
                variant="contained"
                color="error"
                sx={{
                  mt: 3,
                  px: { xs: 3, sm: 4 },
                  py: { xs: 1, sm: 1.5 },
                  fontSize: { xs: "14px", sm: "18px" },
                }}
                onClick={() => navigate("/signuplogin")}
              >
                ثبت‌نام مجدد
              </Button>
            </>
          )}
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default VerifyEmail;
