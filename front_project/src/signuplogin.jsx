import React, { useState } from "react";
import { 
    TextField, Button, Typography, Paper, InputAdornment, IconButton, Box, ToggleButton, ToggleButtonGroup, Card 
} from "@mui/material";
import { Email, Visibility, VisibilityOff, Lock, Person, SupervisorAccount, AdminPanelSettings, Login } from "@mui/icons-material";
import cityImage from "./assets/city3.webp";
import logo from "./assets/logo.jpeg";  
import logo5 from "./assets/logo5.webp";  
import { signupCitizen, loginCitizenapi } from "./services/signup_login_api";
import { useCitizen } from "./context/CitizenContext";
import { useMayor } from "./context/MayorContext";
import { useAdmin } from "./context/AdminContext";
import { createTheme, ThemeProvider } from "@mui/material/styles";



const AuthPage = () => {
    const { loginCitizen } = useCitizen(); 
    const { loginMayor } = useMayor();     
    const { loginAdmin } = useAdmin();    
    const [showPassword, setShowPassword] = useState(false);
    const [authType, setAuthType] = useState("user");
    const [isSignup, setIsSignup] = useState(false);
    const [formData, setFormData] = useState({
        FullName: "",  
        Email: "",
        Password: ""
    });
    

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const [errorMessage, setErrorMessage] = useState(""); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(""); 
    
        try {
            let response;
    
            if (authType === "user") {
                if (isSignup) {
                    console.log("Citizen Signup Data:", formData);
                    response = await signupCitizen(formData);
                    console.log("Citizen Signup Success:", response);
                    alert("ثبت‌نام موفقیت‌آمیز بود! ✅");
                } else {
                    console.log("Citizen Login Data:", formData);
                    response = await loginCitizenapi({
                        Email: formData.Email,
                        Password: formData.Password,
                        Type: "Citizen"
                    });
    
                    console.log("Citizen Login Response:", response);
    
                    if (response.jwt) {
                        loginCitizen(response);
                        console.log("JWT Token Saved:", response.jwt);
                        alert("ورود موفقیت‌آمیز بود! ✅");
                    } else {
                        const errorMsg = response.fail || "مشکلی پیش آمد! ❌ لطفاً دوباره تلاش کنید.";
                        setErrorMessage(errorMsg); 
                    }
                }
            } 
            else if (authType === "manager") {  
                console.log("Mayor Login Data:", formData);
                response = await loginCitizenapi({
                    Email: formData.Email,
                    Password: formData.Password,
                    Type: "Mayor"
                });
    
                console.log("Mayor Login Response:", response);
    
                if (response.jwt) {
                    loginMayor(response);
                    console.log("JWT Token Saved (Mayor):", response.jwt);
                    alert("ورود شهردار موفقیت‌آمیز بود! ✅");
                } else {
                    const errorMsg = response.fail || "مشکلی پیش آمد! ❌ لطفاً دوباره تلاش کنید.";
                    setErrorMessage(errorMsg);
                }
            } 
            else if (authType === "admin") {  
                console.log("Admin Login Data:", formData);
                response = await loginCitizenapi({
                    Email: formData.Email,
                    Password: formData.Password,
                    Type: "Admin"
                });
    
                console.log("Admin Login Response:", response);
    
                if (response.jwt) {
                    loginAdmin(response);
                    console.log("JWT Token Saved (Admin):", response.jwt);
                    alert("ورود ادمین موفقیت‌آمیز بود! ✅");
                } else {
                    const errorMsg = response.fail || "مشکلی پیش آمد! ❌ لطفاً دوباره تلاش کنید.";
                    setErrorMessage(errorMsg);
                }
            } 
            else {
                console.log("Invalid user type selected.");
            }
        } 
        catch (error) {
            console.error("Authentication Error:", error.response?.data || error.message);
    
            const errorMessage = error.response?.data?.fail || "مشکلی پیش آمد! ❌ لطفاً دوباره تلاش کنید.";
            setErrorMessage(errorMessage); 
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
    "Password is too short": "رمز عبور باید حداقل ۶ کاراکتر باشد.",
    "Invalid email format": "فرمت ایمیل نامعتبر است.",
    "Account is locked": "حساب شما قفل شده است. لطفاً بعداً تلاش کنید.",
    "Too many attempts": "تعداد زیادی تلاش ناموفق انجام شده است. لطفاً بعداً دوباره امتحان کنید.",
    "Network error": "خطا در اتصال به سرور. لطفاً اتصال اینترنت خود را بررسی کنید.",
};

const translatedErrorMessage = errorTranslations[errorMessage] || "مشکلی پیش آمد! ❌ لطفاً دوباره تلاش کنید.";

    

return (
    <ThemeProvider theme={theme}>
        <Box
            sx={{
                background: "linear-gradient(135deg, #6b48ff 0%, #c9a7ff 50%, #e0c3fc 100%)",
                backgroundImage: "url('https://www.transparenttextures.com/patterns/fabric-of-squares.png')",
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
                    width: { xs: "95%", sm: "85%", md: "900px" },
                    maxWidth: "900px",
                    height: { xs: "auto", md: "91vh" },
                    boxSizing: "border-box",
                }}
            >
                <Box
                    sx={{
                        width: { xs: "100%", md: "50%" },
                        height: { xs: "200px", sm: "250px", md: "100%" },
                        flexShrink: 0,
                    }}
                >
                    <img
                        src={cityImage}
                        alt="City"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
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
                            width: "100%",
                            maxWidth: 400,
                            textAlign: "center",
                            maxHeight: "100vh",
                            boxSizing: "border-box",
                            padding: 4,
                            borderRadius: 3,
                            
                        }}
                    >
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", padding: 2 }}>
                            <img src={logo5} alt="App Logo" style={{ width: "140px", height: "140px", borderRadius: "100%" }} />
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
                            <ToggleButton value="manager" sx={{ flex: 1, minWidth: "100px" }}>
                                <SupervisorAccount sx={{ marginRight: 1 }} /> مسئول
                            </ToggleButton>
                            <ToggleButton value="admin" sx={{ flex: 1, minWidth: "100px" }}>
                                <AdminPanelSettings sx={{ marginRight: 1 }} /> ادمین
                            </ToggleButton>
                        </ToggleButtonGroup>

                        <Typography variant="h5" fontWeight="bold" sx={{ marginBottom: 1 }}>
                            {authType === "user" ? (isSignup ? "ثبت‌نام شهروند" : "ورود شهروند")
                                : authType === "manager" ? "ورود مسئول"
                                : "ورود ادمین"}
                        </Typography>

                        <Typography variant="body2" color="gray" sx={{ marginBottom: 3 }}>
                            {authType === "user" ? (isSignup ? "یک حساب کاربری بسازید تا ادامه دهید" : "برای ادامه، وارد شوید")
                                : "اطلاعات ورود خود را وارد کنید"}
                        </Typography>

                        <form onSubmit={handleSubmit} style={{ width: "100%", boxSizing: "border-box" }}>
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
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <Person />
                    </InputAdornment>
                )
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


{errorMessage && (
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
            fontSize: "17px",
            boxShadow: "0px 0px 5px rgba(211, 47, 47, 0.5)",
        }}
    >
        {translatedErrorMessage}
    </Typography>
)}


    <Button 
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
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
        {isSignup ? "ثبت‌نام" : "ورود"}
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
            }
        }}
        onClick={() => setIsSignup(!isSignup)}
    >
        {isSignup ? "قبلاً ثبت‌نام کرده‌اید؟ ورود" : "تازه وارد هستید؟ ثبت‌نام کنید"}
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
