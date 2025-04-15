import React, { useEffect, useState, useRef } from "react";
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
  Avatar,
  CssBaseline,
  useMediaQuery,
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
  Campaign,
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import logo from "../assets/lgo.png";
import { getProfile } from "../services/profile";
import { useNavigate } from "react-router-dom";
import SignUpForm from "./Admin-features/SigningMayors";
import MayorsList from "./Admin-features/MayorsList";
import TabPanel from "../Components/TabPanel";
import LogoutDialog from "./LogoutDialog";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";


import AdminProfileSection from "../Components/adminProfileSection";

const dashboardData = {
  users: 32,
  admins: 32,
  reportsToday: 147,
};

const toPersianNumber = (num) => {
  return num.toString().replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
};

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState("overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  // برای مدیریت تصویر پروفایل
  const [imagePreview, setImagePreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    FullName: "",
    Picture: null,
  });
  const [shouldDeletePicture, setShouldDeletePicture] = useState(false);
  const fileInputRef = useRef();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);


  const isMobile = useMediaQuery("(max-width:900px)");

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setEditedProfile((prev) => ({ ...prev, Picture: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleMarkPictureForDeletion = () => {
    setShouldDeletePicture(true);
    setImagePreview(null);
    setEditedProfile((prev) => ({ ...prev, Picture: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedProfile({
      FullName: profile?.FullName || "",
      Picture: null,
    });
    setImagePreview(
      profile?.Picture
        ? `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}${profile.Picture}`
        : null
    );
  };

  const handleSaveProfile = async () => {
    try {
      // اگر درخواست حذف عکس پروفایل داشتیم
      if (shouldDeletePicture) {
        await fetch(
          `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/auth/profile/`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );
      }

      let response;
      if (editedProfile.Picture instanceof File) {
        const formData = new FormData();
        formData.append("FullName", editedProfile.FullName);
        formData.append("Picture", editedProfile.Picture);
        response = await fetch(
          `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/auth/profile/`,
          {
            method: "POST",
            body: formData,
            credentials: "include",
          }
        );
      } else {
        response = await fetch(
          `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/auth/profile/`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ FullName: editedProfile.FullName }),
          }
        );
      }

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        setImagePreview(
          updatedProfile.Picture
            ? `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}${updatedProfile.Picture}`
            : null
        );
        setIsEditing(false);
        setShouldDeletePicture(false);
      } else {
        const errorText = await response.text();
        console.error("Server error:", response.status, errorText);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        setProfile(response);
        setEditedProfile({
          FullName: response.FullName || "",
          Picture: null,
        });
        if (response.Picture) {
          setImagePreview(
            `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}${response.Picture}`
          );
        }
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
    { id: "profile", label: "پروفایل", icon: <AccountCircle /> },
    { id: "exit", label: "خروج از حساب", icon: <ExitToApp /> },
  ];

  const SidebarContent = (
    <Box
      sx={{
        width: 300,
        bgcolor: "#fff",
        color: "black",
        direction: "rtl",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 2,
        height: "100vh",
        overflowY: "auto",
        position: "sticky",
        top: 0,
      }}
    >
      <Box sx={{ mb: 2, textAlign: "center" }}>
        <img
          src={logo}
          alt="شهر سنج"
          style={{ width: isMobile ? "0%" : "100%", maxWidth: "150px" }}
        />
      </Box>

      {/* دکمه اختصاصی برای ثبت مسئولین */}
      <Button
        onClick={() => setSelectedItem("registerform")}
        sx={{
          bgcolor: selectedItem === "registerform" ? "transparent" : "#007E33",
          color: selectedItem === "registerform" ? "#007E33" : "white",
          fontWeight: "bold",
          border: selectedItem === "registerform"
            ? "2px solid #007E33"
            : "none",
          borderRadius: "25px",
          padding: "10px 24px",
          minWidth: "240px",
          display: "flex",
          alignItems: "center",
          textTransform: "none",
          fontSize: "16px",
          "&:hover": {
            bgcolor:
              selectedItem === "registerform"
                ? "rgba(0, 126, 51, 0.1)"
                : "#005a24",
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
          onClick={() => {
            if (item.id === "exit") {
              setLogoutDialogOpen(true);
            } else {
              setSelectedItem(item.id);
            }
          }}
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
  const DeleteAccountDialog = ({ open, onClose, onConfirm }) => {
    return (
      <Dialog open={open} onClose={onClose} dir="rtl">
        <DialogTitle sx={{ fontWeight: "bold" }}>تأیید حذف حساب کاربری</DialogTitle>
        <DialogContent>
          <Typography sx={{ mt: 1 }}>
            آیا مطمئن هستید که می‌خواهید حساب کاربری خود را حذف کنید؟ این عملیات قابل بازگشت نیست.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
          <Button
            onClick={onClose}
            sx={{
              color: "#4caf50",
              fontWeight: "bold",
              "&:hover": { bgcolor: "rgba(76, 175, 80, 0.1)" },
            }}
          >
            لغو
          </Button>
          <Button
            onClick={onConfirm}
            sx={{
              color: "#f44336",
              fontWeight: "bold",
              "&:hover": { bgcolor: "rgba(244, 67, 54, 0.1)" },
            }}
          >
            حذف
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  const handleDeleteAccount = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/auth/logout/`, {
          method: "DELETE",
          credentials: "include",
        }
      );
  
      if (response.ok) {
        navigate("/signuplogin");
      } else {
        const errText = await response.text();
        console.error("خطا در حذف حساب:", errText);
        alert("حذف حساب با خطا مواجه شد");
      }
    } catch (error) {
      console.error("خطای شبکه:", error);
      alert("خطا در ارتباط با سرور");
    } finally {
      setDeleteDialogOpen(false);
    }
  };
  
  

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
        {/* Drawer حالت موبایل */}
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
              width: 300, // یا 250، ولی 300 برای تطابق با داشبوردهای دیگر
              bgcolor: "#fff",
              direction: "rtl",
              boxShadow: 3,
            },
          }}
        >
          {SidebarContent}
        </Drawer>

        {/* Drawer حالت دسکتاپ */}
        <Drawer
          variant="permanent"
          anchor="right"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              width: 300,
              position: "relative",
              borderLeft: "1px solid #ddd",
              overflowY: "auto",
            },
          }}
          open
        >
          {SidebarContent}
        </Drawer>

        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <AppBar
             position="sticky"
             sx={{
               width: isMobile && selectedItem === "registered" ? "90%" : "100%",
               backgroundColor: "#fff",
               color: "#000",
               boxShadow: 1,
               zIndex: theme.zIndex.drawer + 1,
               transition: "all 0.3s ease",
             }}
          >
           <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
  <Box sx={{ display: "flex", alignItems: "center" }}>
    <IconButton
      color="inherit"
      aria-label="open drawer"
      edge="start"
      onClick={handleDrawerToggle}
      sx={{ mr: 0, display: { xs: "block", md: "none" }, ml: 1 }}
    >
      <MenuIcon />
    </IconButton>

    {/* اینجا آواتار را داخل IconButton می‌گذاریم تا کلیک‌پذیر شود */}
    <IconButton onClick={() => setSelectedItem("profile")}>
      <Avatar
        sx={{
          width: 40,
          height: 40,
          ml: 2,
          border: "2px solid #4caf50",
        }}
        src={imagePreview || "/path-to-default-avatar.jpg"}
      />
    </IconButton>

    {/* در صورت تمایل: نمایش نام ادمین */}
    <Typography variant="body1" sx={{ marginLeft: 1 }}>
      {profile ? profile.FullName : "نام کاربر"}
    </Typography>
  </Box>

  <IconButton color="inherit">
    <Notifications />
  </IconButton>
</Toolbar>

          </AppBar>
          

          {/* تب‌ها */}
          <TabPanel value={selectedItem} index={"overview"}>
            <Box sx={{ flexGrow: 1, p: 3 }}>
              <Grid container spacing={10}>
                {[
                  {
                    title: "تعداد کل کاربران",
                    value: dashboardData.users,
                    icon: <Person color="success" />,
                    color: "#E8F5E9",
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
                    icon: <Campaign color="primary" />,
                    color: "#E3F2FD",
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
                        {toPersianNumber(item.value)}
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
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "#F9FAFB",
                p: 3,
              }}
            >
              <Paper
                elevation={3}
                sx={{
                  maxWidth: 600,
                  width: "100%",
                  padding: 4,
                  borderRadius: 4,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    ثبت نام مسئولین
                  </Typography>
                </Box>

                <SignUpForm gotoregisted={() => setSelectedItem("registered")} />
              </Paper>
            </Box>
          </TabPanel>

          <TabPanel value={selectedItem} index={"registered"}>
            <MayorsList />
          </TabPanel>

          <TabPanel value={selectedItem} index={"map"}>
            <Typography sx={{ p: 3 }}>اینجا نقشه قرار می‌گیرد</Typography>
          </TabPanel>
          <TabPanel value={selectedItem} index={"violations"}>
            <Typography sx={{ p: 3 }}>اینجا بررسی تخلفات قرار می‌گیرد</Typography>
          </TabPanel>

          {/* تب پروفایل */}
          <TabPanel value={selectedItem} index={"profile"}>
            <AdminProfileSection
              profile={profile}
              imagePreview={imagePreview}
              isEditing={isEditing}
              editedProfile={editedProfile}
              setEditedProfile={setEditedProfile}
              setIsEditing={setIsEditing}
              handleImageUpload={handleImageUpload}
              handleSaveProfile={handleSaveProfile}
              handleCancelEdit={handleCancelEdit}
              setDeleteDialogOpen={setDeleteDialogOpen} // 👈 اینو اضافه کن
              fileInputRef={fileInputRef}
              handleMarkPictureForDeletion={handleMarkPictureForDeletion}
            />
          </TabPanel>
        </Box>
      </Box>

      <LogoutDialog open={logoutDialogOpen} onClose={() => setLogoutDialogOpen(false)} />
      <DeleteAccountDialog
  open={deleteDialogOpen}
  onClose={() => setDeleteDialogOpen(false)}
  onConfirm={handleDeleteAccount}
/>

    </ThemeProvider>
  );
}
