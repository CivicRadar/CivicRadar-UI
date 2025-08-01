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
  People,
  Person,
  Warning,
  ExitToApp,
  Menu as MenuIcon,
  AccountCircle,
  Campaign,
  Notifications,
  
    // ...
    BarChart,  // ← آیکون برای آمار و اطلاعات
  
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import logo from "../assets/lgo.png";
import { getProfile } from "../services/profile";
import { useNavigate } from "react-router-dom";
import TabPanel from "../Components/TabPanel";
import LogoutDialog from "./LogoutDialog";
import ReportsTab from "../Components/ReportsTab"; 
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import TeamRegistrationForm from "../Components/TeamRegistrationForm";
import ProfileSection from "../Components/mayerProfileSection";
import { useLocation } from "react-router-dom";
import IranMapSection from "../Components/iranmap";
import ReportsMap from "../Components/ReportsMap";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import MayorStatsPanel from "../Components/mayorstatpanel";
import { getStats } from "../services/mayor-api";
import { Badge } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
// import { useNavigate } from "react-router-dom"; 
import BlockRounded from "@mui/icons-material/BlockRounded";
import VisibilityRounded from "@mui/icons-material/VisibilityRounded";




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

export default function MayorDashboard() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [selectedItem, setSelectedItem] = useState("reports");
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [dashboardData, setdashboardData] = useState({ UserCount: 0, MayorCount: 0, DailyReportCount: 0 });
  const [profile, setProfile] = useState(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:900px)");
  const [imagePreview, setImagePreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [editedProfile, setEditedProfile] = useState({
    FullName: "",
    Picture: null,
  });
  const [notifDialogOpen, setNotifDialogOpen] = useState(false);
  const [shouldDeletePicture, setShouldDeletePicture] = useState(false);
  const fileInputRef = useRef();
  const handleShowTeamForm = () => {
    // setShowTeamForm(true);
    setSelectedItem("teamForm"); // تغییر دادن مقدار selectedItem به "افزودن تیم"
  };

  const handleProfileClick = () => {
    setSelectedItem("profile");
  };

  const fetchStats = async () => {
    try {
      const response = await getStats();
      console.log(response)
      setdashboardData(response)
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await getProfile();
      setProfile(response);
      setEditedProfile({
        FullName: response.FullName || "",
        Picture: null,
      });

      if (response.status === 429) {
        window.location.href = "/429";
        return;
        }

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
  useEffect(() => {
  const fetchNotifications = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/communicate/mayor-notifications/`,
        { credentials: "include" }
      );
      if (res.status === 429) {
        window.location.href = "/429";
        return;
        }
      const data = await res.json();
      console.log("hi" + data);
      setNotifications(data);
    }
     catch (err) {
      console.error("خطا در دریافت نوتیفیکیشن:", err);
    }
  };

  fetchNotifications();
}, []);


  useEffect(() => {
    // Check if state exists on initial load
    if (location.state?.page) {
      // Use the state value
      setSelectedItem(location.state.page);

      // Immediately clear the state by navigating to the same route without state
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);
  
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

  const toPersianNumber = (num) => {
    return num.toString().replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
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
        if (response.status === 429) {
          window.location.href = "/429";
          return;
          }
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
        if (response.status === 429) {
          window.location.href = "/429";
          return;
          }
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
    fetchStats();
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
    { id: "overview", label: "نمای کلی", icon: <Map /> },  // نمای کلی (جدید)
    { id: "reports", label: "گزارشات", icon: <Campaign /> },
    { id: "map", label: "نقشه", icon: <Map /> },
    { id: "stats", label: "آمار و اطلاعات", icon: <BarChart /> },
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
  startIcon={
    <Box sx={{ display: "flex", alignItems: "center", ml: 0.5 }}>
      <GroupAddIcon />
    </Box>
  }
  sx={{
    mb: 2,
    borderRadius: "12px",
    fontWeight: "bold",
    fontSize: "16px",
    mt: 1,
    justifyContent: "center",
    gap: 1.2, // فاصله مناسب بین آیکون و متن
  }}
  onClick={handleShowTeamForm}
>
  افزودن تیم
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

    const handleNotifDialogClose = () => {
  const unseen = notifications.filter((n) => !n.Seen);
  unseen.forEach((notif) => {
    fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/communicate/mayor-notifications/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ NotificationID: notif.id }),
    })
      .then((res) => res.json())
      .then(() => {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notif.id ? { ...n, Seen: true } : n
          )
        );
      })
      .catch((err) => console.error("خطا در seen کردن نوتیف:", err));
  });

  setNotifDialogOpen(false);
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
        <Drawer
          variant="temporary"
          anchor="right"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              width: 300,
              bgcolor: "#fff",
              direction: "rtl",
              boxShadow: 3,
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
              overflowX: "hidden", 

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

              <IconButton color="inherit" onClick={() => setNotifDialogOpen(true)}>
  <Badge badgeContent={notifications.filter(n => !n.Seen).length} color="error">
    <Notifications />
  </Badge>
</IconButton>

            </Toolbar>
          </AppBar>

          <ContentContainer>
  
    <>
    <TabPanel value={selectedItem} index="overview">
      <Grid container spacing={3}>
        {[
          {
            title: "تعداد کل کاربران",
            value: dashboardData.UserCount,
            icon: <Person color="success" />,
            color: "#E8F5E9",
          },
          {
            title: "تعداد کل مسئولین",
            value: dashboardData.MayorCount,
            icon: <People color="error" />,
            color: "#FFEBEE",
          },
          {
            title: "تعداد گزارشات امروز",
            value: dashboardData.DailyReportCount,
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
    <IranMapSection />
  </TabPanel>
      <TabPanel value={selectedItem} index="reports">
        <ReportsTab ReportClick={handleReportClick}/>
      </TabPanel>

      <TabPanel value={selectedItem} index="map">
  <ReportsMap />
</TabPanel>


<TabPanel value={selectedItem} index="stats">
  <MayorStatsPanel />
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

<Dialog
  open={notifDialogOpen}
  onClose={handleNotifDialogClose}
  maxWidth="sm"
  fullWidth
  dir="rtl"
>
  <DialogTitle
    sx={{
      fontWeight: "bold",
      textAlign: "center",
      position: "relative",
      pr: 4,
    }}
  >
    📢 پیام‌ها
    <IconButton
      onClick={handleNotifDialogClose}
      sx={{
        position: "absolute",
        left: 8,
        top: 8,
        color: "grey.500",
      }}
    >
      <CloseIcon />
    </IconButton>
  </DialogTitle>

  <DialogContent sx={{ px: 3, py: 1.5 }}>
    {notifications.length === 0 ? (
      <Box
        sx={{
          textAlign: "center",
          mt: 3,
          color: "text.secondary",
          fontSize: "1rem",
        }}
      >
        📭 پیامی وجود ندارد
      </Box>
    ) : (
      notifications.map((notif) => (
        <Box
          key={notif.id}
          sx={{
            backgroundColor: notif.Seen ? "#f9f9f9" : "#e3f2fd",
            p: 2,
            borderRadius: 2,
            mb: 1.5,
            border: notif.Seen ? "1px solid #ddd" : "1px solid #64b5f6",
            boxShadow: notif.Seen ? 0 : 2,
            transition: "background 0.3s",
          }}
        >
          <Typography fontWeight={notif.Seen ? "normal" : "bold"} sx={{ mb: 1 }}>
            {notif.Message}
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
 <Button
  variant="contained"
  color="success"
  size="small"
  disabled={!notif.CityProblemID}
  onClick={() => navigate(`/reports/${notif.CityProblemID}`)}
  sx={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 1,
    borderRadius: "20px",
    textTransform: "none",
    fontWeight: "bold",
    fontSize: "0.9rem",
    bgcolor: notif.CityProblemID ? "success.main" : "grey.300",
    color: notif.CityProblemID ? "white" : "grey.600",
    direction: "rtl", // راست‌چین کردن متن و ترتیب
    "&:hover": {
      bgcolor: notif.CityProblemID ? "success.dark" : "grey.400",
    },
  }}
>
  {notif.CityProblemID ? "مشاهده گزارش" : "گزارش حذف شده است"}
  {notif.CityProblemID ? <VisibilityRounded /> : <BlockRounded />}
</Button>


</Box>


        </Box>
      ))
    )}
  </DialogContent>
</Dialog>






    </ThemeProvider>
  );
}
