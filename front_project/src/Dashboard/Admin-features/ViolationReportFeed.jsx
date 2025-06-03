import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  TextField,
  InputAdornment,
  Collapse,
  Chip,
  IconButton,
  Dialog,
  DialogContent,
} from "@mui/material";
import Masonry from "react-masonry-css";
import SortIcon from "@mui/icons-material/Sort";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DateObject from "react-date-object";
import "./masonry.css";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import BuildIcon from "@mui/icons-material/Build";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CloseIcon from '@mui/icons-material/Close';
import ReportIcon from "@mui/icons-material/Report";
import Swal from "sweetalert2";
import DeleteIcon from '@mui/icons-material/Delete';
import { DialogTitle } from "@mui/material";


const ViolationReportFeed = () => {
  const [reports, setReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [sortOptions, setSortOptions] = useState([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogImage, setDialogImage] = useState("");
  const [userLikeStatusMap, setUserLikeStatusMap] = useState({}); 
  const BASE = `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}`;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
const [reportToDelete, setReportToDelete] = useState(null);
const [unmarkDialogOpen, setUnmarkDialogOpen] = useState(false);
const [reportToUnmark, setReportToUnmark] = useState(null);


const toPersianDigits = (num) => {
  if (num === null || num === undefined) return '';
  return num.toString().replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);
};










const handleUnmarkViolation = async (id) => {
  try {
    const res = await fetch(`${BASE}/supervise/handle-crc/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ CityProblemID: id }),
    });

    if (!res.ok) throw new Error("رفع وضعیت تخلف ناموفق بود");

    setReports((prev) => prev.filter((r) => r.id !== id));

    Swal.fire({
      icon: "success",
      title: "وضعیت تخلف حذف شد",
      text: "گزارش از لیست متخلفین خارج شد",
      confirmButtonText: "باشه",
      customClass: {
        confirmButton: "swal-confirm-btn",
        title: "swal-title",
        htmlContainer: "swal-text",
      },
    });
  } catch (e) {
    console.error("handleUnmarkViolation error:", e);
  }
};


  
const handleDeleteReport = async () => {
  if (!reportToDelete) return;

  try {
    const res = await fetch(`${BASE}/supervise/handle-crc/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ CityProblemID: reportToDelete }),
    });

    if (!res.ok) throw new Error("حذف گزارش با مشکل مواجه شد");

    setReports(prev => prev.filter(r => r.id !== reportToDelete));
    setDeleteDialogOpen(false);
    setReportToDelete(null);

    // ✅ پیام موفقیت
    Swal.fire({
      icon: "success",
      title: "!حذف با موفقیت انجام شد",
      text: ".گزارش با موفقیت از سامانه حذف شد",
      confirmButtonText: "باشه",
      customClass: {
            confirmButton: "swal-confirm-btn",
            title: "swal-title",
            htmlContainer: "swal-text"  
          },
    });

  } catch (e) {
    console.error("خطا در حذف گزارش:", e);
  }
};




useEffect(() => {
  fetch(`${BASE}/supervise/handle-crc/`, {
    credentials: 'include'      // ← اضافه کنید
  })
    .then(res => res.json())
    .then(async (data) => {
      // حالا سرور شما را ادمین تشخیص می‌دهد
      // و فقط گزارش‌های دارای تخلف (Reports.length>0) را برمی‌گرداند
      setReports(data);
      console.log("داده‌ی دریافتی:", data);

      const statusMap = {};
      for (let r of data) {
        const res = await fetch(
          `${BASE}/communicate/like/?CityProblemID=${r.id}`,
          { method: 'GET', credentials: 'include' }
        );
        if (res.ok) {
          const { Like } = await res.json();
          statusMap[r.id] = Like;
        }
      }
      setUserLikeStatusMap(statusMap);

      const uniqueProvinces = [
        ...new Set(data.map((r) => r.ProvinceName).filter(Boolean))
      ];
      setProvinces(uniqueProvinces);
    })
    .catch((err) => console.error("fetch handle-crc error:", err));
}, []);

  

  useEffect(() => {
    if (!selectedProvince) {
      setCities([]);
      return;
    }
  
    const filteredCities = reports
      .filter((r) => r.ProvinceName === selectedProvince)
      .map((r) => r.CityName)
      .filter(Boolean);
  
    const uniqueCities = [...new Set(filteredCities)];
    setCities(uniqueCities);
  }, [selectedProvince, reports]);

  const translateType = (type) => {
    switch (type) {
      case "Lighting":
      case "lighting":
      case "روشنایی":
        return "روشنایی";
      case "Street":
      case "street":
      case "خیابان":
        return "خیابان";
      case "Garbage":
      case "garbage":
      case "زباله":
        return "زباله";
      case "Other":
      case "other":
      case "سایر":
        return "سایر";
      default:
        return type;
    }
  };

  const translateStatus = (status) => {
    switch (status) {
      case "PendingReview":
      case "در انتظار بررسی":
        return "در انتظار بررسی";
      case "UnderConsideration":
      case "در حال رسیدگی":
        return "در حال رسیدگی";
      case "IssueResolved":
      case "حل‌شده":
        return "حل‌شده";
      default:
        return status;
    }
  };
// … بقیه‌ی ایمپورت‌ها و stateها

const handleLikeToggle = async (reportId) => {
  const current = userLikeStatusMap[reportId];
  const sendingValue = true;

  try {
    await fetch(`${BASE}/communicate/like/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        CityProblemID: reportId,
        Like: sendingValue,
      }),
    });

    const updatedStatus = current === true ? null : true;

    setUserLikeStatusMap((m) => ({ ...m, [reportId]: updatedStatus }));

    setReports((rs) =>
      rs.map((r) => {
        if (r.id !== reportId) return r;
        let Likes = r.Likes || 0;
        let Dislikes = r.Dislikes || 0;

        if (current === true) {
          Likes -= 1; // برداشتن لایک
        } else if (current === false) {
          Dislikes -= 1;
          Likes += 1; // از دیسلایک به لایک
        } else {
          Likes += 1; // لایک جدید
        }

        return { ...r, Likes, Dislikes };
      })
    );
  } catch (e) {
    console.error("handleLikeToggle error", e);
  }
};


const handleDislikeToggle = async (reportId) => {
  const current = userLikeStatusMap[reportId];
  const sendingValue = false;

  try {
    await fetch(`${BASE}/communicate/like/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        CityProblemID: reportId,
        Like: sendingValue,
      }),
    });

    const updatedStatus = current === false ? null : false;

    setUserLikeStatusMap((m) => ({ ...m, [reportId]: updatedStatus }));

    setReports((rs) =>
      rs.map((r) => {
        if (r.id !== reportId) return r;
        let Likes = r.Likes || 0;
        let Dislikes = r.Dislikes || 0;

        if (current === false) {
          Dislikes -= 1; // برداشتن دیسلایک
        } else if (current === true) {
          Likes -= 1;
          Dislikes += 1; // از لایک به دیسلایک
        } else {
          Dislikes += 1; // دیسلایک جدید
        }

        return { ...r, Likes, Dislikes };
      })
    );
  } catch (e) {
    console.error("handleDislikeToggle error", e);
  }
};






  
  

  const toggleSortOption = (option) =>
    setSortOptions((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );

  const finalReports = [...reports]
  .filter((r) => {
    const reportDate = new DateObject({ date: new Date(r.DateTime), calendar: persian, locale: persian_fa });
    const fromDateObj = dateFrom ? new DateObject(dateFrom).set({ hour: 0, minute: 0, second: 0 }) : null;
    const toDateObj = dateTo ? new DateObject(dateTo).set({ hour: 23, minute: 59, second: 59 }) : null;

    return (
      (selectedType === "" || translateType(r.Type) === selectedType) &&
      (selectedProvince === "" || r.ProvinceName === selectedProvince) &&
      (selectedCity === "" || r.CityName === selectedCity) &&
      (selectedStatus === "" || translateStatus(r.Status) === selectedStatus) &&
      (searchQuery === "" || r.Information.includes(searchQuery) || r.ReporterName.includes(searchQuery)) &&
      (!fromDateObj || reportDate >= fromDateObj) &&
      (!toDateObj || reportDate <= toDateObj)
    );
  })
  .sort((a, b) => {
    for (let option of sortOptions) {
      if (option === "priority") {
        const priorityOrder = { High: 1, Medium: 2, Low: 3 };
        const diff = (priorityOrder[a.Priority] || 4) - (priorityOrder[b.Priority] || 4);
        if (diff !== 0) return diff;
      } else if (option === "likes") {
        const diff = (b.Likes || 0) - (a.Likes || 0);
        if (diff !== 0) return diff;
      } else if (option === "dislikes") {
        const diff = (b.Dislikes || 0) - (a.Dislikes || 0);
        if (diff !== 0) return diff;
      } else if (option === "date") {
        const diff = new Date(b.DateTime) - new Date(a.DateTime);
        if (diff !== 0) return diff;
      }
    }
    return 0; 
  });


  const breakpointColumns = { default: 2, 960: 2, 600: 1 };


  const getStatusProps = (status) => {
    switch (status) {
      case "PendingReview":
      case "در انتظار بررسی":
        return {
          label: "در انتظار بررسی",
          icon: <HourglassBottomIcon sx={{ fontSize: 18 }} />,
          color: "#ffb300",
        };
      case "UnderConsideration":
      case "در حال رسیدگی":
        return {
          label: "در حال رسیدگی",
          icon: <BuildIcon sx={{ fontSize: 18 }} />,
          color: "#039be5",
        };
      case "IssueResolved":
      case "حل‌شده":
        return {
          label: "حل‌شده",
          icon: <CheckCircleIcon sx={{ fontSize: 18 }} />,
          color: "#43a047",
        };
      default:
        return { label: status, icon: null, color: "#ccc" };
    }
  };




  

  return (
    <Box textAlign="center">
      <Typography
        variant="h4"
        gutterBottom
        color="green"
        fontSize={{ xs: "1.8rem", sm: "2.5rem" }}
      >
    گزارش‌های ثبت شده دارای تخلف
      </Typography>

      <Box display="flex" justifyContent="center" gap={2} mb={2} flexWrap="wrap">
  <Button
    variant="contained"
    startIcon={<FilterAltIcon sx={{ ml: 0.5, fontSize: 20 }} />}
    onClick={() => setShowFilters((p) => !p)}
    sx={{
      backgroundColor: "green",
      "&:hover": { backgroundColor: "#2e7d32" },
      borderRadius: 2,
      fontSize: { xs: "0.8rem", sm: "1.1rem" },
      px: 2.5,
      py: 1,
      minWidth: 130,
    }}
  >
    فیلتر گزارشات
  </Button>

  <Button
    variant="contained"
    startIcon={<SortIcon sx={{ ml: 0.9, fontSize: 20 }} />}
    onClick={(e) => setSortAnchorEl(e.currentTarget)}
    sx={{
      backgroundColor: "green",
      "&:hover": { backgroundColor: "#2e7d32" },
      borderRadius: 2,
      fontSize: { xs: "0.8rem", sm: "1.1rem" },
      px: 2.5,
      py: 1,
      minWidth: 130,
    }}
  >
    مرتب‌سازی
  </Button>
</Box>


      <Collapse in={showFilters}>
      <Box
  bgcolor="#fff"
  p={2}
  borderRadius={3}
  boxShadow={2}
  display="grid"
  gap={2}
  alignItems="center"
  mb={4}
  sx={{
    gridTemplateColumns: {
      xs: "1fr",       
      sm: "repeat(2, 1fr)", 
      md: "repeat(3, 1fr)", 
      lg: "repeat(4, 1fr)", 
    },
    maxWidth: "1300px",
    mx: "auto",
  }}
>

          <TextField
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو..."
            sx={{ minWidth: 230 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
<FormControl size="small"  sx={{
    minWidth: 150,
    direction: 'rtl',
    '& label': {
      right: 30,
      left: 'auto',
      transformOrigin: 'top right',
    },
    '& .MuiInputLabel-shrink': {
      right: 27,
      left: 'auto',
    },
    '& .MuiSelect-select': {
      textAlign: 'right',
    },
    '& legend': {
      textAlign: 'right',
    },
    '& .MuiSelect-icon': {
      left: 8,
      right: 'auto',
    }
  }}>
            <InputLabel>نوع</InputLabel>
            <Select
              value={selectedType}
              label="نوع"
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <MenuItem value="">همه</MenuItem>
              {["خیابان", "روشنایی", "زباله", "سایر"].map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </Select>
          </FormControl>



          <FormControl size="small" sx={{
    minWidth: 150,
    direction: 'rtl',
    '& label': {
      right: 30,
      left: 'auto',
      transformOrigin: 'top right',
    },
    '& .MuiInputLabel-shrink': {
      right: 27,
      left: 'auto',
    },
    '& .MuiSelect-select': {
      textAlign: 'right',
    },
    '& legend': {
      textAlign: 'right',
    },
    '& .MuiSelect-icon': {
      left: 8,
      right: 'auto',
    }
  }}>
  <InputLabel>استان</InputLabel>
  <Select
    value={selectedProvince}
    label="استان"
    onChange={(e) => {
      setSelectedProvince(e.target.value);
      setSelectedCity(""); 
    }}
  >
    <MenuItem value="">همه</MenuItem>
    {provinces.map((p) => (
      <MenuItem key={p} value={p}>
        {p}
      </MenuItem>
    ))}
  </Select>
</FormControl>


<FormControl size="small" sx={{
    minWidth: 150,
    direction: 'rtl',
    '& label': {
      right: 30,
      left: 'auto',
      transformOrigin: 'top right',
    },
    '& .MuiInputLabel-shrink': {
      right: 27,
      left: 'auto',
    },
    '& .MuiSelect-select': {
      textAlign: 'right',
    },
    '& legend': {
      textAlign: 'right',
    },
    '& .MuiSelect-icon': {
      left: 8,
      right: 'auto',
    }
  }}>
  <InputLabel>شهر</InputLabel>
  <Select
    value={selectedCity}
    label="شهر"
    onChange={(e) => setSelectedCity(e.target.value)}
  >
    <MenuItem value="">همه</MenuItem>
    {cities.map((c) => (
      <MenuItem key={c} value={c}>
        {c}
      </MenuItem>
    ))}
  </Select>
</FormControl>


<FormControl size="small" sx={{
    minWidth: 150,
    direction: 'rtl',
    '& label': {
      right: 30,
      left: 'auto',
      transformOrigin: 'top right',
    },
    '& .MuiInputLabel-shrink': {
      right: 27,
      left: 'auto',
    },
    '& .MuiSelect-select': {
      textAlign: 'right',
    },
    '& legend': {
      textAlign: 'right',
    },
    '& .MuiSelect-icon': {
      left: 8,
      right: 'auto',
    }
  }}>
            <InputLabel>وضعیت</InputLabel>
            <Select
              value={selectedStatus}
              label="وضعیت"
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <MenuItem value="">همه</MenuItem>
              <MenuItem value="در انتظار بررسی">در انتظار بررسی</MenuItem>
              <MenuItem value="در حال رسیدگی">در حال رسیدگی</MenuItem>
              <MenuItem value="حل‌شده">حل‌شده</MenuItem>
            </Select>
          </FormControl>


          <Box>
  <Typography variant="caption" fontWeight={500} mb={0.5} display="block">
    از تاریخ
  </Typography>
  <DatePicker
    value={dateFrom}
    onChange={setDateFrom}
    calendar={persian}
    locale={persian_fa}
    calendarPosition="bottom-right"
    style={{
      height: 38,
      width: 130,
      borderRadius: 6,
      border: "1px solid #ccc",
      padding: "0 8px",
      fontFamily: "inherit",
      fontSize: "0.85rem",
    }}
  />
</Box>

<Box>
  <Typography variant="caption" fontWeight={500} mb={0.5} display="block">
    تا تاریخ
  </Typography>
  <DatePicker
    value={dateTo}
    onChange={setDateTo}
    calendar={persian}
    locale={persian_fa}
    calendarPosition="bottom-right"
    style={{
      height: 38,
      width: 130,
      borderRadius: 6,
      border: "1px solid #ccc",
      padding: "0 8px",
      fontFamily: "inherit",
      fontSize: "0.85rem",
    }}
  />
</Box>


          <Button
            variant="outlined"
            color="error"
            size="small"
            startIcon={<ClearAllIcon  sx={{ ml: 0.5 }} /> }
            onClick={() => {
              setSearchQuery("");
              setSelectedType("");
              setSelectedProvince("");
              setSelectedCity("");
              setSelectedStatus("");
              setDateFrom("");
              setDateTo("");
            }}
          >
            بازنشانی
          </Button>
        </Box>
      </Collapse>

      <Menu
  anchorEl={sortAnchorEl}
  open={Boolean(sortAnchorEl)}
  onClose={() => setSortAnchorEl(null)}
  anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
  transformOrigin={{ vertical: "top", horizontal: "left" }}
  sx={{ direction: "rtl" }}
>
  {[
    { key: "likes", label: "بر اساس تأیید" },
    { key: "dislikes", label: "بر اساس عدم تأیید" },
    { key: "date", label: "بر اساس تاریخ" },
  ].map(({ key, label }) => (
    <MenuItem
      key={key}
      onClick={() => toggleSortOption(key)}
      sx={{ display: "flex", justifyContent: "space-between", textAlign: "right" }}
    >
      <Typography
        variant="body2"
        sx={{ fontWeight: sortOptions.includes(key) ? "bold" : "normal" }}
      >
        {label}
      </Typography>
      {sortOptions.includes(key) && (
        <CheckCircleIcon fontSize="small" sx={{ color: "green", ml: 1 }} />
      )}
    </MenuItem>
  ))}

  <MenuItem
    onClick={() => setSortOptions([])}
    sx={{
      color: "red",
      fontWeight: "bold",
      justifyContent: "flex-start",
      display: "flex",
      textAlign: "right",
      gap: 1,
    }}
  >
    <ClearAllIcon fontSize="small" />
    بازنشانی مرتب‌سازی
  </MenuItem>
</Menu>


      <Dialog
      open={dialogOpen}
      onClose={() => setDialogOpen(false)}
      maxWidth="lg"
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.3)",
          border: "1px solid rgba(0, 204, 136, 0.3)",
          background: "transparent", 
        },
        "& .MuiDialogContent-root": {
          bgcolor: "rgba(255, 255, 255, 0.9)", 
          backdropFilter: "blur(8px)", 
          borderRadius: 3,
        },
      }}
    >
      <DialogContent
  sx={{
    p: 0,
    m: 0,
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    maxHeight: "90vh",
    backgroundColor: "transparent",
  }}
>
  <IconButton
    onClick={() => setDialogOpen(false)}
    sx={{
      position: "absolute",
      top: 12,
      right: 12,
      bgcolor: "#00cc88",
      color: "#ffffff",
      border: "2px solid #ffffff",
      borderRadius: "50%",
      width: 40,
      height: 40,
      transition: "all 0.3s ease-in-out",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
      zIndex: 1,
      "&:hover": {
        bgcolor: "rgba(0, 204, 136, 0.8)",
        color: "#ffffff",
        borderColor: "#e0e0e0",
        transform: "rotate(90deg)",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
      },
    }}
  >
    <CloseIcon fontSize="medium" />
  </IconButton>

  <Box
    component="img"
    src={dialogImage}
    alt="تصویر گزارش"
    sx={{
      display: "block",
      maxWidth: "100%",
      maxHeight: "90vh",
      width: "auto",
      height: "auto",
      objectFit: "contain",
      borderRadius: 2,
    }}
  />
</DialogContent>

    </Dialog>

      <Masonry
      breakpointCols={breakpointColumns}
      className="my-masonry-grid"
      columnClassName="my-masonry-grid_column"
    >
      {finalReports.map((r) => {
        const statusProps = getStatusProps(r.Status);

        return (
          <Box
          key={r.id}
          bgcolor="#fff"
          borderRadius={3}
          overflow="hidden"
          boxShadow="0 4px 12px rgba(0,0,0,0.1)"
          sx={{
            transition: "all 0.3s ease-in-out",
            "&:hover": {
              boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
              transform: "translateY(-4px)",
            },
          }}
          textAlign="right"
          position="relative"
        >
       <Box
  display="flex"
  justifyContent="space-between"
  flexDirection={{ xs: "column", sm: "row" }}
  gap={1}
  px={2}
  pt={2}
>

  <Box display="flex" alignItems="center" gap={1}>
    {r.ReporterPicture ? (
      <Box
        component="img"
        src={`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}${r.ReporterPicture}`}
        alt="reporter"
        sx={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          objectFit: "cover",
          border: "2px solid #00cc88",
        }}
      />
    ) : (
      <PersonIcon fontSize="large" sx={{ color: "#00cc88" }} />
    )}
    <Typography variant="subtitle2" fontWeight={600}>
      {r.ReporterName || "نامشخص"}
    </Typography>
  </Box>

  <Box
    display="flex"
    alignItems="center"
    gap={0.5}
    sx={{ mt: { xs: 0.5, sm: 0 } }}
  >
    <CalendarTodayIcon sx={{ fontSize: 18, color: "#00cc88" }} />
    <Typography variant="caption" sx={{ fontWeight: 500, color: "#555" }}>
      {new DateObject({
        date: new Date(r.DateTime),
        calendar: persian,
        locale: persian_fa,
      }).format("dddd، YYYY/MM/DD - HH:mm")}
    </Typography>
  </Box>
</Box>



<Box mt={1} />

        
          {r.Picture && (
            <Box
              component="img"
              src={`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}${r.Picture}`}
              alt=""
              sx={{
                width: "100%",
                height: { xs: 180, sm: 200, md: 220 },
                objectFit: "cover",
                borderBottom: "3px solid #00cc88",
                cursor: "pointer",
              }}
              onClick={() => {
                setDialogImage(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}${r.Picture}`);
                setDialogOpen(true);
              }}
            />
          )}
        
          <Box p={2}>
     
<Box
  display="flex"
  alignItems="center"
  justifyContent="space-between"
  flexWrap="wrap"
  gap={1}
  mb={1.5}
>
  <Box display="flex" gap={1} flexWrap="wrap">
    <Chip
      label={translateType(r.Type)}
      size="small"
      sx={{
        bgcolor: "#e8f5e9",
        color: "#2e7d32",
        fontWeight: 600,
        borderRadius: 1,
      }}
    />
    <Chip
      label={getStatusProps(r.Status).label}
      icon={getStatusProps(r.Status).icon}
      size="small"
      sx={{
        bgcolor: `${getStatusProps(r.Status).color}22`,
        color: getStatusProps(r.Status).color,
        fontWeight: 600,
        borderRadius: 1,
        px: 1,
      }}
    />
  </Box>

  <Box display="flex" alignItems="center" gap={0.5}>
  <IconButton
  size="small"
  onClick={() => handleDislikeToggle(r.id, userLikeStatusMap[r.id])}
  color={userLikeStatusMap[r.id] === false ? "error" : "default"}
>
  <ThumbDownAltIcon fontSize="small" />
</IconButton>
<Typography variant="body2" color="text.secondary">
  {toPersianDigits(r.Dislikes || 0)}
</Typography>

<IconButton
  size="small"
  onClick={() => handleLikeToggle(r.id, userLikeStatusMap[r.id])}
  color={userLikeStatusMap[r.id] === true ? "success" : "default"}
>
  <ThumbUpAltIcon fontSize="small" />
</IconButton>
<Typography variant="body2" color="text.secondary">
  {toPersianDigits(r.Likes || 0)}
</Typography>







  </Box>
</Box>

        
            <Typography
              variant="body2"
              fontWeight={600}
              mb={1.5}
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {r.Information}
            </Typography>
           {r.Reports?.length > 0 && (
  <Box
  mt={2}
  p={2}
  border="1px solid #ffcdd2"
  borderRadius={2}
  bgcolor="#ffebee"
  boxShadow="0 2px 6px rgba(244, 67, 54, 0.2)"
>
<Typography
  variant="subtitle2"
  fontWeight="bold"
  color="error.main"
  mb={1}
  display="flex"
  alignItems="center"
  gap={1}
>
  <ReportIcon fontSize="small" />
  {`دلایل گزارش تخلف (${toPersianDigits(r.Reports.length)} مورد)`}
</Typography>


  <Box component="ul" sx={{ pr: 3, m: 0 }}>
    {r.Reports.map((rep, index) => (
      <Box
        key={index}
        component="li"
        sx={{
          fontSize: "0.95rem",
          color: "#c62828",
          mb: 1,
          lineHeight: 1.8,
          listStyleType: "'⚠️  '",
        }}
      >
        {rep}
      </Box>
    ))}
  </Box>
</Box>

)}



            
        
            <Box
  display="flex"
  flexDirection="column"
  alignItems="flex-start"
  gap={0.5}
  mt={1}
  sx={{ px: 2, textAlign: "right" }}
>
  <Box display="flex" alignItems="center" gap={0.5}>
    <LocationOnIcon fontSize="small" sx={{ color: "#00cc88" }} />
    <Typography variant="caption" color="text.secondary" fontWeight={600}>
      {r.ProvinceName}، {r.CityName}
    </Typography>
  </Box>

  {r.FullAdress && (
    <Box display="flex" alignItems="center" gap={0.5}       sx={{ mb: 2 }}  >

      <ArrowForwardIosIcon fontSize="inherit" sx={{ color: "#999", fontSize: 14 }} />
      <Typography variant="caption" color="text.secondary">
        {r.FullAdress}
      </Typography>
    </Box>
  )}
</Box> 
            <Button
              variant="contained"
              href={`/reports/${r.id}`}
              fullWidth
              sx={{
                backdropFilter: "blur(10px)",
                background: "linear-gradient(135deg, #1a3c34 0%, #00cc88 100%)",
                border: "2px solid #00cc88",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "1rem",
                borderRadius: "12px",
                py: 1.2,
                boxShadow: "0 6px 15px rgba(0, 204, 136, 0.3)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  background: "linear-gradient(135deg, #00cc88 0%, #1a3c34 100%)",
                  borderColor: "#ffffff",
                  boxShadow: "0 8px 20px rgba(0, 204, 136, 0.5)",
                  transform: "scale(1.02)",
                },
                "&:active": {
                  transform: "scale(0.98)",
                  boxShadow: "0 4px 10px rgba(0, 204, 136, 0.2)",
                },
              }}
            >
              مشاهده گزارش
            </Button>
          <Button
  variant="contained"
  onClick={() => {
    setReportToDelete(r.id);
    setDeleteDialogOpen(true);
  }}
  fullWidth
  startIcon={<DeleteIcon sx={{ fontSize: "1.2rem", ml: 0.5 }} />}
  sx={{
    mt: 1.5,
    borderRadius: "12px",
    fontWeight: 700,
    fontSize: "1rem",
    py: 1.2,
    backdropFilter: "blur(10px)",
    background: "linear-gradient(135deg, #fff5f5 0%, #ffebee 100%)", // سفید به صورتی خیلی کمرنگ
    border: "2px solid #ffcdd2",
    color: "#c62828", // قرمز ملایم برای متن
    boxShadow: "0 4px 10px rgba(244, 67, 54, 0.1)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
      background: "linear-gradient(135deg, #ef5350 0%, #7f1d1d 100%)", // قرمز تند
      borderColor: "#ffffff",
      color: "#fff",
      boxShadow: "0 8px 20px rgba(239, 83, 80, 0.5)",
      transform: "scale(1.02)",
    },
    "&:active": {
      transform: "scale(0.98)",
      boxShadow: "0 4px 10px rgba(239, 83, 80, 0.2)",
    },
    "&:focus": {
      outline: "none",
      boxShadow: "0 0 0 4px rgba(239, 83, 80, 0.2)",
    },
    textTransform: "none",
  }}
>
  حذف گزارش
</Button>
<Button
  variant="contained"
  onClick={() => {
    setReportToUnmark(r.id);
    setUnmarkDialogOpen(true);
  }}
  fullWidth
  startIcon={<BuildIcon sx={{ fontSize: "1.2rem", ml: 1 }} />}

  sx={{
    mt: 1.5,
    borderRadius: "12px",
    fontWeight: 700,
    fontSize: "1rem",
    py: 1.2,
    backdropFilter: "blur(10px)",
    background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
    border: "2px solid #90caf9",
    color: "#0d47a1",
    boxShadow: "0 4px 10px rgba(30, 136, 229, 0.1)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
      background: "linear-gradient(135deg, #2196f3 0%, #0d47a1 100%)",
      borderColor: "#ffffff",
      color: "#fff",
      boxShadow: "0 8px 20px rgba(33, 150, 243, 0.5)",
      transform: "scale(1.02)",
    },
    "&:active": {
      transform: "scale(0.98)",
      boxShadow: "0 4px 10px rgba(33, 150, 243, 0.2)",
    },
    "&:focus": {
      outline: "none",
      boxShadow: "0 0 0 4px rgba(33, 150, 243, 0.2)",
    },
    textTransform: "none",
  }}
>
  رفع وضعیت تخلف
</Button>








            

            

          </Box>
        </Box>
        
        );
      })}
    </Masonry>

    <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
  <DialogTitle sx={{ textAlign: "center", fontWeight: 700 }}>
    حذف گزارش
  </DialogTitle>
  <DialogContent>
    <Typography sx={{ mb: 2, textAlign: "center" }}>
      آیا مطمئن هستید که می‌خواهید این گزارش را از سامانه حذف کنید؟
    </Typography>
    <Box display="flex" justifyContent="center" gap={2} mt={2}>
      <Button onClick={() => setDeleteDialogOpen(false)} variant="outlined">
        انصراف
      </Button>
      <Button onClick={handleDeleteReport} color="error" variant="contained">
        حذف گزارش
      </Button>
    </Box>
  </DialogContent>
</Dialog>
<Dialog open={unmarkDialogOpen} onClose={() => setUnmarkDialogOpen(false)}>
  <DialogTitle sx={{ textAlign: "center", fontWeight: 700 }}>
    رفع وضعیت تخلف
  </DialogTitle>
  <DialogContent>
    <Typography sx={{ mb: 2, textAlign: "center" }}>
      آیا مطمئن هستید که می‌خواهید این گزارش را از لیست متخلفین خارج کنید؟
    </Typography>
    <Box display="flex" justifyContent="center" gap={2} mt={2}>
      <Button onClick={() => setUnmarkDialogOpen(false)} variant="outlined">
        انصراف
      </Button>
      <Button
        onClick={() => {
          handleUnmarkViolation(reportToUnmark);
          setUnmarkDialogOpen(false);
          setReportToUnmark(null);
        }}
        color="info"
        variant="contained"
      >
        تأیید
      </Button>
    </Box>
  </DialogContent>
</Dialog>


    <style>
    {`
      @font-face {
  font-family: 'Vazir';
  src: url('/fonts/Vazir.woff2') format('woff2');
  font-display: swap;
}

.form-group {
  position: relative;
  margin: 20px 0;
  direction: rtl;
  text-align: right;
  font-family: 'Vazir', sans-serif;
}

.form-group select {
  width: 100%;
  padding: 14px 10px 6px 10px;
  font-size: 15px;
  border: 1px solid #ccc;
  border-radius: 6px;
  outline: none;
  background: white;
  text-align: right;
  font-family: inherit;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml;utf8,<svg fill='gray' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>");
  background-repeat: no-repeat;
  background-position: left 10px center;
  background-size: 16px;
}

.form-group label {
  position: absolute;
  right: 10px;
  top: 12px;
  background: #fff;
  padding: 0 4px;
  font-size: 15px;
  color: #888;
  pointer-events: none;
  transition: 0.2s ease all;
  font-family: inherit;
}

.form-group select:focus + label,
.form-group.filled select + label {
  top: -8px;
  font-size: 13px;
  color: #007E33;
}

    `}
  </style>


    </Box>
  );
};

export default ViolationReportFeed;
