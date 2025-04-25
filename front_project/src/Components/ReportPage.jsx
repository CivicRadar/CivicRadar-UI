import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  Avatar,
  CssBaseline,
  useMediaQuery,
  styled,
  Grid,
  Card,
} from "@mui/material";
import {
  Map,
  Warning,
  ExitToApp,
  Menu as MenuIcon,
  AccountCircle,
  Campaign,
  Notifications,
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import logo from "../assets/lgo.png";
import { getProfile } from "../services/profile";
import { useNavigate } from "react-router-dom";
import TabPanel from "../Components/TabPanel";
import LogoutDialog from "../Dashboard/LogoutDialog";
import ReportsTab from "../Components/ReportsTab"; 
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import TeamRegistrationForm from "../Components/TeamRegistrationForm";
import ProfileSection from "../Components/mayerProfileSection";
import ReportDetails from "./ReportDetails";
const MainContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  overflow: "hidden",
  backgroundColor: "#F9FAFB",
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: "auto",
  padding: theme.spacing(3),
  backgroundColor: "#F9FAFB",
}));

export default function ReportPageCon() {
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState("reports");
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const [profile, setProfile] = useState(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:900px)");
  const [imagePreview, setImagePreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    FullName: "",
    Picture: null,
  });
  const [shouldDeletePicture, setShouldDeletePicture] = useState(false);
  const fileInputRef = useRef();
  const handleShowTeamForm = () => {
    // setShowTeamForm(true);
    setSelectedItem("teamForm"); // تغییر دادن مقدار selectedItem به "افزودن تیم"
  };

  const handleProfileClick = () => {
    navigate(`/MayorDashboard`);
  };

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
    fetchProfile();
  }, [navigate]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
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
    { id: "profile", label: "پروفایل کاربری", icon: <AccountCircle /> },
    { id: "reports", label: "گزارشات", icon: <Campaign /> },
    { id: "map", label: "نقشه", icon: <Map /> },
    { id: "violations", label: "بررسی تخلفات", icon: <Warning /> },
    { id: "exit", label: "خروج از حساب", icon: <ExitToApp /> },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

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
          style={{
            width: isMobile ? "0%" : "100%",
            maxWidth: "150px",
            transition: "width 0.3s",
          }}
        />
      </Box>
      <Button
  variant="contained"
  color="success"
  fullWidth
  sx={{
    mb: 2,
    borderRadius: "12px",
    fontWeight: "bold",
    fontSize: "16px",
    mt: 1, // فاصله از لوگو
  }}
  onClick={handleShowTeamForm}
>
  بازگشت به داشبورد
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

  const DeleteAccountDialog = ({ open, onClose, onConfirm }) => {
    return (
      <Dialog open={open} onClose={onClose} dir="rtl">
        <DialogTitle sx={{ fontWeight: "bold" }}>حذف حساب کاربری</DialogTitle>
        <DialogContent>
          <Typography>
            آیا مطمئن هستید که می‌خواهید حساب خود را حذف کنید؟ این عملیات غیرقابل بازگشت است.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
          <Button onClick={onClose} sx={{ color: "#4caf50", fontWeight: "bold" }}>
            لغو
          </Button>
          <Button onClick={onConfirm} sx={{ color: "#f44336", fontWeight: "bold" }}>
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
      });
  
      if (response.ok) {
        navigate("/signuplogin");
      } else {
        console.error("خطا در حذف حساب:", response.statusText);
      }
    } catch (error) {
      console.error("خطا در حذف حساب:", error);
    } finally {
      setDeleteDialogOpen(false);
    }
  };
 
  const handleReportClick = (repid) =>
    {
      setSelectedReport(repid)
      navigate(`/reports/${repid}`);
    }
  

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
        <MainContent>
          <AppBar
            position="sticky"
            sx={{
              backgroundColor: "#fff",
              color: "#000",
              boxShadow: 1,
              zIndex: theme.zIndex.drawer + 1,
            }}
          >
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
              <img
          src={logo}
          alt="شهر سنج"
          style={{
            width: isMobile ? "0%" : "100%",
            maxWidth: "150px",
            transition: "width 0.3s",
          }}
        />
                <IconButton onClick={handleProfileClick}>
                  <Avatar
                    src={imagePreview || "/path-to-default-avatar.jpg"}
                    sx={{
                      width: 40,
                      height: 40,
                      ml: 2,
                      border: "2px solid #4caf50",
                    }}
                  />
                </IconButton>
                <Typography variant="body1" sx={{ marginLeft: 1 }}>
                  {profile ? profile.FullName : "نام کاربر"}
                </Typography>
              </Box>

              <IconButton color="inherit">
                <Notifications />
              </IconButton>
            </Toolbar>
          </AppBar>

          <ContentContainer>
  
    <>
      <TabPanel value={selectedItem} index="reports">
        <ReportDetails/>
      </TabPanel>

      <TabPanel value={selectedItem} index="profile">
        <ProfileSection
          profile={profile}
          imagePreview={imagePreview}
          isEditing={isEditing}
          editedProfile={editedProfile}
          setEditedProfile={setEditedProfile}
          setIsEditing={setIsEditing}
          handleImageUpload={handleImageUpload}
          handleSaveProfile={handleSaveProfile}
          handleCancelEdit={handleCancelEdit}
          setDeleteDialogOpen={setDeleteDialogOpen}
          fileInputRef={fileInputRef}
          handleMarkPictureForDeletion={handleMarkPictureForDeletion}
        />
      </TabPanel>
      <TabPanel value={selectedItem} index="teamForm">
  <TeamRegistrationForm onClose={() => setShowTeamForm(false)} />
</TabPanel>


    </>
  
</ContentContainer>

        </MainContent>
      </Box>

      <LogoutDialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
      />
      <DeleteAccountDialog
  open={deleteDialogOpen}
  onClose={() => setDeleteDialogOpen(false)}
  onConfirm={handleDeleteAccount}
/>

    </ThemeProvider>
  );
}
