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
  Avatar,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  Email as EmailIcon,
  Badge as BadgeIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import logo from "../assets/lgo.png";
import { getProfile } from "../services/profile";
import { useNavigate } from "react-router-dom";
import TabPanel from "../Components/TabPanel";
import { useAdmin } from "../context/AdminContext";
import LogoutDialog from "./LogoutDialog";
import FavoriteIcon from '@mui/icons-material/Favorite';
import ReplyIcon from '@mui/icons-material/Reply';
import ShareIcon from '@mui/icons-material/Share';



import potholeImage from "../assets/pathole.jpg"; // Add your pothole image to src/assets/
import riverImage from "../assets/river.jpg"; // Add your river image to src/assets/

const demoReports = [
  {
    id: 1,
    title: "چاله خیابان اصلی",
    description: "یک چاله بزرگ در خیابان اصلی شهر ایجاد شده که خطرناک است.",
    image: potholeImage,
    category: "مشکلات شهری",
  },
  {
    id: 2,
    title: "آلودگی رودخانه",
    description: "رودخانه شهر به شدت آلوده شده و نیاز به پاکسازی دارد.",
    image: riverImage,
    category: "محیط زیست",
  },
];

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
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>تأیید حذف حساب کاربری</DialogTitle>
      <DialogContent>
        <Typography>آیا مطمئن هستید که می‌خواهید حساب کاربری خود را حذف کنید؟ این عملیات قابل بازگشت نیست.</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          لغو
        </Button>
        <Button onClick={onConfirm} color="error">
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
  const [imagePreview, setImagePreview] = useState(null); // For displaying the profile image
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [reports, setReports] = useState([]);
  const [editedProfile, setEditedProfile] = useState({
    FullName: '',
    Picture: null,
  });

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
        // Set the image preview if a profile picture exists
        if (response.Picture) {
          setImagePreview(`http://127.0.0.1:8000${response.Picture}`); // Adjust the base URL as needed
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        navigate("/signuplogin");
      }
    };

    const fetchReports = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/supervise/citizen-report-citizen/", {
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
      const response = await fetch("http://127.0.0.1:8000/auth/logout/", {
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
      setImagePreview(URL.createObjectURL(file)); // Preview the uploaded image
    }
  };

  const handleSaveProfile = async () => {
    try {
      const formData = new FormData();
      formData.append("FullName", editedProfile.FullName);
      if (editedProfile.Picture) {
        formData.append("Picture", editedProfile.Picture);
      }

      const response = await fetch("http://127.0.0.1:8000/auth/profile/", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        // Update the image preview with the new image URL from the backend
        if (updatedProfile.Picture) {
          setImagePreview(`http://127.0.0.1:8000${updatedProfile.Picture}`);
        }
        setIsEditing(false);
      } else {
        console.error("Failed to update profile:", response.statusText);
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
    // Reset the image preview to the original profile picture
    setImagePreview(profile?.Picture ? `http://127.0.0.1:8000${profile.Picture}` : null);
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
    { id: "overview", label: "نمای کلی", icon: <BarChart /> },
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

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleString("fa-IR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
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
          src={imagePreview || "/path-to-default-avatar.jpg"} // Use imagePreview for profile picture
          sx={{
            width: 40,
            height: 40,
            ml: 2,
            border: "2px solid #4caf50", // Optional: Add a border for better visibility
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

          {/* Overview Tab */}
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

{/* Profile Tab */}
{/* Profile Tab */}
<TabPanel value={selectedItem} index={"profile"}>
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      flexDirection: { xs: "column", md: "row" },
      p: 4,
      gap: 4,
    }}
  >
    {/* Profile Card Section */}
    <Box
      sx={{
        width: { xs: "100%", md: "300px" },
        display: "flex",
        flexDirection: "column",
        alignItems: "center", // Center the content (title and paper) horizontally
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
      <AccountCircle sx={{ mr: 1, fontSize: 32, color: "#4caf50" }} /> {/* Profile-related icon */}
        <Typography variant="h5" fontWeight="bold">
          اطلاعات کاربری
        </Typography>
        
      </Box>
      <Paper
        elevation={4}
        sx={{
          width: "100%", // Ensure it takes the full width of the parent Box
          bgcolor: "#fff",
          p: 3,
          borderRadius: 3,
          boxShadow: "0 0 15px 5px rgba(76, 175, 80, 0.5)", // هاله سبز
        }}
      >
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <input
            type="file"
            accept="image/*"
            id="profile-image-input"
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />
          <label htmlFor={isEditing ? "profile-image-input" : undefined}>
            <Avatar
              src={imagePreview || "/path-to-default-avatar.jpg"}
              sx={{
                width: 100,
                height: 100,
                mx: "auto",
                mb: 1,
                boxShadow: "0 0 0 3px #4caf50, 0 0 10px rgba(76, 175, 80, 0.5)",
                cursor: isEditing ? "pointer" : "default",
              }}
            />
          </label>

          {isEditing ? (
            <>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ mb: 1, fontSize: "14px" }}
              >
                برای تغییر عکس پروفایل روی تصویر بالا کلیک کنید.
              </Typography>
              <TextField
                fullWidth
                label="نام کامل"
                value={editedProfile.FullName}
                onChange={(e) =>
                  setEditedProfile((prev) => ({
                    ...prev,
                    FullName: e.target.value,
                  }))
                }
                sx={{ mt: 2, mb: 2 }}
              />
            </>
          ) : (
            <>
              <Typography variant="h6" fontWeight="bold">
                {profile?.FullName || "نام کاربر"}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {profile?.user_type || "نوع کاربر مشخص نیست"}
              </Typography>
            </>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ textAlign: "right", mb: 2 }}>
          <Typography sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <EmailIcon sx={{ ml: 1, color: "#4caf50" }} />
            {profile?.Email || "ایمیل موجود نیست"}
          </Typography>

          <Typography sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <BadgeIcon sx={{ ml: 1, color: "#4caf50" }} />
            {profile?.user_type || "نوع کاربر مشخص نیست"}
          </Typography>
        </Box>

        {isEditing ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                borderRadius: 2,
                bgcolor: "#4caf50",
                "&:hover": { bgcolor: "#45a049" },
              }}
              onClick={handleSaveProfile}
            >
              ذخیره تغییرات
            </Button>
            <Button
              variant="outlined"
              fullWidth
              sx={{
                borderRadius: 2,
                borderColor: "#f44336",
                color: "#f44336",
                "&:hover": {
                  borderColor: "#d32f2f",
                  bgcolor: "rgba(244, 67, 54, 0.04)",
                },
              }}
              onClick={handleCancelEdit}
            >
              لغو
            </Button>
          </Box>
        ) : (
          <>
            <Button
              variant="outlined"
              fullWidth
              sx={{
                mt: 2,
                borderRadius: 2,
                borderColor: "#4caf50",
                color: "#4caf50",
                "&:hover": {
                  borderColor: "#45a049",
                  bgcolor: "rgba(76, 175, 80, 0.04)",
                },
              }}
              onClick={() => {
                setIsEditing(true);
                setEditedProfile({
                  FullName: profile?.FullName || "",
                  Picture: null,
                });
              }}
            >
              ویرایش اطلاعات پروفایل
            </Button>

            <Button
              variant="outlined"
              fullWidth
              sx={{
                mt: 2,
                borderRadius: 2,
                borderColor: "#f44336",
                color: "#f44336",
                "&:hover": {
                  borderColor: "#d32f2f",
                  bgcolor: "rgba(244, 67, 54, 0.04)",
                },
              }}
              onClick={() => setDeleteDialogOpen(true)}
            >
              حذف حساب کاربری
            </Button>
          </>
        )}
      </Paper>
    </Box>

    {/* Posts-like Section */}
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "50vh",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
      <Campaign sx={{ mr: 1, fontSize: 32, color: "#4caf50" }} /> {/* Report-related icon */}
        <Typography variant="h5" fontWeight="bold">
          گزارشات من
        </Typography>
        
      </Box>

      {demoReports.length > 0 ? (
        demoReports.map((report) => (
          <Paper
            key={report.id}
            elevation={3}
            sx={{
              p: 1.5,
              mb: 2,
              borderRadius: 2,
              bgcolor: "#fff",
              width: { xs: "100%", md: "80%" },
              maxWidth: "600px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* Report Image */}
            <Box sx={{ mb: 1 }}>
              <img
                src={report.image}
                alt={report.title}
                style={{
                  width: "100%",
                  height: "60px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            </Box>

            {/* Report Title and Description */}
            <Typography variant="h6" fontWeight="bold" mb={0.5}>
              {report.title}
            </Typography>
            <Typography variant="body2" color="text.primary" mb={0.5}>
              {report.description}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              دسته‌بندی: {report.category}
            </Typography>

            {/* Interaction Icons */}
            <Box sx={{ display: "flex", mt: 1, gap: 1 }}>
              <IconButton>
                <FavoriteIcon color="error" />
              </IconButton>
              <IconButton>
                <ReplyIcon />
              </IconButton>
              <IconButton>
                <ShareIcon />
              </IconButton>
            </Box>
          </Paper>
        ))
      ) : (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              bgcolor: "#f0f0f0",
              p: 2,
              borderRadius: 2,
              boxShadow: 1,
            }}
          >
            گزارشی برای نمایش وجود ندارد.
          </Typography>
        </Box>
      )}
    </Box>
  </Box>
</TabPanel>
  </Box>
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