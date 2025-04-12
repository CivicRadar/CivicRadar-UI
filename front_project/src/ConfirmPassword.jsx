import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Card,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  Lock,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate, useParams } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import cityImage1 from "./assets/city4.webp"; // Reuse the same images as AuthPage
import cityImage2 from "./assets/city3.webp";
import cityImage3 from "./assets/city2.png";

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

export default function ConfirmPassword() {
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { ui64, token } = useParams();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isStrongPassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[@#$%^&*()!~]/.test(password);

    return minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (Password !== ConfirmPassword) {
      setError("رمزهای عبور وارد شده مطابقت ندارند.");
      setLoading(false);
      return;
    }

    if (!isStrongPassword(Password)) {
      setError(
        "رمز عبور باید حداقل ۸ کاراکتر، شامل حروف بزرگ، کوچک، عدد و کاراکتر خاص باشد."
      );
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/auth/password-reset-complete/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Password: Password,
            ConfirmPassword: ConfirmPassword,
            token: token,
            ui64: ui64,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSuccess(data.success || "رمز عبور با موفقیت تغییر یافت. اکنون می‌توانید وارد شوید.");
        setTimeout(() => navigate("/signuplogin"), 2000);
      } else {
        const data = await response.json();
        setError(data.message || "خطایی در تغییر رمز عبور رخ داد.");
      }
    } catch (err) {
      setError("خطایی رخ داد. لطفاً دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 8000,
    arrows: false,
    fade: true,
    dotsClass: "slick-dots",
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          background:
            "linear-gradient(135deg, #6b48ff 0%, #c9a7ff 50%, #e0c3fc 100%)",
          backgroundImage:
            "url('https://www.transparenttextures.com/patterns/fabric-of-squares.png')",
          backgroundBlendMode: "overlay",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: { xs: 2, sm: 3, md: 5 },
          boxSizing: "border-box",
          boxShadow: "inset 0 0 200px rgba(107, 72, 255, 0.2)",
        }}
      >
        <Card
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: 8,
            width: { xs: "95%", sm: "85%", md: "90%", lg: "85%" },
            maxWidth: "1400px",
            height: { xs: "auto", sm: "auto", md: "auto", lg: "92vh" },
            boxSizing: "border-box",
          }}
        >
          {/* Slider Section (Hidden on Mobile) */}
          <Box
            sx={{
              width: { xs: "0%", md: "50%" },
              height: { xs: "auto", md: "100%" },
              display: { xs: "none", md: "block" },
              overflow: "hidden",
              position: "relative",
            }}
          >
            <Slider {...sliderSettings}>
              {[cityImage1, cityImage2, cityImage3].map((image, index) => (
                <div key={index} style={{ width: "100%", height: "100%" }}>
                  <img
                    src={image}
                    alt={`City View ${index + 1}`}
                    style={{
                      width: "100%",
                      height: "92vh",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </div>
              ))}
            </Slider>
            <style>
              {`
                .slick-dots {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    background: rgba(0, 0, 0, 0.3);
                    padding: 10px 0;
                    text-align: center;
                    border-radius: 0 0 0px 15px;
                }

                .slick-dots li {
                    display: inline-block;
                    margin: 0 5px;
                }

                .slick-dots li button:before {
                    font-size: 12px;
                    color: rgba(255, 255, 255, 0.5);
                    transition: color 0.3s ease-in-out;
                }

                .slick-dots li.slick-active button:before {
                    color: white;
                    font-size: 14px;
                }
              `}
            </style>
          </Box>

          {/* Form Section */}
          <Box
            sx={{
              width: { xs: "100%", md: "50%" },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: { xs: 2, sm: 4 },
              boxSizing: "border-box",
            }}
          >
            <Paper
              elevation={3}
              sx={{
                width: { xs: "90%", sm: "85%", md: "80%" },
                maxWidth: "400-px",
                textAlign: "center",
                padding: { xs: 2, sm: 3, md: 4 },
                borderRadius: 3,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 2,
                }}
              >
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  sx={{
                    color: "#1976D2",
                    textAlign: "center",
                    textShadow: "2px 2px 8px rgba(0, 0, 0, 0.2)",
                    padding: 1,
                  }}
                >
                  سامانه شهر سنج
                </Typography>
              </Box>

              <Typography variant="h5" fontWeight="bold" sx={{ marginBottom: 1 }}>
                تنظیم رمز عبور جدید
              </Typography>

              <Typography variant="body2" color="gray" sx={{ marginBottom: 3 }}>
                رمز عبور جدید خود را وارد کنید
              </Typography>

              <form onSubmit={handleSubmit} style={{ width: "100%", boxSizing: "border-box" }} noValidate>
                <TextField
                  label="رمز عبور جدید"
                  type={showPassword ? "text" : "password"}
                  value={Password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  required
                  margin="normal"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#ccc",
                      },
                      "&:hover fieldset": {
                        borderColor: "#aaa",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#4a90e2",
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={togglePasswordVisibility}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="تکرار رمز عبور"
                  type={showPassword ? "text" : "password"}
                  value={ConfirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  fullWidth
                  required
                  margin="normal"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#ccc",
                      },
                      "&:hover fieldset": {
                        borderColor: "#aaa",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#4a90e2",
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={togglePasswordVisibility}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: isStrongPassword(Password) ? "green" : "red",
                    fontSize: "14px",
                    marginTop: "5px",
                  }}
                >
                  {Password.length > 0 &&
                    (isStrongPassword(Password)
                      ? "رمز عبور قوی است ✅"
                      : "رمز عبور ضعیف است ❌ (حداقل ۸ کاراکتر، شامل حروف بزرگ، کوچک، عدد و کاراکتر خاص)")}
                </Typography>

                {error && (
                  <Typography
                    variant="body1"
                    color="error"
                    sx={{
                      backgroundColor: "#ffebee",
                      color: "#d32f2f",
                      padding: "10px",
                      borderRadius: "5px",
                      textAlign: "center",
                      marginBottom: "15px",
                      fontWeight: "bold",
                      fontSize: "16px",
                      boxShadow: "0px 0px 5px rgba(211, 47, 47, 0.5)",
                      margin: 2,
                    }}
                  >
                    {error}
                  </Typography>
                )}
                {success && (
                  <Typography
                    variant="body1"
                    sx={{
                      backgroundColor: "#e8f5e9",
                      color: "#2e7d32",
                      padding: "10px",
                      borderRadius: "5px",
                      textAlign: "center",
                      marginBottom: "15px",
                      fontWeight: "bold",
                      fontSize: "16px",
                      boxShadow: "0px 0px 5px rgba(46, 125, 50, 0.5)",
                      margin: 2,
                    }}
                  >
                    {success}
                  </Typography>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={loading}
                  sx={{
                    marginTop: 2,
                    backgroundColor: "#0073a8",
                    color: "white",
                    fontSize: "22px",
                    fontWeight: "bold",
                    padding: "12px 0",
                    borderRadius: "8px",
                    boxShadow: "0px 4px 10px rgba(0, 115, 168, 0.3)",
                    textAlign: "center",
                    letterSpacing: "1px",
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      backgroundColor: "#005f87",
                      boxShadow: "0px 4px 12px rgba(0, 95, 135, 0.4)",
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: "white" }} />
                  ) : (
                    "تأیید"
                  )}
                </Button>
              </form>

              <Typography
                variant="body1"
                sx={{
                  marginTop: 2,
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "18px",
                  color: "#1976D2",
                  textDecoration: "none",
                  textAlign: "center",
                  letterSpacing: "0.5px",
                  transition: "color 0.3s ease-in-out",
                  "&:hover": {
                    color: "#0d47a1",
                  },
                }}
                onClick={() => navigate("/signuplogin")}
              >
                بازگشت به ورود
              </Typography>
            </Paper>
          </Box>
        </Card>
      </Box>
    </ThemeProvider>
  );
}