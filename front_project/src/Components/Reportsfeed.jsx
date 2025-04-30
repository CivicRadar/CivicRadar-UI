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

const ReportFeed = () => {
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

  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/supervise/all-citizen-report/`
    )
      .then((res) => res.json())
      .then((data) => {
        setReports(data);
  
        const uniqueProvinces = [
          ...new Set(data.map((r) => r.ProvinceName).filter(Boolean)),
        ];
        setProvinces(uniqueProvinces);
      });
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
        گزارشات دریافتی
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

          <FormControl size="small" sx={{ minWidth: 150 }}>
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

          <FormControl size="small" sx={{ minWidth: 150 }}>
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

          <FormControl size="small" sx={{ minWidth: 150 }}>
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

          <FormControl size="small" sx={{ minWidth: 160 }}>
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
      >
        {[
          { key: "likes", label: "بر اساس تأیید" },
          { key: "dislikes", label: "بر اساس عدم تأیید" },
          { key: "date", label: "بر اساس تاریخ" },
        ].map(({ key, label }) => (
          <MenuItem key={key} onClick={() => toggleSortOption(key)}>
            <Box display="flex" justifyContent="space-between" width="100%">
              {label}
              {sortOptions.includes(key) && (
                <CheckCircleIcon fontSize="small" sx={{ color: "green" }} />
              )}
            </Box>
          </MenuItem>
        ))}
        <MenuItem
          onClick={() => setSortOptions([])}
          sx={{ color: "red", fontWeight: "bold", justifyContent: "center" }}
        >
          🔄 بازنشانی مرتب‌سازی
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
    <IconButton size="small">
      <ThumbDownAltIcon fontSize="small" sx={{ color: "#c62828" }} />
    </IconButton>
    <Typography variant="body2" color="text.secondary">
      {r.Dislikes || 0}
    </Typography>
    <IconButton size="small">
      <ThumbUpAltIcon fontSize="small" sx={{ color: "#2e7d32" }} />
    </IconButton>
    <Typography variant="body2" color="text.secondary">
      {r.Likes || 0}
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
              href={`/report/${r.id}`}
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
          </Box>
        </Box>
        
        );
      })}
    </Masonry>


    </Box>
  );
};

export default ReportFeed;
