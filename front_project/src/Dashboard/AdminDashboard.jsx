import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  Grid,
  Button,
  AppBar,
  Toolbar,
  Paper,
  IconButton,
  Drawer,
} from "@mui/material";
import {
  People,
  Person,
  Notifications,
  BarChart,
  Map,
  Warning,
  ExitToApp,
  Add,
  Menu as MenuIcon,
  AccountCircle,
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import logo from "../assets/lgo.png";
import { getProfile } from "../services/profile";
import { useNavigate } from "react-router-dom";
import SignUpForm from "./Admin-features/SigningMayors";
import MayorsList from "./Admin-features/MayorsList";
import TabPanel from "../Components/TabPanel"
const dashboardData = {
  users: 32,
  admins: 32,
  reportsToday: 147,
};

export default function CitizenDashboard() {
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState("overview");
  const [mobileOpen, setMobileOpen] = useState(false); 
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        console.log("Profile Data:", response);
        setProfile(response);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        navigate("/signuplogin");
      }
    };

    fetchProfile();
  }, [navigate]);
  
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
        }}
      >
        <Typography variant="h6" sx={{ marginTop: 2 }}>
          در حال بارگذاری اطلاعات...
        </Typography>
      </Box>
    );
  }

  const theme = createTheme({
    typography: {
      fontFamily: "Vazir ,IranSans, IRANYekan, Vazirmatn, Shabnam, sans-serif",
      fontSize: 18,
      h1: { fontSize: "28px", fontWeight: 700 },
      h2: { fontSize: "24px", fontWeight: 700 },
      h3: { fontSize: "20px", fontWeight: 700 },
      body1: { fontSize: "18px", fontWeight: 400 },
      button: { fontSize: "20px", fontWeight: 700 },
      subtitle1: { fontSize: "16px", fontWeight: 400, color: "#666" },
    },
  });

  const menuItems = [
    { id: "overview", label: "نمای کلی", icon: <BarChart /> },
    { id: "registered", label: "مسئولین ثبت شده", icon: <People /> },
    { id: "map", label: "نقشه", icon: <Map /> },
    { id: "violations", label: "بررسی تخلفات", icon: <Warning /> },
    { id: "exit", label: "خروج از حساب", icon: <ExitToApp /> },
  ];

  const SidebarContent = (
    <Box
      sx={{
        width: "240",
        bgcolor: "#fff",
        color: "black",
        direction: "rtl",

        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 2,
      }}
    >
      <Box sx={{ mb: 2, textAlign: "center" }}>
        <img
          src={logo}
          alt="شهر سنج"
          style={{ width: "100%", maxWidth: "150px" }}
        />
      </Box>

      <Button
      onClick={() => setSelectedItem("registerform")}
        sx={{
          bgcolor: "#007E33",
          color: "white",
          fontWeight: "bold",
          borderRadius: "25px",
          padding: "10px 24px",
          minWidth: "240px",
          display: "flex",
          alignItems: "center",
          textTransform: "none",
          fontSize: "16px",
          "&:hover": {
            bgcolor: "005a2#4",
          },
          mt: 2,
          mb: 2,
        }}
      >
        ثبت نام مسئولین
        {
          <span style={{ position: "relative", display: "inline-block" }}>
            <Person sx={{ fontSize: 24 }} />
            <Add
              sx={{
                fontSize: 14,
                position: "absolute",
                top: 0,
                left: -5,
                backgroundColor: "white",
                borderRadius: "50%",
                color: "green",
              }}
            />
          </span>
        }
      </Button>

      {menuItems.map((item) => (
        <Button
          key={item.id}
          fullWidth
          onClick={() => setSelectedItem(item.id)}
          sx={{
            justifyContent: "flex-start",
            my: 1,
            color: selectedItem === item.id ? "black" : "gray",
            fontWeight: selectedItem === item.id ? "bold" : "normal",
            display: "flex",
            flexDirection: "row",
            borderRadius: "10px",
            padding: "12px",
            "&:hover": {
              bgcolor: "lightgray",
            },
          }}
        >
          {React.cloneElement(item.icon, {
            sx: {
              color: selectedItem === item.id ? "green" : "gray",
              fontSize: "46px",
            },
          })}
          <Typography
  sx={{
    ml: 1.5,
    color: selectedItem === item.id ? "black" : "gray",
    fontWeight: selectedItem === item.id ? "bold" : "normal",
    fontSize: { xs: "16px", md: "20px" }, 
  }}
>
  {item.label}
</Typography>

        </Button>
      ))}
    </Box>
  );

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          width: "100%",
          height: { xs: "auto", md: "100vh" },
          direction: "rtl",
          bgcolor: "#F9FAFB",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Drawer
          variant="temporary"
          anchor="right"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", md: "none" }, 
            "& .MuiDrawer-paper": {
              width: 250, 
              
            },
          }}
        >
          {SidebarContent}
        </Drawer>

        <Drawer
          variant="permanent"
          anchor="right"
          sx={{
            display: { xs: "none", md: "block" }, 
            "& .MuiDrawer-paper": {
              width: 300, 
              position: "relative",
              borderLeft: "1px solid #ddd",
              overflowX: "hidden", 

            },
          }}
          open
        >
          {SidebarContent}
        </Drawer>

        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <AppBar
            position="static"
            sx={{ backgroundColor: "#fff", color: "#000", boxShadow: 1 }}
          >
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box sx={{ display: "flex", alignItems: "center"  ,     
 }}>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 0, display: { xs: "block", md: "none"} , ml : 1 }}
                >
                  <MenuIcon />
                </IconButton>
                <AccountCircle sx={{ fontSize: 50, color: "#B2ADAD", ml: 2 }} />
                <Typography variant="body1" sx={{ marginLeft: 1 }}>
  {profile ? profile.FullName : "نام کاربر"} 
</Typography>

              </Box>
              <IconButton color="inherit">
                <Notifications />
              </IconButton>
            </Toolbar>
          </AppBar>

        <TabPanel value={selectedItem} index={"overview"}>
          <Box sx={{ flexGrow: 1, p: 3 }}>
            <Grid container spacing={10}>
              {[
                {
                  title: "تعداد کل کاربران",
                  value: dashboardData.users,
                  icon: <Person color="success" />,
                  color: "#E3F2FD",
                },
                {
                  title: "تعداد کل مسئولین",
                  value: dashboardData.admins,
                  icon: <People color="error" />,
                  color: "#FFEBEE",
                },
                {
                  title: "تعداد گزارشات امروز",
                  value: dashboardData.reportsToday,
                  icon: <Notifications color="primary" />,
                  color: "#E8F5E9",
                },
              ].map((item, index) => (
                <Grid item xs={12} sm={4} key={index}>
                  <Card
                    sx={{
                      textAlign: "center",
                      p: 2,
                      boxShadow: 3,
                      bgcolor: item.color,
                    }}
                  >
                    {item.icon}
                    <Typography variant="subtitle1">{item.title}</Typography>
                    <Typography variant="h5" fontWeight="bold">
                      {item.value}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
          </TabPanel>
        <TabPanel value={selectedItem} index={"registerform"}>
          <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: "#F9FAFB",
                padding: { xs: 2, sm: 4 },
              }}
            >
              <Paper
                elevation={3}
                sx={{
                  maxWidth: 600,
                  width: '100%',
                  padding: 4,
                  borderRadius: 4,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mb: 3,
                  }}
                >
                  <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                      textAlign: 'center',
                      fontWeight: 'bold',
                    }}
                  >
                    ثبت نام مسئولین
                  </Typography>
                </Box>
          
          <SignUpForm gotoregisted={() => setSelectedItem("registered")}/>
          </Paper>
          </Box>
          </TabPanel>
          <TabPanel value={selectedItem} index={"registered"}>
            <MayorsList />
          </TabPanel>

        </Box>
      </Box>
    </ThemeProvider>
  );
}
