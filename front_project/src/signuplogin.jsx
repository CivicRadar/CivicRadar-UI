import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Card,
} from "@mui/material";
import {
  Email,
  Visibility,
  VisibilityOff,
  Lock,
  Person,
  SupervisorAccount,
  AdminPanelSettings,
  Login,
} from "@mui/icons-material";
import cityImage1 from "./assets/city4.webp";
import cityImage2 from "./assets/city3.webp";
import cityImage3 from "./assets/city2.png";
import { useRef } from "react";

import logo from "./assets/logo.jpeg";
import logo5 from "./assets/logo5.webp";
import { signupCitizen, loginCitizenapi } from "./services/signup_login_api";
import { useCitizen } from "./context/CitizenContext";
import { useMayor } from "./context/MayorContext";
import { useAdmin } from "./context/AdminContext";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Slider from "react-slick"; 
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import LoadingComponent from "./Components/LoadingComponent.jsx"; 
import { useNavigate } from "react-router-dom"; 
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";


const AuthPage = () => {
  const { loginCitizen } = useCitizen();
  const { loginMayor } = useMayor();
  const { loginAdmin } = useAdmin();
  const navigate = useNavigate(); // استفاده از navigate

  const [showPassword, setShowPassword] = useState(false);
  const [authType, setAuthType] = useState("user");
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    FullName: "",
    Email: "",
    Password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [errorMessages, setErrorMessages] = useState({
    user: "", 
    manager: "", 
    admin: "", 
  });

  const isStrongPassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[@#$%^&*()!~]/.test(password);

    return (
      minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessages((prev) => ({ ...prev, [authType]: "" }));

    if (isSignup && formData.FullName.trim() === "") {
      setErrorMessages((prev) => ({
        ...prev,
        [authType]: "نام کامل نمی‌تواند خالی باشد ❌",
      }));
      return;
    }

    if (!formData.Email.includes("@")) {
      setErrorMessages((prev) => ({
        ...prev,
        [authType]: "فرمت ایمیل نامعتبر است ❌",
      }));
      return;
    }

    if (isSignup && !isStrongPassword(formData.Password)) {
      setErrorMessages((prev) => ({
        ...prev,
        [authType]:
          "رمز عبور باید حداقل ۸ کاراکتر، شامل حروف بزرگ، کوچک، عدد و کاراکتر خاص باشد ❌",
      }));
      return;
    }

    try {
      let response;

      if (authType === "user") {
        if (isSignup) {
          console.log("Citizen Signup Data:", formData);
          response = await signupCitizen(formData);
          console.log("Citizen Signup Success:", response);
          alert("ثبت‌نام موفقیت‌آمیز بود! ✅ برای تایید اکانت ایمیل فرستاده شده را تایید کنید");
        } else {
          console.log("Citizen Login Data:", formData);
          response = await loginCitizenapi({
            Email: formData.Email,
            Password: formData.Password,
            Type: "Citizen",
          });

          console.log("Citizen Login Response:", response);

          if (response.jwt) {
            loginCitizen(response);
            console.log("JWT Token Saved:", response.jwt);
            alert("ورود موفقیت‌آمیز بود! ✅");
            navigate("/CitizenDashboard"); // هدایت به داشبورد پس از ورود موفقیت‌آمیز

          } else {
            console.log(response.fail);
            const errorMsg =
              response.fail || "مشکلی پیش آمد! ❌ لطفاً دوباره تلاش کنید.";
            setErrorMessages((prev) => ({ ...prev, [authType]: errorMsg }));
          }
        }
      } else if (authType === "manager") {
        console.log("Mayor Login Data:", formData);
        response = await loginCitizenapi({
          Email: formData.Email,
          Password: formData.Password,
          Type: "Mayor",
        });

        console.log("Mayor Login Response:", response);

        if (response.jwt) {
          loginMayor(response);
          console.log("JWT Token Saved (Mayor):", response.jwt);
          alert("ورود شهردار موفقیت‌آمیز بود! ✅");
          navigate("/MayorDashboard"); 

        } else {
          const errorMsg =
            response.fail || "مشکلی پیش آمد! ❌ لطفاً دوباره تلاش کنید.";
          setErrorMessages((prev) => ({ ...prev, [authType]: errorMsg }));
        }
      } else if (authType === "admin") {
        console.log("Admin Login Data:", formData);
        response = await loginCitizenapi({
          Email: formData.Email,
          Password: formData.Password,
          Type: "Admin",
        });

        console.log("Admin Login Response:", response);

        if (response.jwt) {
          loginAdmin(response);
          console.log("JWT Token Saved (Admin):", response.jwt);
          alert("ورود ادمین موفقیت‌آمیز بود! ✅");
          navigate("/AdminDashboard"); 

        } else {
          const errorMsg =
            response.fail || "مشکلی پیش آمد! ❌ لطفاً دوباره تلاش کنید.";
          setErrorMessages((prev) => ({ ...prev, [authType]: errorMsg }));
        }
      } else {
        console.log("Invalid user type selected.");
      }
      setTimeout(() => setIsLoading(false), 3000);
    } catch (error) {
      console.error(
        "Authentication Error:",
        error.response?.data || error.message
      );
      // console.log(error) ;

      let errorMessage = "مشکلی پیش آمد! ❌ لطفاً دوباره تلاش کنید.";

      if (error.message == "user with this Email already exists.") {
        errorMessage = "user with this Email already exists.";
      } else if (error.message == "your email or password is incorrect") {
        errorMessage = "your email or password is incorrect";
      }
      else if (error.message == "Please verify your account via Email.") {
        errorMessage = "Please verify your account via Email.";
      }

      setErrorMessages((prev) => ({ ...prev, [authType]: errorMessage }));
    }
  };

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
        fontSize: "18px",
        fontWeight: 400,
      },
      button: {
        fontSize: "20px",
        fontWeight: 700,
      },
      subtitle1: {
        fontSize: "16px",
        fontWeight: 400,
        color: "#666",
      },
    },
  });
  const errorTranslations = {
    "your email or password is incorrect": ".ایمیل یا رمز عبور نادرست است",
    "User not found": "کاربری با این مشخصات یافت نشد.",
    "check pass":
      "رمز عبور باید حداقل ۸ کاراکتر، شامل حروف بزرگ، کوچک، عدد و کاراکتر خاص باشد",
    "Invalid email format": ".فرمت ایمیل نامعتبر است",
    "user with this Email already exists.": "کاربری با این ایمیل  وجود دارد",
    "pass fail":
      "تعداد زیادی تلاش ناموفق انجام شده است. لطفاً بعداً دوباره امتحان کنید.",
    "full name eror": ".لطفا نام کامل خود را وارد کنید ",
    "Please verify your account via Email." : "برای تایید اکانت ایمیل فرستاده شده را تایید کنید"
  };

  const errorMessageText = errorMessages[authType]
    ? typeof errorMessages[authType] === "string"
      ? errorMessages[authType]
      : JSON.stringify(errorMessages[authType])
    : "";

  const translatedErrorMessage = errorMessageText
    ? errorTranslations[errorMessageText] || errorMessageText
    : "";

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
  const sliderRef = useRef(null);

  const handlePrev = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };

  const handleNext = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  const handleButtonClick = (e) => {
    e.preventDefault();

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      handleSubmit(e);
    }, 1000);
  };

  return (
    <ThemeProvider theme={theme}>
      <LoadingComponent isLoading={isLoading} />

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
            height: {
              xs: "auto", 
              sm: "auto",
              md: "auto",   
              lg: "92vh",   
            },            boxSizing: "border-box",
          }}
        >
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
        bottom: 0; /* قرار دادن نقاط دقیقا در پایین تصویر */
        left: 0;
        width: 100%;
        background: rgba(0, 0, 0, 0.3); /* پس‌زمینه خاکستری با شفافیت */
        padding: 10px 0;
        text-align: center;
        border-radius: 0 0 0px 15px; /* گرد کردن گوشه‌ها */
    }

    .slick-dots li {
        display: inline-block;
        margin: 0 5px;
    }

    .slick-dots li button:before {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.5); /* نقاط در حالت عادی خاکستری روشن */
        transition: color 0.3s ease-in-out;
    }

    .slick-dots li.slick-active button:before {
        color: white; /* نقطه فعال سفید شود */
        font-size: 14px;
    }
    `}
            </style>
          </Box>

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
                maxWidth: "400px",
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

              <ToggleButtonGroup
                value={authType}
                exclusive
                onChange={(e, newValue) => {
                  if (newValue) {
                    setAuthType(newValue);
                    setIsSignup(false);
                  }
                }}
                sx={{
                  marginBottom: 3,
                  flexWrap: "wrap",
                  width: "100%",
                  "& .MuiToggleButton-root": {
                    fontSize: "16px",
                    fontWeight: "bold",
                    padding: "10px",
                  },
                }}
              >
                <ToggleButton value="user" sx={{ flex: 1, minWidth: "100px" }}>
                  <Person sx={{ marginRight: 1 }} /> شهروند
                </ToggleButton>
                <ToggleButton
                  value="manager"
                  sx={{ flex: 1, minWidth: "100px" }}
                >
                  <SupervisorAccount sx={{ marginRight: 1 }} /> مسئول
                </ToggleButton>
                <ToggleButton value="admin" sx={{ flex: 1, minWidth: "100px" }}>
                  <AdminPanelSettings sx={{ marginRight: 1 }} /> ادمین
                </ToggleButton>
              </ToggleButtonGroup>

              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{ marginBottom: 1 }}
              >
                {authType === "user"
                  ? isSignup
                    ? "ثبت‌نام شهروند"
                    : "ورود شهروند"
                  : authType === "manager"
                  ? "ورود مسئول"
                  : "ورود ادمین"}
              </Typography>

              <Typography variant="body2" color="gray" sx={{ marginBottom: 3 }}>
                {authType === "user"
                  ? isSignup
                    ? "یک حساب کاربری بسازید تا ادامه دهید"
                    : "برای ادامه، وارد شوید"
                  : "اطلاعات ورود خود را وارد کنید"}
              </Typography>

              <form
                onSubmit={handleSubmit}
                style={{ width: "100%", boxSizing: "border-box" }}
                noValidate
              >
                {authType === "user" && isSignup && (
                  <TextField
                    label="نام کامل"
                    name="FullName"
                    type="text"
                    value={formData.FullName}
                    onChange={handleChange}
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

                      "& input:-webkit-autofill": {
                        WebkitBoxShadow:
                          "0 0 0px 1000px white inset !important",
                        backgroundColor: "white !important",
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}

                <TextField
                  label="ایمیل"
                  name="Email"
                  type="email"
                  value={formData.Email}
                  onChange={handleChange}
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

                    "& input:-webkit-autofill": {
                      WebkitBoxShadow: "0 0 0px 1000px white inset !important",
                      backgroundColor: "white !important",
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  label="رمز عبور"
                  name="Password"
                  type={showPassword ? "text" : "password"}
                  value={formData.Password}
                  onChange={handleChange}
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

                    "& input:-webkit-autofill": {
                      WebkitBoxShadow: "0 0 0px 1000px white inset !important",
                      backgroundColor: "white !important",
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
                {isSignup && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: isStrongPassword(formData.Password)
                        ? "green"
                        : "red",
                      fontSize: "14px",
                      marginTop: "5px",
                    }}
                  >
                    {formData.Password.length > 0 &&
                      (isStrongPassword(formData.Password)
                        ? "رمز عبور قوی است ✅"
                        : "رمز عبور ضعیف است ❌ (حداقل ۸ کاراکتر، شامل حروف بزرگ، کوچک، عدد و کاراکتر خاص)")}
                  </Typography>
                )}

                {translatedErrorMessage && (
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
                    {translatedErrorMessage}
                  </Typography>
                )}

                <Button
                  type="button"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={isLoading}
                  onClick={handleButtonClick}
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
                  {isLoading ? (
                    <CircularProgress size={24} sx={{ color: "white" }} />
                  ) : isSignup ? (
                    "ثبت‌نام"
                  ) : (
                    "ورود"
                  )}
                </Button>
              </form>

              {authType === "user" && (
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
                  onClick={() => setIsSignup(!isSignup)}
                >
                  {isSignup
                    ? "قبلاً ثبت‌نام کرده‌اید؟ ورود"
                    : "تازه وارد هستید؟ ثبت‌نام کنید"}
                </Typography>
              )}
            </Paper>
          </Box>
        </Card>
      </Box>
    </ThemeProvider>
  );
};

export default AuthPage;
