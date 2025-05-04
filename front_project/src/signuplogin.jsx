import React, { useState, useRef, useEffect } from "react";
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
} from "@mui/icons-material";
import cityImage1 from "./assets/city4.webp";
import cityImage2 from "./assets/city3.webp";
import cityImage3 from "./assets/city2.png";
import { signupCitizen, loginCitizenapi } from "./services/signup_login_api";
import { useCitizen } from "./context/CitizenContext";
import { useMayor } from "./context/MayorContext";
import { useAdmin } from "./context/AdminContext";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate, useParams } from "react-router-dom"; // Added useParams for URL params
import Swal from "sweetalert2";


const AuthPage = () => {
  const { loginCitizen } = useCitizen();
  const { loginMayor } = useMayor();
  const { loginAdmin } = useAdmin();
  const navigate = useNavigate();
  const { ui64, token } = useParams(); // Extract token and ui64 from URL

  const [showPassword, setShowPassword] = useState(false);
  // const [authType, setAuthType] = useState("user");
  const [isSignup, setIsSignup] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(!!token && !!ui64); // Set based on URL params
  const [formData, setFormData] = useState({
    FullName: "",
    Email: "",
    Password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [emailSentMessage, setEmailSentMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // const [errorMessages, setErrorMessages] = useState({
  //   user: "",
  //   manager: "",
  //   admin: "",
  // });

  // Update resetFormData when token changes (e.g., on page load)
  useEffect(() => {
    if (token && ui64) {
      setResetFormData((prev) => ({ ...prev, Token: token }));
    }
  }, [token, ui64]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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

  const handleSubmit = async e => {
    e.preventDefault();
    setErrorMessage("");

    if (isSignup && formData.FullName.trim() === "") {
      setErrorMessage("نام کامل نمی‌تواند خالی باشد ❌");
      return;
    }
    if (!formData.Email.includes("@")) {
      setErrorMessage("فرمت ایمیل نامعتبر است ❌");
      return;
    }
    if (isSignup && !isStrongPassword(formData.Password)) {
      setErrorMessage(
        "رمز عبور باید حداقل ۸ کاراکتر، شامل حروف بزرگ، کوچک، عدد و کاراکتر خاص باشد ❌"
      );
      return;
    }

    try {
      let response;
      if (isSignup) {
        response = await signupCitizen(formData);
        Swal.fire({
          icon: "success",
          title: "!ثبت‌نام موفقیت‌آمیز بود",
          text: ".برای تایید اکانت، ایمیل فرستاده شده را بررسی کنید",
          confirmButtonText: "باشه",
          customClass: {
            confirmButton: "swal-confirm-btn",
            title: "swal-title",
            htmlContainer: "swal-text"  
          },
        });
        
      } else {
        response = await loginCitizenapi({
          Email: formData.Email,
          Password: formData.Password,
        });

        if (response.jwt && response.usertype) {
          switch (response.usertype) {
            case "Citizen":
              loginCitizen(response);
              navigate("/CitizenDashboard");
              break;
            case "Mayor":
              loginMayor(response);
              navigate("/MayorDashboard");
              break;
            case "Admin":
              loginAdmin(response);
              navigate("/AdminDashboard");
              break;
            default:
              Swal.fire({
                icon: "error",
                title: "نوع کاربری نامعتبر است!",
                confirmButtonText: "باشه",
                customClass: {
                  confirmButton: "swal-confirm-btn",
                  title: "swal-title",
                  customClass: {
                    confirmButton: "swal-confirm-btn",
                    title: "swal-title",
                    htmlContainer: "swal-text"  
                  },
                },
              });
              return;
          }
          Swal.fire({
            icon: "success",
            title: "!ورود موفقیت‌آمیز بود",
            confirmButtonText: "باشه",
            customClass: {
              confirmButton: "swal-confirm-btn",
              title: "swal-title",
            },
          });
        } else {
          setErrorMessage(response.fail || "مشکلی پیش آمد! ❌ لطفاً دوباره تلاش کنید");
        }
      }
      setTimeout(() => setIsLoading(false), 3000);
    } catch (error) {
      console.error(error);
      let msg = ".مشکلی پیش آمد! ❌ لطفاً دوباره تلاش کنید";
      if (error.message === "user with this Email already exists.")
        msg = ".کاربری با این ایمیل وجود دارد";
      else if (error.message === "your email or password is incorrect")
        msg = ".ایمیل یا رمز عبور نادرست است";
      else if (error.message === "Please verify your account via Email.")
        msg = ".برای تایید اکانت ایمیل فرستاده شده را تایید کنید";
      setErrorMessage(msg);
    }
  };


  const handleForgotPasswordSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    setEmailSentMessage("");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/auth/request-reset-email/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Email: formData.Email, Type: "Citizen" }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setEmailSentMessage(
          "ایمیل بازنشانی رمز عبور با موفقیت ارسال شد لطفاً ایمیل خود را بررسی کنید"
        );
        setTimeout(() => setIsForgotPassword(false), 2000);
      } else {
        setErrorMessage(data.error || ".مشکلی در ارسال ایمیل رخ داد. دوباره تلاش کنید");
      }
    } catch {
      setErrorMessage(".خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید");
    } finally {
      setIsLoading(false);
    }
  };


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

  const errorTranslations = {
    "your email or password is incorrect": ".ایمیل یا رمز عبور نادرست است",
    "User not found": ".کاربری با این مشخصات یافت نشد",
    "check pass":
      "رمز عبور باید حداقل ۸ کاراکتر، شامل حروف بزرگ، کوچک، عدد و کاراکتر خاص باشد",
    "Invalid email format": ".فرمت ایمیل نامعتبر است",
    "user with this Email already exists.": ".کاربری با این ایمیل وجود دارد",
    "pass fail":
      ".تعداد زیادی تلاش ناموفق انجام شده است. لطفاً بعداً دوباره امتحان کنید",
    "full name eror": ".لطفا نام کامل خود را وارد کنید.",
    "Please verify your account via Email.": ".برای تایید اکانت ایمیل فرستاده شده را تایید کنید",
  };

  const translatedError = errorMessage ? errorTranslations[errorMessage] || errorMessage : "";

  // const errorMessageText = errorMessages[authType]
  //   ? typeof errorMessages[authType] === "string"
  //     ? errorMessages[authType]
  //     : JSON.stringify(errorMessages[authType])
  //   : "";

  // const translatedErrorMessage = errorMessageText
  //   ? errorTranslations[errorMessageText] || errorMessageText
  //   : "";

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

  // const handlePrev = () => {
  //   if (sliderRef.current) {
  //     sliderRef.current.slickPrev();
  //   }
  // };

  // const handleNext = () => {
  //   if (sliderRef.current) {
  //     sliderRef.current.slickNext();
  //   }
  // };

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

              

              <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
  {isForgotPassword
    ? "بازنشانی رمز عبور"
    : isResetPassword
    ? "تغییر رمز عبور"
    : isSignup
    ? "ثبت‌نام شهروند"
    : "ورود به حساب کاربری"}
</Typography>

              <Typography variant="body2" color="gray" sx={{ mb: 3 }}>
                {isForgotPassword
                  ? "ایمیل مربوط به حساب کاربری خود را وارد کنید"
                  : isResetPassword
                  ? "رمز عبور جدید خود را وارد کنید"
                  : isSignup
                  ? "یک حساب کاربری بسازید تا ادامه دهید"
                  : "برای ادامه، وارد شوید"}
              </Typography>

              <form
                onSubmit={
                  isForgotPassword
                    ? handleForgotPasswordSubmit
                    : isResetPassword
                    ? handleResetPasswordSubmit
                    : handleSubmit
                }
                style={{ width: "100%", boxSizing: "border-box" }}
                noValidate
              >
                {isForgotPassword ? (
                  <>
                    <TextField
  placeholder="ایمیل"
  name="Email"
  type="email"
  value={formData.Email}
  onChange={handleChange}
  fullWidth
  required
  margin="normal"
  InputProps={{
    endAdornment: (
      <InputAdornment position="end">
        <Email />
      </InputAdornment>
    ),
    sx: {
      flexDirection: "row-reverse",
      textAlign: "right",
      "& input": {
        textAlign: "right",
      },
    },
  }}
  sx={{
    direction: "rtl",
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#ccc",
      },
      "&:hover fieldset": {
        borderColor: "#aaa",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#ccc", // حذف رنگ آبی
        boxShadow: "none",
      },
    },
    "& input:-webkit-autofill": {
      WebkitBoxShadow: "0 0 0px 1000px white inset !important",
      backgroundColor: "white !important",
    },
  }}
/>

                  </>
                ) : isResetPassword ? (
                  <>
                    <TextField
                      label="رمز عبور جدید"
                      name="Password"
                      type={showPassword ? "text" : "password"}
                      value={resetFormData.Password}
                      onChange={(e) =>
                        setResetFormData({ ...resetFormData, Password: e.target.value })
                      }
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
                        color: isStrongPassword(resetFormData.Password) ? "green" : "red",
                        fontSize: "14px",
                        marginTop: "5px",
                      }}
                    >
                      {resetFormData.Password.length > 0 &&
                        (isStrongPassword(resetFormData.Password)
                          ? "رمز عبور قوی است ✅"
                          : "رمز عبور ضعیف است ❌ (حداقل ۸ کاراکتر، شامل حروف بزرگ، کوچک، عدد و کاراکتر خاص)")}
                    </Typography>
                  </>
                ) : (
                  <>
                    {isSignup && (
                      <TextField
                      placeholder="نام کامل"
                      name="FullName"
                      type="text"
                      value={formData.FullName}
                      onChange={handleChange}
                      fullWidth
                      required
                      margin="normal"
                      dir="rtl"
                      inputProps={{
                        style: {
                          textAlign: "right",
                          fontFamily: "inherit",
                        },
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Person />
                          </InputAdornment>
                        ),
                        sx: {
                          flexDirection: "row-reverse",
                        },
                      }}
                      sx={{
                        direction: "rtl",
                        "& .MuiOutlinedInput-root": {
                          flexDirection: "row-reverse", // آیکون بیاد سمت راست
                          "& input": {
                            textAlign: "right", // متن داخل input راست‌چین
                          },
                          "& fieldset": {
                            borderColor: "#ccc !important",
                          },
                          "&:hover fieldset": {
                            borderColor: "#aaa !important",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#ccc !important", // حذف رنگ آبی
                            boxShadow: "none !important",
                          },
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#ccc !important",
                        },
                        "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#ccc !important",
                          boxShadow: "none !important",
                        },
                        "& input:-webkit-autofill": {
                          WebkitBoxShadow: "0 0 0px 1000px white inset !important",
                          backgroundColor: "white !important",
                        },
                      }}
                      
                      
                    />
                    
                    )}

<TextField
  placeholder="ایمیل"
  name="Email"
  type="email"
  value={formData.Email}
  onChange={handleChange}
  fullWidth
  required
  margin="normal"
  dir="rtl"
  inputProps={{
    style: {
      textAlign: "right",
      fontFamily: "inherit",
    },
  }}
  InputProps={{
    endAdornment: (
      <InputAdornment position="end">
        <Email />
      </InputAdornment>
    ),
    sx: {
      flexDirection: "row-reverse",
    },
  }}
  sx={{
    direction: "rtl",
    "& .MuiOutlinedInput-root": {
      flexDirection: "row-reverse", // آیکون بیاد سمت راست
      "& input": {
        textAlign: "right", // متن داخل input راست‌چین
      },
      "& fieldset": {
        borderColor: "#ccc !important",
      },
      "&:hover fieldset": {
        borderColor: "#aaa !important",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#ccc !important", // حذف رنگ آبی
        boxShadow: "none !important",
      },
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#ccc !important",
    },
    "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#ccc !important",
      boxShadow: "none !important",
    },
    "& input:-webkit-autofill": {
      WebkitBoxShadow: "0 0 0px 1000px white inset !important",
      backgroundColor: "white !important",
    },
  }}
  
  
/>


<TextField
  placeholder="رمز عبور"
  name="Password"
  type={showPassword ? "text" : "password"}
  value={formData.Password}
  onChange={handleChange}
  fullWidth
  required
  margin="normal"
  dir="rtl"
  inputProps={{
    style: {
      textAlign: "right",
      fontFamily: "inherit",
    },
  }}
  InputProps={{
    endAdornment: (
      <InputAdornment position="end">
        <Lock />
      </InputAdornment>
    ),
    startAdornment: (
      <InputAdornment position="start">
        <IconButton onClick={togglePasswordVisibility}>
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </InputAdornment>
    ),
    sx: {
      flexDirection: "row-reverse",
    },
  }}
  sx={{
    direction: "rtl",
    "& .MuiOutlinedInput-root": {
      flexDirection: "row-reverse", // آیکون بیاد سمت راست
      "& input": {
        textAlign: "right", // متن داخل input راست‌چین
      },
      "& fieldset": {
        borderColor: "#ccc !important",
      },
      "&:hover fieldset": {
        borderColor: "#aaa !important",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#ccc !important", // حذف رنگ آبی
        boxShadow: "none !important",
      },
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#ccc !important",
    },
    "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#ccc !important",
      boxShadow: "none !important",
    },
    "& input:-webkit-autofill": {
      WebkitBoxShadow: "0 0 0px 1000px white inset !important",
      backgroundColor: "white !important",
    },
  }}
  
  
  
/>



                    {isSignup && (
                      <Typography
                        variant="body2"
                        sx={{
                          color: isStrongPassword(formData.Password) ? "green" : "red",
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
                  </>
                )}

                {emailSentMessage && (
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
                    {emailSentMessage}
                  </Typography>
                )}

{translatedError && (
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
                  >                    {translatedError}
                  </Typography>
                )}

                {/* {translatedErrorMessage && (
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
                )} */}

                <Button
                  type="button"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={isLoading}
                  onClick={(e) => {
                    setIsLoading(true);
                    setTimeout(() => {
                      setIsLoading(false);
                      if (isForgotPassword) {
                        handleForgotPasswordSubmit(e);
                      } else if (isResetPassword) {
                        handleResetPasswordSubmit(e);
                      } else {
                        handleSubmit(e);
                      }
                    }, 1000);
                  }}
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
                  ) : isForgotPassword ? (
                    "ارسال ایمیل بازنشانی"
                  ) : isResetPassword ? (
                    "تغییر رمز عبور"
                  ) : isSignup ? (
                    "ثبت‌نام"
                  ) : (
                    "ورود"
                  )}
                </Button>
              </form>

              {!isForgotPassword && !isResetPassword && (
                <>
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
                  <Typography
                    variant="body1"
                    sx={{
                      marginTop: 1,
                      cursor: "pointer",
                      fontSize: "16px",
                      color: "#1976D2",
                      textDecoration: "none",
                      textAlign: "center",
                      transition: "color 0.3s ease-in-out",
                      "&:hover": {
                        color: "#0d47a1",
                      },
                    }}
                    onClick={() => setIsForgotPassword(true)}
                  >
                    رمز عبور خود را فراموش کرده‌اید؟
                  </Typography>
                </>
              )}

              {isForgotPassword && (
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
                  onClick={() => setIsForgotPassword(false)}
                >
                  بازگشت به ورود
                </Typography>
              )}

              {isResetPassword && (
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
                  onClick={() => {
                    setIsResetPassword(false);
                    navigate("/"); 
                  }}
                >
                  بازگشت به ورود
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