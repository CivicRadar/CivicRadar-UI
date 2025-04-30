import React from "react";
import { Box, Typography, Chip } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ReportIcon from "@mui/icons-material/Report";
import DescriptionIcon from "@mui/icons-material/Description";

function EnhancedReportContent({ reportData }) {
  const typeMapping = {
    Lighting: "مشکل روشنایی",
    Street: "مشکل خیابان",
    Garbage: "زباله‌ها",
    Others: "سایر",
  };

  const title = `${typeMapping[reportData.Type] || "مشکلی"} در ${reportData.CityName}`;

  return (
    <Box
      sx={{
        marginTop: { xs: "15px", md: "30px" },
        padding: { xs: "10px", sm: "15px", md: "30px" },
        width: "100%",
        direction: "rtl",
        fontFamily: "'IRANSans', sans-serif",
        animation: "fadeIn 0.5s ease-in-out",
        borderTopLeftRadius: "16px",
        borderTopRightRadius: "16px",
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        "@keyframes fadeIn": {
          from: { opacity: 0, transform: "translateY(10px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      }}
    >
      {/* عنوان */}
      <Typography
        variant="h4"
        sx={{
          color: "#4CAF50",
          fontWeight: "bold",
          textAlign: "center",
          background: "linear-gradient(90deg, #4CAF50, #1b5e20)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)",
          marginBottom: { xs: "15px", md: "20px" },
          transition: "transform 0.3s ease-in-out",
          maxWidth: "1200px",
          mx: "auto",
          fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
          "&:hover": {
            transform: "scale(1.02)",
          },
        }}
      >
        {title}
      </Typography>

      {/* تگ‌ها */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1.5,
          direction: "rtl",
          justifyContent: "flex-start",
          alignItems: "center",
          mb: 2,
        }}
      >
        {/* نوع مشکل */}
        <Chip
          icon={
            <ReportIcon
              sx={{
                color: "#2e7d32",
                fontSize: "18px",
                ml: "4px",
              }}
            />
          }
          label="مشکل خیابان"
          sx={{
            backgroundColor: "#e8f5e9",
            color: "#2e7d32",
            fontWeight: "bold",
            borderRadius: "12px",
            fontSize: "0.95rem",
            height: "36px",
            ".MuiChip-icon": {
              marginRight: "4px",
              marginLeft: 0,
            },
          }}
        />

        {/* تاریخ: فقط در نمایشگرهای بزرگ به چپ بره */}
        <Box sx={{ marginRight: { xs: 0, sm: "auto" } }}>
          <Chip
            icon={
              <CalendarTodayIcon
                sx={{
                  color: "#33691e",
                  fontSize: "18px",
                  ml: "4px",
                }}
              />
            }
            label="۱۰ اردیبهشت ۱۴۰۴"
            sx={{
              backgroundColor: "#f1f8e9",
              color: "#33691e",
              fontWeight: "bold",
              borderRadius: "12px",
              fontSize: "0.95rem",
              height: "36px",
              ".MuiChip-icon": {
                marginRight: "4px",
                marginLeft: 0,
              },
            }}
          />
        </Box>
      </Box>

      {/* اطلاعات متن */}
      <Box
        sx={{
          textAlign: "right",
          direction: "rtl",
          padding: { xs: "15px", md: "30px" },
          borderRadius: "12px",
          transition: "all 0.3s ease-in-out",
          maxWidth: "1200px",
          mx: "auto",
        }}
      >
        {/* اطلاعات متن با طراحی جدید */}

{/* اطلاعات متن با طراحی زیبا و آیکون جدید */}
<Box
  sx={{
    backgroundColor: "#fafafa", // پس‌زمینه خنثی و آرام
    border: "1px solid #e0e0e0", // حاشیه ملایم
    borderRadius: "12px", // گوشه‌های گردتر و مدرن
    padding: { xs: "16px", sm: "20px", md: "24px" }, // پدینگ ریسپانسیو
    maxWidth: "1200px",
    mx: "auto",
    my: 3, // فاصله عمودی بیشتر برای تنفس بهتر
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.08)", // سایه نرم‌تر
  }}
>
  <Typography
    variant="subtitle1"
    sx={{
      fontWeight: 600, // وزن فونت متعادل
      color: "#424242", // رنگ خاکستری تیره برای خوانایی
      mb: 2, // فاصله زیر عنوان
      display: "flex",
      alignItems: "center",
      fontSize: { xs: "1rem", md: "1.15rem" }, // فونت ریسپانسیو
    }}
  >
    <DescriptionIcon sx={{ fontSize: "20px", mr: 1, color: "#757575" }} /> {/* آیکون با رنگ ملایم */}
    توضیحات گزارش
  </Typography>

  <Typography
  variant="body1"
  sx={{
    lineHeight: { xs: 1.7, md: 1.8 },
    color: "#333333", // حفظ رنگ اصلی شما
    fontSize: { xs: "0.95rem", md: "1.05rem" },
    textAlign: "justify",
    wordBreak: "break-word",

    // افزودن محدودیت ارتفاع و اسکرول
    maxHeight: {
      xs: "15.5em",   // حدود 5 خط با line-height: 1.7
      md: "21.6em",  // حدود 12 خط با line-height: 1.8
    },
    overflowY: "auto",
    pr: 1, // فضای اضافی برای scrollbar
  }}
>
  {reportData.Information}
</Typography>

</Box>


      </Box>
    </Box>
  );
}

export default EnhancedReportContent;
