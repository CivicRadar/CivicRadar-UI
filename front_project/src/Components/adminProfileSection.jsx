import React from "react";
import {
  Box,
  Typography,
  Button,
  Divider,
  Avatar,
  Paper,
} from "@mui/material";
import {
  Email as EmailIcon,
  Badge as BadgeIcon,
  AccountCircle,
} from "@mui/icons-material";

// دمو گزارشات رو بعدا با دیتا واقعی جایگزین کنین
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
        p: { xs: 2, md: 6 },
        gap: 4,
        fontFamily: "Vazir, sans-serif",
      }}
    >
      {/* پروفایل کاربری */}
      <Box
        sx={{
          width: { xs: "100%", sm: 480, md: 540 }, // عرض بیشتر در دسکتاپ
          minHeight: { xs: 380, sm: 480, md: 600 }, // ارتفاع بیشتر
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          alignSelf: "flex-start",
          mx: "auto",
          flexShrink: 0,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <AccountCircle sx={{ mr: 1, fontSize: 36, color: "#4caf50" }} />
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ fontFamily: "Vazir" }}
          >
            اطلاعات کاربری
          </Typography>
        </Box>
        <Paper
          elevation={4}
          sx={{
            width: "100%",
            bgcolor: "#fff",
            p: { xs: 3, sm: 4 },
            borderRadius: 4,
            minHeight: { xs: 320, sm: 400, md: 510 },
             boxShadow: "0 0 15px 5px rgba(76, 175, 80, 0.5)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ textAlign: "center", mb: 2, position: "relative" }}>
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
                src={
                  imagePreview || profile?.Picture || "/profile-placeholder.png"
                }
                sx={{
                  width: 120,
                  height: 120,
                  mx: "auto",
                  mb: 1,
                  boxShadow: "0 0 0 3px #4caf50, 0 0 16px 4px #43a04733",
                  cursor: isEditing ? "pointer" : "default",
                  transition: "box-shadow 0.2s",
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
                  "&:hover": { bgcolor: "rgba(244, 67, 54, 0.08)" },
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
                <div
                  className={`form-group ${editedProfile.FullName ? "filled" : ""}`}
                >
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
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{
                    wordBreak: "break-all",
                    overflowWrap: "break-word",
                    minWidth: 0,
                    maxWidth: "100%",
                  }}
                >
                  {profile?.FullName || "نام کاربر"}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  sx={{
                    wordBreak: "break-all",
                    overflowWrap: "break-word",
                    minWidth: 0,
                    maxWidth: "100%",
                  }}
                >
                  {profile?.user_type || "نوع کاربر مشخص نیست"}
                </Typography>
              </>
            )}
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ textAlign: "right", mb: 2, minWidth: 0 }}>
             <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
    <EmailIcon sx={{ ml: 1, color: "#4caf50" }} />
    <Typography
      sx={{
        direction: "ltr",          // Ensure the text is in LTR direction
        textAlign: "left",        // Align the text to the left
        fontSize: "1.2rem",       // Adjust font size if needed
        maxWidth: "100%",         // Ensure it takes up available width
        overflowX: "auto",        // Allow horizontal scroll if the text overflows
        whiteSpace: "nowrap",     // Prevent line breaks
        WebkitOverflowScrolling: "touch",  // Smooth scrolling for touch devices
      }}
    >
      {profile?.Email || "ایمیل موجود نیست"}
    </Typography>
  </Box>
            <Typography
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 1,
                wordBreak: "break-all",
                overflowWrap: "break-word",
                minWidth: 0,
                maxWidth: "100%",
              }}
            >
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
                  "&:hover": { bgcolor: "#37823c" },
                  fontFamily: "Vazir",
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
                  fontFamily: "Vazir",
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
                  fontFamily: "Vazir",
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
                  fontFamily: "Vazir",
                }}
                onClick={() => setDeleteDialogOpen(true)}
              >
                حذف حساب کاربری
              </Button>
            </>
          )}
        </Paper>
      </Box>

      {/* استایل فرم اینپوت‌ها */}
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
