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
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import TeamRegistrationForm from "../Components/TeamRegistrationForm";
import ProfileSection from "../Components/mayerProfileSection";
import ReportDetails from "./ReportDetails";
import { useCitizen } from "../context/CitizenContext";
import { useMayor } from "../context/MayorContext";

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
  const { citizen } = useCitizen();
  const { mayor } = useMayor();
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
    if (citizen){
      navigate(`/CitizenDashboard`, { state: { page: "profile" } });
    }
    else if (mayor) {
      navigate(`/MayorDashboard`, { state: { page: "profile" } });
    }
    else{
      navigate(`/Signuplogin`, { state: { page: "profile" } });
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
      if (response.Picture) {
        setImagePreview(
          `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}${response.Picture}`
        );
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching profile:", error);
      //navigate("/signuplogin");
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
                  <Typography variant="body1" sx={{ marginLeft: 1 }}>
                  {profile ? profile.FullName : "ثبت نام / ورود"}
                </Typography>
                </IconButton>
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
