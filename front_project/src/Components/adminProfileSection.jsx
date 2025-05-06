import React, { useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Divider,
  Avatar,
  TextField,
  Paper,
} from "@mui/material";
import {
  Email as EmailIcon,
  Badge as BadgeIcon,
  AccountCircle,
  Campaign,
  Favorite as FavoriteIcon,
  Reply as ReplyIcon,
  Share as ShareIcon,
} from "@mui/icons-material";
import {
    Card,
    Grid,
    AppBar,
    Toolbar,
    IconButton,
    Drawer,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    useMediaQuery,
    CssBaseline,
    styled,

  } from "@mui/material";
import potholeImage from "../assets/pathole.jpg";
import riverImage from "../assets/river.jpg";

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

export default function ProfileSection({
  profile,
  imagePreview,
  isEditing,
  editedProfile,
  setEditedProfile,
  setIsEditing,
  handleImageUpload,
  handleSaveProfile,
  handleCancelEdit,
  setDeleteDialogOpen,
  fileInputRef,
  handleMarkPictureForDeletion,
}) {
  return (
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
      {/* Profile Section */}
      <Box
        sx={{
          width: { xs: "100%", md: "460px" },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          alignSelf: "flex-start",
          mr: { md: 15 },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <AccountCircle sx={{ mr: 1, fontSize: 32, color: "#4caf50" }} />
          <Typography variant="h5" fontWeight="bold">
            اطلاعات کاربری
          </Typography>
        </Box>
        <Paper
          elevation={4}
          sx={{
            width: "100%",
            bgcolor: "#fff",
            p: 3,
            borderRadius: 3,
            boxShadow: "0 0 15px 5px rgba(76, 175, 80, 0.5)",
          }}
        >
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <input
              type="file"
              accept="image/*"
              id="profile-image-input"
              style={{ display: "none" }}
              onChange={handleImageUpload}
              ref={fileInputRef}
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

            {isEditing && (imagePreview || profile?.Picture) && (
              <Button
                variant="text"
                size="small"
                color="error"
                onClick={handleMarkPictureForDeletion}
                sx={{
                  fontSize: "0.8rem",
                  mt: 0.5,
                  color: "#f44336",
                  "&:hover": {
                    bgcolor: "rgba(244, 67, 54, 0.08)",
                  },
                }}
              >
                حذف عکس پروفایل
              </Button>
            )}

            {isEditing ? (
              <>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ mb: 1, fontSize: "14px" }}
                >
                  برای تغییر عکس پروفایل روی تصویر بالا کلیک کنید.
                </Typography>

                <div className={`form-group ${editedProfile.FullName ? "filled" : ""}`}>
  <input
    type="text"
    value={editedProfile.FullName}
    onChange={(e) =>
      setEditedProfile((prev) => ({
        ...prev,
        FullName: e.target.value,
      }))
    }
    required
  />
  <label>نام کامل</label>
</div>

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

      {/* Reports Section */}
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
          <Campaign sx={{ mr: 1, fontSize: 32, color: "#4caf50" }} />
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
              <Typography variant="h6" fontWeight="bold" mb={0.5}>
                {report.title}
              </Typography>
              <Typography variant="body2" color="text.primary" mb={0.5}>
                {report.description}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                دسته‌بندی: {report.category}
              </Typography>
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
      <style>
{`
  @font-face {
    font-family: 'Vazir';
    src: url('/fonts/Vazir.woff2') format('woff2'),
         url('/fonts/Vazir.woff') format('woff');
    font-weight: normal;
    font-style: normal;
  }

  .form-group {
    position: relative;
    margin: 20px 0;
    direction: rtl;
    text-align: right;
    font-family: 'Vazir', sans-serif;
  }

  .form-group input {
    width: 100%;
    padding: 16px 12px 8px 12px;
    font-size: 18px;
    border: 1px solid #ccc;
    border-radius: 6px;
    outline: none;
    text-align: right;
    font-family: 'Vazir', sans-serif;
  }

  .form-group label {
    position: absolute;
    right: 12px;
    top: 14px;
    background: #fff;
    padding: 0 6px;
    font-size: 16px;
    color: #888;
    pointer-events: none;
    transition: 0.2s ease all;
    font-family: 'Vazir', sans-serif;
  }

  .form-group input:focus + label,
  .form-group input:not(:placeholder-shown) + label {
    top: -8px;
    font-size: 13px;
    color: #007E33;
  }
`}
</style>
    </Box>
  );
}
