import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  Card,
  Grid,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  Avatar,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  CssBaseline,
  styled,
  Paper,
} from "@mui/material";
import {
  People,
  Person,
  BarChart,
  Map,
  Warning,
  ExitToApp,
  Menu as MenuIcon,
  AccountCircle,
  Campaign,
  EmojiEvents, // Added for the new icon
  Assignment,
  ListAlt,
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import logo from "../assets/lgo.png";
import { getProfile } from "../services/profile";
import { useNavigate } from "react-router-dom";
import TabPanel from "../Components/TabPanel";
import LogoutDialog from "./LogoutDialog";
import ReportForm from "../Components/ReportsComp";
import ReportFeed from "../Components/Reportsfeed";
import ProfileSection from "../Components/ProfileSection";
import CitizenNotification from "./CitizenNotification";
import CitizenStats from "./CitizenStats";
import IranMapSection from "../Components/iranmap";

// Create a styled component for the main content area
const MainContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  overflow: "hidden",
  backgroundColor: "#F9FAFB"
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: "auto",
  padding: theme.spacing(3),
  backgroundColor: "#F9FAFB"
}));

const dashboardData = {
  users: 32,
  admins: 32,
  reportsToday: 147,
};

const toPersianNumber = (num) => {
  return num.toString().replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
};

const DeleteAccountDialog = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose} dir="rtl">
      <DialogTitle sx={{ fontWeight: "bold" }}>تأیید حذف حساب کاربری</DialogTitle>
      <DialogContent>
        <Typography sx={{ mt: 1 }}>
          آیا مطمئن هستید که می‌خواهید حساب کاربری خود را حذف کنید؟ این عملیات قابل بازگشت نیست।
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          sx={{
            color: "#4caf50",
            fontWeight: "bold",
            "&:hover": {
              bgcolor: "rgba(76, 175, 80, 0.1)",
            },
          }}
        >
          لغو
        </Button>
        <Button
          onClick={onConfirm}
          sx={{
            color: "#f44336",
            fontWeight: "bold",
            "&:hover": {
              bgcolor: "rgba(244, 67, 54, 0.1)",
            },
          }}
        >
          حذف
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default function CitizenDashboard() {
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState("overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [reports, setReports] = useState([]);
  const fileInputRef = useRef();

  const [shouldDeletePicture, setShouldDeletePicture] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    FullName: '',
    Picture: null,
  });
  const isMobile = useMediaQuery('(max-width:900px)');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        console.log("Profile Data:", response);
        setProfile(response);
        setEditedProfile({
          FullName: response.FullName || '',
          Picture: null,
        });
        if (response.Picture) {
          setImagePreview(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}${response.Picture}`);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        navigate("/signuplogin");
      }
    };

    const fetchReports = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/supervise/citizen-report-citizen/`, {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setReports(data);
        } else {
          console.error("Failed to fetch reports:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchProfile();
    fetchReports();
  }, [navigate]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/auth/logout/`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        navigate("/signuplogin");
      } else {
        console.error("Failed to delete account:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setEditedProfile((prev) => ({
        ...prev,
        Picture: file,
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleMarkPictureForDeletion = () => {
    setShouldDeletePicture(true);
    setImagePreview(null);
    setEditedProfile(prev => ({
      ...prev,
      Picture: null,
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSaveProfile = async () => {
    try {
      if (shouldDeletePicture) {
        await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/auth/profile/`, {
          method: "DELETE",
          credentials: "include",
        });
      }

      let response;

      if (editedProfile.Picture instanceof File) {
        const formData = new FormData();
        formData.append("FullName", editedProfile.FullName);
        formData.append("Picture", editedProfile.Picture);

        response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/auth/profile/`, {
          method: "POST",
          body: formData,
          credentials: "include",
        });
      } else {
        response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/auth/profile/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            FullName: editedProfile.FullName,
          }),
        });
      }

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        if (updatedProfile.Picture) {
          setImagePreview(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}${updatedProfile.Picture}`);
        } else {
          setImagePreview(null);
        }
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

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedProfile({
      FullName: profile?.FullName || "",
      Picture: null,
    });
    setImagePreview(profile?.Picture ? `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}${profile.Picture}` : null);
  };

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

  const menuItems = [
    { id: "profile", label: "پروفایل کاربری", icon: <AccountCircle /> },
    { id: "overview", label: "نمای کلی", icon: <BarChart /> },
    { id: "violations", label: "نمایش گزارشات", icon: <ListAlt sx={{ color: "green" }} /> },
    { id: "stats", label: "فعالیت‌ها و امتیازات", icon: <EmojiEvents /> }, // Changed icon to EmojiEvents
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
        height: "100vh",
        overflowY: "auto",
        position: "sticky",
        top: 0
      }}
    >
      <Box sx={{ mb: 2, textAlign: "center" }}>
        <img
          src={logo}
          alt="شهر سنج"
          style={{ width: isMobile ? "0%" : "100%", maxWidth: "150px" }}
        />
      </Box>

      <Box sx={{ width: "100%", mt: 2 }}>
  <Button
    variant="contained"
    color="success"
    fullWidth
    sx={{
      py: 1.2,
      borderRadius: "10px",
      fontWeight: "bold",
      fontSize: "16px",
    }}
    onClick={() => setSelectedItem("map")}
  >
    ثبت گزارشات
  </Button>
</Box>


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

  const handleProfileClick = () => {
    setSelectedItem("profile");
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ direction: "rtl", display: "flex", height: "100vh", overflow: "hidden" }}>
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
              overflowY: "auto",
            },
          }}
          open
        >
          {SidebarContent}
        </Drawer>

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
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 0, display: { xs: "block", md: "none" }, ml: 1 }}
                >
                  <MenuIcon />
                </IconButton>
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
              <CitizenNotification />
            </Toolbar>
          </AppBar>

          <ContentContainer>
            <TabPanel value={selectedItem} index={"overview"}>
              <Grid container spacing={3}>
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
              <Box sx={{ mt: 4 }}>
    <IranMapSection />
  </Box>
            </TabPanel>

            <TabPanel value={selectedItem} index={"stats"}>
                <CitizenStats />
            </TabPanel>
            <TabPanel value={selectedItem} index={"map"}>
              <Box sx={{ height: "100%", backgroundColor: "#F9FAFB" }}>
                <ReportForm />
              </Box>
            </TabPanel>

            <TabPanel value={selectedItem} index={"violations"}>
              <Box sx={{ height: "100%", backgroundColor: "#F9FAFB" }}>
                <ReportFeed />
              </Box>
            </TabPanel>

            <TabPanel value={selectedItem} index={"profile"}>
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