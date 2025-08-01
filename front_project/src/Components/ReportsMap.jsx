import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  TextField,
  Collapse,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import NeshanMap from "react-neshan-map-leaflet";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import SearchIcon from "@mui/icons-material/Search";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DateObject from "react-date-object";

const MAP_API_KEY = "web.2705e42e6fd74f8796b16a52b4a0b2aa";

const getMarkerIcon = (L, priority) => {
  let color = "blue";
  if (priority === "High") color = "red";
  else if (priority === "Medium") color = "orange";
  else if (priority === "Low") color = "green";

  return L.icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
};

export default function ReportsMap() {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");


  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const LRef = useRef(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/supervise/mayor-prioritize/`, {
          credentials: "include",
        });

        if (response.status === 429) {
          window.location.href = "/429";
          return;
          }
          
        if (!response.ok) {
          throw new Error("Failed to fetch reports");
        }
        const data = await response.json();
        setReports(data);
        setFilteredReports(data);
      } catch (error) {
        console.error("Error fetching reports:", error);
        setError("مشکلی در دریافت گزارشات پیش آمد.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const uniqueProvinces = [...new Set(reports.map((r) => r.ProvinceName))];
  const uniqueCities = [...new Set(reports.map((r) => r.CityName))];

  const createMarkers = (filtered) => {
    if (!mapRef.current || !LRef.current) return;
    markersRef.current.forEach((marker) => mapRef.current.removeLayer(marker));
    markersRef.current = [];

    filtered.forEach((report) => {
      if (report.Latitude && report.Longitude) {
        const icon = getMarkerIcon(LRef.current, report.Priority);
        const marker = LRef.current
          .marker([report.Latitude, report.Longitude], { icon })
          .addTo(mapRef.current)
          .bindPopup(`
            <div style="text-align: center; max-width: 220px; font-family: Vazir, sans-serif; border: 2px solid #4caf50; background-color: #e8f5e9; border-radius: 12px; padding: 12px;">
              ${
                report.Picture
                  ? `<img src="${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}${report.Picture}" 
                      alt="تصویر گزارش" style="width: 100%; height: auto; border-radius: 8px; margin-bottom: 8px;" />`
                  : ""
              }
              <div style="margin-bottom: 8px;"><b>مشکل:</b> ${report.Information}</div>
              <div style="margin-bottom: 8px;"><b>آدرس:</b> ${report.FullAdress || "آدرس نامشخص"}</div>
              <div style="margin-bottom: 8px;"><b>تاریخ:</b> ${new Date(report.DateTime).toLocaleDateString("fa-IR")}</div>
              <button id="btn-${report.id}" 
                style="margin-top: 10px; padding: 8px 16px; background: #4caf50; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; font-family: Vazir, sans-serif;">
                مشاهده گزارش
              </button>
            </div>
          `);

        marker.on("popupopen", () => {
          const button = document.getElementById(`btn-${report.id}`);
          if (button) {
            button.onclick = () => {
              window.open(`/reports/${report.id}`, "_blank");
            };
          }
        });

        markersRef.current.push(marker);
      }
    });
  };

  useEffect(() => {
    if (mapRef.current) {
      createMarkers(filteredReports);
    }
  }, [filteredReports]);
  

  const filterReports = () => {
    const fromDateObj = dateFrom
      ? new DateObject(dateFrom).set({ hour: 0, minute: 0, second: 0 })
      : null;
  
    const toDateObj = dateTo
      ? new DateObject(dateTo).set({ hour: 23, minute: 59, second: 59 })
      : null;
  
      const filtered = reports.filter((r) => {
        const reportDate = new DateObject({
          date: new Date(r.DateTime),
          calendar: persian,
          locale: persian_fa,
        });
      
        return (
          (selectedType === "" || r.Type === selectedType) &&
          (selectedProvince === "" || r.ProvinceName === selectedProvince) &&
          (selectedCity === "" || r.CityName === selectedCity) &&
          (selectedPriority === "" || r.Priority === selectedPriority) &&
          (selectedStatus === "" || r.Status === selectedStatus) &&    
          (searchQuery === "" ||
            r.Information.includes(searchQuery) ||
            r.ReporterName.includes(searchQuery)) &&
          (!fromDateObj || reportDate >= fromDateObj) &&
          (!toDateObj || reportDate <= toDateObj)
        );
      });
      
  
    setFilteredReports(filtered);
  };
  

  useEffect(() => {
    filterReports();
  }, [searchQuery, selectedType, selectedProvince, selectedCity, selectedPriority, selectedStatus, dateFrom, dateTo, reports]);
  

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedType("");
    setSelectedProvince("");
    setSelectedCity("");
    setSelectedPriority("");
    setSelectedStatus("");   
    setDateFrom(null);
    setDateTo(null);
    setFilteredReports(reports);
  };
  

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", height: "auto", textAlign: "center", pb: 4 }}>
      <Button
        variant="contained"
        startIcon={<FilterAltIcon sx={{ ml: 0.5 }} />}
        onClick={() => setShowFilters((prev) => !prev)}
        sx={{ mt: -3, mb: 2, backgroundColor: "green", "&:hover": { backgroundColor: "#2e7d32" } }}
      >
        فیلتر گزارشات
      </Button>

      <Collapse in={showFilters}>
        <Box
          sx={{
            backgroundColor: "#fff",
            p: 2,
            borderRadius: 3,
            boxShadow: 2,
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            justifyContent: "center",
            mb: 4,
          }}
        >
          <TextField
  label="جستجو"
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  size="small"
  sx={{
    direction: 'rtl',
    '& input': {
      textAlign: 'right',
    },
    '& label': {
      right: 30,
      left: 'auto',
      transformOrigin: 'top right',
    },
    '& .MuiInputLabel-shrink': {
      right: 26,
      left: 'auto',
      transformOrigin: 'top right',
    },
    '& legend': {
      textAlign: 'right',
    },
    '& .MuiOutlinedInput-root': {
      justifyContent: 'flex-end',
    },
  }}
  InputProps={{
    startAdornment: (
      <SearchIcon sx={{ ml: 1, mr: 0, color: 'gray' }} />
    ),
  }}
  InputLabelProps={{ sx: { direction: 'rtl' } }}
/>


        <FormControl size="small" sx={{
  minWidth: 200,
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
  <InputLabel>نوع گزارش</InputLabel>
  <Select
    value={selectedType}
    onChange={(e) => setSelectedType(e.target.value)}
    label="نوع گزارش"
    MenuProps={{
      PaperProps: {
        sx: {
          direction: 'rtl',
          textAlign: 'right',
        }
      }
    }}
  >
    <MenuItem value="" sx={{ textAlign: 'right' }}>همه</MenuItem>
    <MenuItem value="Street" sx={{ textAlign: 'right' }}>خرابی خیابان</MenuItem>
    <MenuItem value="Lighting" sx={{ textAlign: 'right' }}>مشکل روشنایی</MenuItem>
    <MenuItem value="Garbage" sx={{ textAlign: 'right' }}>زباله رها شده</MenuItem>
    <MenuItem value="Others" sx={{ textAlign: 'right' }}>سایر</MenuItem>
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
    onChange={(e) => setSelectedProvince(e.target.value)}
    label="استان"
    MenuProps={{
      PaperProps: {
        sx: {
          direction: 'rtl',
          textAlign: 'right',
        },
      },
    }}
  >
    <MenuItem value="" sx={{ textAlign: 'right' }}>همه</MenuItem>
    {uniqueProvinces.map((province) => (
      <MenuItem key={province} value={province} sx={{ textAlign: 'right' }}>
        {province}
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
    onChange={(e) => setSelectedCity(e.target.value)}
    label="شهر"
    MenuProps={{
      PaperProps: {
        sx: {
          direction: 'rtl',
          textAlign: 'right',
        },
      },
    }}
  >
    <MenuItem value="" sx={{ textAlign: 'right' }}>همه</MenuItem>
    {uniqueCities.map((city) => (
      <MenuItem key={city} value={city} sx={{ textAlign: 'right' }}>
        {city}
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
  <InputLabel>اهمیت</InputLabel>
  <Select
    value={selectedPriority}
    onChange={(e) => setSelectedPriority(e.target.value)}
    label="اهمیت"
    MenuProps={{
      PaperProps: {
        sx: {
          direction: 'rtl',
          textAlign: 'right',
        },
      },
    }}
  >
    <MenuItem value="" sx={{ textAlign: 'right' }}>همه</MenuItem>
    <MenuItem value="High" sx={{ textAlign: 'right' }}>زیاد</MenuItem>
    <MenuItem value="Medium" sx={{ textAlign: 'right' }}>متوسط</MenuItem>
    <MenuItem value="Low" sx={{ textAlign: 'right' }}>کم</MenuItem>
  </Select>
</FormControl>

         <FormControl size="small" sx={{
  minWidth: 200,
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
  <InputLabel>وضعیت گزارش</InputLabel>
  <Select
    value={selectedStatus}
    onChange={(e) => setSelectedStatus(e.target.value)}
    label="وضعیت گزارش"
    MenuProps={{
      PaperProps: {
        sx: {
          direction: 'rtl',
          textAlign: 'right',
        },
      },
    }}
  >
    <MenuItem value="" sx={{ textAlign: 'right' }}>همه</MenuItem>
    <MenuItem value="PendingReview" sx={{ textAlign: 'right' }}>در انتظار بررسی</MenuItem>
    <MenuItem value="UnderConsideration" sx={{ textAlign: 'right' }}>در حال رسیدگی</MenuItem>
    <MenuItem value="IssueResolved" sx={{ textAlign: 'right' }}>حل‌شده</MenuItem>
  </Select>
</FormControl>



          <DatePicker
            value={dateFrom}
            onChange={setDateFrom}
            calendar={persian}
            locale={persian_fa}
            calendarPosition="bottom-right"
            portal
            placeholder="از تاریخ"
            style={{
              height: "40px",
              width: "140px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              padding: "0 10px",
            }}
            inputClass="custom-datepicker"

          />

          <DatePicker
            value={dateTo}
            onChange={setDateTo}
            calendar={persian}
            locale={persian_fa}
            calendarPosition="bottom-right"
            placeholder="تا تاریخ"
            style={{
              height: "40px",
              width: "140px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              padding: "0 10px",
            }}
            inputClass="custom-datepicker"

          />

          <Button variant="outlined" color="error" size="small" startIcon={<ClearAllIcon />} onClick={resetFilters}>
            بازنشانی
          </Button>
        </Box>
      </Collapse>

      <Box sx={{ width: "100%", height: "700px", position: "relative", zIndex: 0 }}>
        <NeshanMap
          style={{ width: "100%", height: "100%" }}
          options={{
            key: MAP_API_KEY,
            center: [35.699739, 51.338097],
            zoom: 6,
          }}
          onInit={(L, myMap) => {
            mapRef.current = myMap;
            LRef.current = L;
            createMarkers(filteredReports);
          }}
        />
      </Box>
    </Box>
  );
}
