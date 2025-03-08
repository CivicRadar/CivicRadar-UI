import React, { useState } from "react";
import { 
    TextField, Button, Typography, Paper, InputAdornment, IconButton, Box, ToggleButton, ToggleButtonGroup, Card 
} from "@mui/material";
import { Email, Visibility, VisibilityOff, Lock, Person, SupervisorAccount, AdminPanelSettings } from "@mui/icons-material";
import cityImage from "./assets/city3.webp";
import logo from "./assets/logo.jpeg";  
import logo5 from "./assets/logo5.webp";  


const AuthPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [authType, setAuthType] = useState("user");
    const [isSignup, setIsSignup] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(`${authType.toUpperCase()} ${isSignup ? "Signup" : "Login"} Data:`, formData);
    };

    return (
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
    animation: "gradientShift 10s ease infinite", 
  }}
>
 
      <Card 
          sx={{ 
              display: "flex", 
              flexDirection: { xs: "column", md: "row" }, 
              borderRadius: 3, 
              overflow: "hidden", 
              boxShadow: 6, 
              width: { xs: "95%", sm: "85%", md: "900px" },  
              maxWidth: "900px", 
              height: { xs: "auto", md: "85vh" },
              boxSizing: "border-box"
          }}
      >
          <Box 
              sx={{ 
                  width: { xs: "100%", md: "50%" }, 
                  height: { xs: "200px", sm: "250px", md: "100%" },
                  flexShrink: 0
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
                  boxSizing: "border-box"
              }}
          >
              <Paper 
    elevation={0} 
    sx={{ 
        width: "100%", 
        maxWidth: 400, 
        textAlign: "center", 
        maxHeight: "100vh",
        boxSizing: "border-box",
        paddingBottom: { xs: 4, sm: 6 }, 
    }}
>
    <Box sx={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center",
        height: "140px" ,
        padding : 8

    }}>
        <img 
    src={logo5} 
    alt="App Logo"
            style={{ width: "160px", height: "170px", borderRadius: "100%" }} 
        />
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
        sx={{ marginBottom: 3, flexWrap: "wrap", width: "100%" }}
    >
        <ToggleButton value="user" sx={{ flex: 1, minWidth: "100px" }}>
            <Person sx={{ marginRight: 1 }} /> User
        </ToggleButton>
        <ToggleButton value="manager" sx={{ flex: 1, minWidth: "100px" }}>
            <SupervisorAccount sx={{ marginRight: 1 }} /> Manager
        </ToggleButton>
        <ToggleButton value="admin" sx={{ flex: 1, minWidth: "100px" }}>
            <AdminPanelSettings sx={{ marginRight: 1 }} /> Admin
        </ToggleButton>
    </ToggleButtonGroup>

    <Typography variant="h5" fontWeight="bold">
        {authType === "user" ? (isSignup ? "USER SIGNUP" : "USER LOGIN")
            : authType === "manager" ? "MANAGER LOGIN"
            : "ADMIN LOGIN"}
    </Typography>
    <Typography variant="body2" color="gray" sx={{ marginBottom: 3 }}>
        {authType === "user" ? (isSignup ? "Create an account to continue" : "Log in to continue")
            : "Enter your credentials to continue"}
    </Typography>

    <form onSubmit={handleSubmit} style={{ width: "100%", overflow: "hidden", boxSizing: "border-box" }}>
        {authType === "user" && isSignup && (
            <TextField 
                label="Full Name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
                sx={{ maxWidth: "100%" }}
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
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            sx={{ maxWidth: "100%" }}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <Email />
                    </InputAdornment>
                )
            }}
        />
        <TextField 
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            sx={{ maxWidth: "100%" }}
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
                )
            }}
        />

        <Button 
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2, marginBottom: { xs: 4, sm: 6 }, padding: 1.5, fontSize: "16px", fontWeight: "bold" }}
        >
            {isSignup ? "SIGN UP →" : "LOGIN →"}
        </Button>
    </form>

    {authType === "user" && (
        <Typography 
            variant="body2" 
            sx={{ marginBottom: { xs: 3, sm: 4 }, cursor: "pointer", fontWeight: "bold" }} 
            color="primary"
            onClick={() => setIsSignup(!isSignup)}
        >
            {isSignup ? "Already have an account? LOG IN" : "New here? SIGN UP"}
        </Typography>
    )}
</Paper>

          </Box>
      </Card>
  </Box>
  
  
    );
};

export default AuthPage;
