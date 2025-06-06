import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Divider,
  Avatar,
  Paper,
  IconButton,
} from "@mui/material";
import {
  Email as EmailIcon,
  Badge as BadgeIcon,
  AccountCircle,
  Campaign,
  ThumbDown as ThumbDownIcon,
  ThumbUp as ThumbUpIcon,
} from "@mui/icons-material";

// ترجمه نوع گزارش
const typeToPersian = (type) => {
  switch ((type || "").toLowerCase()) {
    case "street":
      return "خیابان";
    case "lighting":
      return "نور";
    case "garbage":
      return "زباله";
    case "other":
      return "سایر";
    default:
      return type || "نامشخص";
  }
};

// کوتاه کننده توضیحات
const truncateWords = (text, n = 5) => {
  if (!text) return "";
  const words = text.split(/\s+/);
  if (words.length <= n) return text;
  return words.slice(0, n).join(" ") + " ...";
};

const statusToPersian = (status) => {
  switch (status) {
    case "PendingReview":
      return "در انتظار بررسی";
    case "UnderConsideration":
      return "در حال بررسی";
    case "IssueResolved":
      return "حل شده";
    default:
      return status || "نامشخص";
  }
};

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
  const [userReports, setUserReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    async function fetchReports() {
      setLoadingReports(true);
      setFetchError(null);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/supervise/citizen-report-problem/`,
          { credentials: "include" }
        );
        if (!res.ok) throw new Error("خطا در دریافت گزارشات!");
        const data = await res.json();
        setUserReports(data);
      } catch (err) {
        setUserReports([]);
        setFetchError("گزارشات بارگذاری نشدند!");
      } finally {
        setLoadingReports(false);
      }
    }
    fetchReports();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        flexDirection: { xs: "column", md: "row" },
        gap: 4,

      }}
    >
      {/* Profile Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",

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
                  boxShadow:
                    "0 0 0 3px #4caf50, 0 0 10px rgba(76, 175, 80, 0.5)",
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
    alignItems: { xs: "center", md: "center" },
    width: "100%",
    direction: "rtl",
    maxHeight: "80vh", // یا هر مقدار مناسب دیگه
    overflowY: "auto",
  }}
>



        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Campaign sx={{ mr: 1, fontSize: 32, color: "#4caf50" }} />
          <Typography variant="h5" fontWeight="bold">
            گزارشات من
          </Typography>
        </Box>
        {loadingReports ? (
          <Typography sx={{ p: 2 }}>در حال دریافت گزارشات...</Typography>
        ) : fetchError ? (
          <Typography color="error" sx={{ p: 2 }}>
            {fetchError}
          </Typography>
        ) : userReports.length > 0 ? (
          userReports.map((report) => (
            <Paper
  key={report.id}
  elevation={3}
  sx={{
    direction: "rtl",
    textAlign: "right",
    width: "100%",
    maxWidth: { xs: "98%", sm: 780, md: 800 }, // ← تغییر مهم
    // mx: "auto",
    p: 1.5,
        mx: { xs: 1.5, sm: "auto" },  // ✅ فاصله افقی در موبایل، وسط‌چین در دسکتاپ

    mb: 3,
    borderRadius: 4,
    bgcolor: "#fff",
    boxShadow: "0 0 15px 5px rgba(76, 175, 80, 0.5)",
  }}
>


              <Box sx={{ mb: 1 }}>
                <img
                  src={
                    report.Picture && !report.Picture.startsWith("http")
                      ? `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}${report.Picture}`
                      : report.Picture || "/path-to-default.jpg"
                  }
                  alt={report.Information}
                  style={{
                    width: "100%",
                    height: "130px",
                    objectFit: "cover",
                    borderRadius: "10px",
                  }}
                />
              </Box>
              <Typography variant="h6" fontWeight="bold" mb={0.5}>
                {truncateWords(report.Information, 5)}
              </Typography>
              <Typography variant="body2" color="text.primary" mb={0.5}>
                {report.FullAdress}
              </Typography>
              <Typography
  variant="caption"
  color="text.secondary"
  sx={{ fontWeight: 600, display: 'block', mb: .5 }}   
>
  نوع گزارش: {typeToPersian(report.Type)}
</Typography>

<Typography
  variant="caption"
  color="text.secondary"
  sx={{ display: 'block' }}                          
>
  وضعیت: {statusToPersian(report.Status)}
</Typography>

              <Box
                sx={{
                  display: "flex",
                  mt: 2,
                  gap: 2,
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <IconButton>
                  <ThumbUpIcon sx={{ color: "#43a047", fontSize: 28 }} />
                  <span style={{ fontSize: 13, marginRight: 4 }}>
                    {report.Likes ?? 0}
                  </span>
                </IconButton>
                <IconButton>
                  <ThumbDownIcon sx={{ color: "#f44336", fontSize: 28 }} />
                  <span style={{ fontSize: 13, marginRight: 4 }}>
                    {report.Dislikes ?? 0}
                  </span>
                </IconButton>
              </Box>
              <Button
                fullWidth
                variant="contained"
                sx={{
                  mt: 2,
                  bgcolor: "#388e3c",
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: 17,
                  borderRadius: 2,
                  "&:hover": { bgcolor: "#2e7d32" },
                  py: 1.1,
                  letterSpacing: 0.5,
                  boxShadow: "0 2px 12px 0 #43a04740",
                }}
                onClick={() => window.location.href =`/reports/${report.id}`}
              >
                رفتن به صفحه گزارش
              </Button>
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
