import React, { useState } from 'react'
import {
  Box, Typography, TextField, FormControl, InputLabel,
  Select, MenuItem, Button, Card, CardContent, Chip,
  Collapse, Dialog, DialogContent, IconButton, Menu, DialogActions
} from '@mui/material'
import Masonry from 'react-masonry-css'
import './masonry.css' // فایل استایل که می‌سازیم
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PersonIcon from '@mui/icons-material/Person'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import SearchIcon from '@mui/icons-material/Search'
import ClearAllIcon from '@mui/icons-material/ClearAll'
import CloseIcon from '@mui/icons-material/Close'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DateObject from "react-date-object";
import { useEffect } from "react"
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Swal from 'sweetalert2';
import MapWithClickDialog from "./MapWithClickDialog"; // مسیر رو درست کن



import { DialogTitle } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';


export default function Reports() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
const [noteToDelete, setNoteToDelete] = useState(null);
const [mapOpen, setMapOpen] = useState(false);
const [selectedReportForMap, setSelectedReportForMap] = useState(null);


    const [reports, setReports] = useState([])
    const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const [selectedProvince, setSelectedProvince] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedCity, setSelectedCity] = useState("");
  const [editNoteDialogOpen, setEditNoteDialogOpen] = useState(false);
const [editNoteText, setEditNoteText] = useState("");
const [editNoteId, setEditNoteId] = useState(null);


const uniqueProvinces = [...new Set(reports.map(r => r.ProvinceName))];
const uniqueCities = [...new Set(reports.map(r => r.CityName))];

  

  // state مربوط به منو و دیالوگ‌های یادداشت و تغییر وضعیت
  const [noteAnchor, setNoteAnchor] = useState(null)
  const [selectedReport, setSelectedReport] = useState(null)

  // دیالوگ افزودن یادداشت
  const [notesDialogOpen, setNotesDialogOpen] = useState(false)
  const [noteText, setNoteText] = useState("")
  // ذخیره چندین یادداشت برای هر گزارش؛ کلید گزارش، مقدار آرایه‌ای از یادداشت‌ها
  const [internalNotes, setInternalNotes] = useState({})

  // دیالوگ نمایش یادداشت‌ها
  const [viewNotesDialogOpen, setViewNotesDialogOpen] = useState(false)

  // دیالوگ تغییر وضعیت گزارش
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [tempStatus, setTempStatus] = useState("")

  const handleEditNoteClick = (noteId, information) => {
    setEditNoteId(noteId);
    setEditNoteText(information);
    setEditNoteDialogOpen(true);
  };
  const handleSaveEditedNote = () => {
    fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/supervise/mayor-note/`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        NoteID: editNoteId,
        Information: editNoteText
      })
    })
      .then(res => {
        if (!res.ok) throw new Error("ویرایش یادداشت ناموفق بود");
        return res.json();
      })
      .then(() => {
        setEditNoteDialogOpen(false);
        setEditNoteText("");
        setEditNoteId(null);
        handleOpenViewNotesDialog(); // رفرش لیست
      })
      .catch(err => {
        console.error("خطا در ویرایش:", err);
      });
  };
  
  

  const resetFilters = () => {
    setSearchQuery("")
    setSelectedType("")
    setSelectedProvince("")
    setSelectedCity("")
    setSelectedStatus("")
    setDateFrom("")
    setDateTo("")
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "در حال رسیدگی": return "info"
      case "حل‌شده": return "success"
      default: return "warning"
    }
  }

  const updateReportStatus = (id, newStatus) => {
    setReports((prev) =>
      prev.map((report) =>
        report.id === id ? { ...report, status: newStatus } : report
      )
    )
  }

  // منو
  const handleMenuOpen = (event, report) => {
    setNoteAnchor(event.currentTarget)
    setSelectedReport(report)
  }

  const handleMenuClose = () => {
    setNoteAnchor(null)
  }

  // مدیریت افزودن یادداشت
  const handleOpenNoteDialog = () => {
    setNoteText("")
    setNotesDialogOpen(true)
    handleMenuClose()
  }

  const handleCloseNoteDialog = () => {
    setNotesDialogOpen(false)
    setNoteText("")
  }

  const handleSaveNote = () => {
    if (selectedReport && noteText.trim()) {
      fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/supervise/mayor-note/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          CityProblemID: selectedReport.id,
          Information: noteText
        })
      })
        .then(res => {
          if (!res.ok) throw new Error("خطا در ذخیره یادداشت")
          return res.json()
        })
        .then((newNote) => {
          setInternalNotes(prev => {
            const existingNotes = prev[selectedReport.id] || []
            return { ...prev, [selectedReport.id]: [...existingNotes, newNote.Information] }
          })
          handleCloseNoteDialog()
          Swal.fire({
            icon: 'success',
            title: 'یادداشت با موفقیت اضافه شد',
            confirmButtonText: 'باشه',
            customClass: {
              confirmButton: 'swal-confirm-btn',
              title: 'swal-title',
            }
          });
          
          
          
        })
        .catch(err => {
          console.error("خطا در افزودن یادداشت:", err)
        })
    }
  }
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      ['link'],
      [{ 'align': [] }],
      ['clean']
    ]
  };
  
  const formats = [
    'header', 'bold', 'italic', 'underline',
    'link',  'align'
  ];
  
  

  // مدیریت نمایش یادداشت‌ها
  const handleOpenViewNotesDialog = () => {
    if (!selectedReport) return;
  
    fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/supervise/mayor-note/?CityProblemID=${selectedReport.id}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error("خطا در دریافت یادداشت‌ها");
        return res.json();
      })
      .then((notes) => {
        const fullBaseUrl = `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}`;
      
        const noteTexts = Array.isArray(notes)
          ? notes.map((note) => ({
              id: note.id,
              Information: note.Information,
              NoteOwnerName: note.NoteOwnerName,
              NoteOwnerEmail: note.NoteOwnerEmail,
              PutDeletePermission: note.PutDeletePermission,
              NoteOwnerPicture: note.NoteOwnerPicture ? `${fullBaseUrl}${note.NoteOwnerPicture}` : null // ✅ اضافه شد
            }))
          : [];
      




  
        setInternalNotes((prev) => ({
          ...prev,
          [selectedReport.id]: noteTexts,
        }));
  
        setViewNotesDialogOpen(true);
      })
      .catch((err) => {
        console.error("خطا در دریافت یادداشت‌ها:", err);
      });
  
    handleMenuClose();
  };
  const handleDeleteClick = (noteId) => {
    setNoteToDelete(noteId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    console.log("🟡 شروع حذف یادداشت...");
  
    console.log("📌 NoteID برای حذف:", noteToDelete);
  
    fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/supervise/mayor-note/`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ NoteID: noteToDelete })
    })
      .then(res => {
        console.log("🔵 پاسخ دریافت شد، وضعیت:", res.status);
        if (!res.ok) throw new Error("خطا در حذف یادداشت");
        return res.json();
      })
      .then(data => {
        console.log("✅ یادداشت با موفقیت حذف شد:", data);
        setDeleteDialogOpen(false);
        setNoteToDelete(null);
        handleOpenViewNotesDialog(); // رفرش لیست یادداشت‌ها
      })
      .catch(err => {
        console.error("❌ خطا در عملیات حذف:", err);
      });
  };
  
  
  
  

  // const handleDeleteNote = (noteId) => {
  //   if (!window.confirm("آیا از حذف یادداشت اطمینان دارید؟")) return;
  
  //   fetch("http://127.0.0.1:8000/supervise/mayor-note/", {
  //     method: "DELETE",
  //     credentials: "include",
  //     headers: {
  //       "Content-Type": "application/json"
  //     },
  //     body: JSON.stringify({ NoteID: noteId })
  //   })
  //     .then(res => {
  //       if (!res.ok) throw new Error("حذف ناموفق بود");
  //       return res.json();
  //     })
  //     .then(() => {
  //       handleOpenViewNotesDialog(); // رفرش لیست
  //     })
  //     .catch(err => {
  //       console.error("خطا در حذف:", err);
  //     });
  // };
  
  
  
  
  

  const handleCloseViewNotesDialog = () => {
    setViewNotesDialogOpen(false)
  }

  // مدیریت تغییر وضعیت
  const handleOpenStatusDialog = () => {
    setTempStatus(selectedReport.status)
    setStatusDialogOpen(true)
    handleMenuClose()
  }

  const handleCloseStatusDialog = () => {
    setStatusDialogOpen(false)
    setTempStatus("")
  }

  const handleSaveStatus = () => {
    if (selectedReport) {
      updateReportStatus(selectedReport.id, tempStatus)
    }
    handleCloseStatusDialog()
  }
  const breakpointColumnsObj = {
    default: 2,
    960: 2,
    600: 1
  };
  const translateType = (type) => {
    switch (type) {
      case "Lighting":
      case "lighting":
        return "روشنایی"
      case "Street":
      case "street":
        return "خیابان"
      case "Garbage":
      case "garbage":
        return "زباله"
      case "Others":
      case "others":
        return "سایر"
      default:
        return type 
    }
  }
  

  const filteredReports = reports.filter((r) => {
    const reportDate = new DateObject({
        date: new Date(r.DateTime),
        calendar: persian,
        locale: persian_fa
      })

    const fromDateObj = dateFrom
      ? new DateObject(dateFrom).set({ hour: 0, minute: 0, second: 0 })
      : null
  
    const toDateObj = dateTo
      ? new DateObject(dateTo).set({ hour: 23, minute: 59, second: 59 })
      : null
  
    return (
        (selectedType === "" || translateType(r.Type) === selectedType) &&
        (selectedProvince === "" || r.ProvinceName === selectedProvince) &&
        (selectedCity === "" || r.CityName === selectedCity) &&

      (selectedStatus === "" || r.Status === selectedStatus) &&
      (searchQuery === "" ||
        r.Information.includes(searchQuery) ||
        r.ReporterName.includes(searchQuery)) &&
      (!fromDateObj || reportDate >= fromDateObj) &&
      (!toDateObj || reportDate <= toDateObj)
    )
  })

  
  
  useEffect(() => {
    const fullBaseUrl = `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}` // مسیر اصلی برای فایل‌ها
  
    fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/supervise/mayor-watch-report/`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("خطا در دریافت گزارش‌ها")
        return res.json()
      })
      .then((data) => {
        const updated = data.map((item) => ({
          ...item,
          Picture: item.Picture ? `${fullBaseUrl}/${item.Picture}` : null,
          Video: item.Video ? `${fullBaseUrl}/${item.Video}` : null,
          Status: item.Status || "در انتظار بررسی", // پیش‌فرض برای وضعیت
        }))
        setReports(updated)
      })
      .catch((err) => {
        console.error(err)
      })
  }, [])
  
  
  
  
  

  return (
    <Box  sx={{ textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom color="green" textAlign="center" fontSize={{ xs: "1.8rem", sm: "2.5rem" }}>
  گزارشات دریافتی
</Typography>


      <Button
        variant="contained"
        startIcon={<FilterAltIcon />}
        onClick={() => setShowFilters(prev => !prev)}
        sx={{
            mb: 2,
            backgroundColor: "green",
            '&:hover': { backgroundColor: "#2e7d32" },
            borderRadius: 2,
            px: { xs: 2, sm: 3 },
            py: { xs: 1, sm: 1.5 },
            fontSize: { xs: "0.8rem", sm: "1rem" }
        }}
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
            alignItems: "center",
            mb: 4
          }}
        >
          <TextField
            size="small"
            placeholder="جستجو در توضیحات یا نام گزارش‌دهنده"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: "gray", mr: 1 }} />,
            }}
            sx={{ minWidth: 220 }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>نوع گزارش</InputLabel>
            <Select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} label="نوع گزارش">
              <MenuItem value="">همه</MenuItem>
              <MenuItem value="خیابان">خرابی خیابان</MenuItem>
              <MenuItem value="روشنایی">مشکل روشنایی</MenuItem>
              <MenuItem value="زباله">زباله رها شده</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>استان</InputLabel>
            <Select value={selectedProvince} onChange={(e) => setSelectedProvince(e.target.value)} label="استان">
            <MenuItem value="">همه</MenuItem>
{uniqueProvinces.map(province => (
  <MenuItem key={province} value={province}>{province}</MenuItem>
))}

            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 150 }}>
  <InputLabel>شهر</InputLabel>
  <Select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} label="شهر">
    <MenuItem value="">همه</MenuItem>
    {uniqueCities.map(city => (
      <MenuItem key={city} value={city}>{city}</MenuItem>
    ))}
  </Select>
</FormControl>

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>وضعیت گزارش</InputLabel>
            <Select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} label="وضعیت گزارش">
              <MenuItem value="">همه</MenuItem>
              <MenuItem value="در انتظار بررسی">در انتظار بررسی</MenuItem>
              <MenuItem value="در حال رسیدگی">در حال رسیدگی</MenuItem>
              <MenuItem value="حل‌شده">حل‌شده</MenuItem>
            </Select>
          </FormControl>
          <DatePicker
    value={dateFrom}
    onChange={setDateFrom}
    calendar={persian}
    locale={persian_fa}
    calendarPosition="bottom-right"
    placeholder="از تاریخ"
    style={{
      height: "40px",
      width: "150px",
      borderRadius: "5px",
      border: "1px solid #ccc",
      padding: "0 10px",
    }}
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
      width: "150px",
      borderRadius: "5px",
      border: "1px solid #ccc",
      padding: "0 10px",
    }}
  />

          <Button variant="outlined" color="error" size="small" onClick={resetFilters} startIcon={<ClearAllIcon />}>
            ریست
          </Button>
        </Box>
      </Collapse>

      {/* Masonry Layout */}
      <Masonry
  breakpointCols={breakpointColumnsObj}
  className="my-masonry-grid"
  columnClassName="my-masonry-grid_column"
>
  {filteredReports.map((report) => (
    <Card key={report.id} sx={{ borderRadius: 3, position: "relative", mx: { xs: 0, sm: 1 } }}>
      <CardContent sx={{ display: "flex", flexDirection: "column" }}>
      <Box
  sx={{
    display: 'flex',
    flexWrap: 'wrap',       // اجازه‌ی رفتن به خط بعد
    alignItems: 'center',
    mb: 1,
  }}
>
  {/* چیپ گزارش */}
  <Chip
    label={translateType(report.Type)}
    color="success"
    sx={{
      mr: 1,                 // فاصله‌ی افقی از آیکون
      mb: { xs: 1, sm: 0 },  // در موبایل کمی فاصله عمودی بگیرد
    }}
  />

  {/* آیکون منوی سه‌نقطه */}
  <IconButton
    onClick={(e) => handleMenuOpen(e, report)}
    size="small"
    sx={{
      mr: { sm: 1 },         // در دسکتاپ کمی فاصله از سمت راست
      mb: { xs: 1, sm: 0 },  // در موبایل کمی فاصله عمودی بگیرد
    }}
  >
    <MoreVertIcon />
  </IconButton>

  {/* تاریخ گزارش */}
  <Typography
    variant="body2"
    color="text.secondary"
    display="flex"
    alignItems="center"
    sx={{
      width: { xs: '100%', sm: 'auto' }, // در موبایل عرض کامل => می‌رود خط بعد
      mt: { xs: 0, sm: 0 },              // اگر خواستید در موبایل کمی فاصله بیندازید: mt: { xs: 1, sm: 0 }
    }}
  >
    <CalendarMonthIcon fontSize="small" sx={{ ml: 0.5 }} />
    {new DateObject({
      date: new Date(report.DateTime),
      calendar: persian,
      locale: persian_fa
    }).format("dddd YYYY/MM/DD - HH:mm")}
  </Typography>
</Box>


        <Typography variant="body1" gutterBottom>{report.Information}</Typography>

        {report.Picture && (
          <Box
            component="img"
            src={report.Picture}
            alt="گزارش تصویری"
            onClick={() => setSelectedImage(report.Picture)}
            sx={{
              width: "100%",
              maxHeight: 180,
              objectFit: "cover",
              borderRadius: 2,
              my: 1,
              cursor: "pointer",
              transition: "0.2s",
              '&:hover': { opacity: 0.9 }
            }}
          />
        )}

        {report.Video && (
          <Box my={1}>
            <video controls style={{ width: '100%', borderRadius: '12px', maxHeight: 180, objectFit: "cover" }}>
              <source src={report.Video} type="video/mp4" />
              مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
            </video>
          </Box>
        )}

        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          mt={1}
          gap={1}
          color="gray"
        >
          <Box display="flex" flexDirection="column" mt={1} color="gray">
  <Box display="flex" alignItems="center" mb={0.5}>
    <LocationOnIcon fontSize="small" />
    <Typography variant="caption" ml={0.5}>
      {report.CityName}، {report.ProvinceName}
    </Typography>
  </Box>

  {report.FullAdress && (
    <Typography
    variant="caption"
    color="green"
    sx={{
      pl: 2.5,
      cursor: "pointer",
      '&:hover': { textDecoration: "underline" }
    }}
    onClick={() => setSelectedReportForMap(report)}
  >
    {report.FullAdress}
  </Typography>
  
    
  )}
</Box>



          
          <Box display="flex" alignItems="center">
            <PersonIcon fontSize="small" />
            <Typography variant="caption" ml={0.5}>
              گزارش‌دهنده: {report.ReporterName}
            </Typography>
          </Box>
        </Box>

        {/* نمایش وضعیت با مقدار پیش‌فرض */}
        <Box mt={1}>
          <Chip
            label={report.Status || "در انتظار بررسی"}
            color={getStatusColor(report.Status || "در انتظار بررسی")}
            size="small"
          />
        </Box>
      </CardContent>
    </Card>
  ))}
</Masonry>
{selectedReportForMap && (
  <MapWithClickDialog
  
    lat={selectedReportForMap.Latitude}
    lng={selectedReportForMap.Longitude}
    onClose={() => setSelectedReportForMap(null)}
  />
)}









      {/* منوی مربوط به آیکون ۳ نقطه */}
      <Menu
        anchorEl={noteAnchor}
        open={Boolean(noteAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleOpenNoteDialog}>
          افزودن یادداشت داخلی
        </MenuItem>
        <MenuItem onClick={handleOpenViewNotesDialog}>
          نمایش یادداشت‌های ثبت شده
        </MenuItem>
        <MenuItem onClick={handleOpenStatusDialog}>
          تغییر وضعیت گزارش
        </MenuItem>
      </Menu>

      {/* دیالوگ برای افزودن یادداشت داخلی */}
      <Dialog
  open={notesDialogOpen}
  onClose={handleCloseNoteDialog}
  maxWidth="md"
  fullWidth
  scroll="body"
>
  <DialogContent sx={{ px: 4, pt: 3 }}>
    <Typography variant="h6" fontWeight="bold" textAlign="center" mb={2}>
      📝 افزودن یادداشت داخلی
    </Typography>

    <Box
  sx={{
    "& .ql-container": {
      height: "200px",
      overflowY: "auto",
      borderBottomLeftRadius: "8px",
      borderBottomRightRadius: "8px",
    },
    "& .ql-editor": {
      direction: "rtl",
      fontFamily: 'Vazirmatn, sans-serif',
      fontSize: "0.95rem",
    },
    "& .ql-toolbar": {
      direction: "rtl",
      borderTopLeftRadius: "8px",
      borderTopRightRadius: "8px",
    },
    "& .ql-picker-label::after": {
      display: "none", // حذف فلش
    },
    backgroundColor: "#fff",
    borderRadius: "8px",
    overflow: "hidden"
  }}
>

      <ReactQuill
        value={noteText}
        onChange={setNoteText}
        theme="snow"
        modules={modules}
        formats={formats}
      />
    </Box>
  </DialogContent>

  <DialogActions sx={{ px: 3, pb: 2, justifyContent: "space-between" }}>
    <Button onClick={handleCloseNoteDialog} variant="outlined" color="error">
      انصراف
    </Button>
    <Button
  onClick={handleSaveNote}
  variant="contained"
  color="success"
  disabled={noteText.trim() === "" || noteText === "<p><br></p>"}
>
  ذخیره
</Button>

  </DialogActions>
</Dialog>




      {/* دیالوگ برای نمایش یادداشت‌های ثبت شده */}
      <Dialog
  open={viewNotesDialogOpen}
  onClose={handleCloseViewNotesDialog}
  maxWidth="sm"
  fullWidth
  PaperProps={{
    sx: {
      borderRadius: 3,
      maxHeight: "80vh",
    }
  }}
>
  <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", fontSize: "1.1rem" }}>
    📝 یادداشت‌های داخلی
  </DialogTitle>

  <DialogContent
    sx={{
      px: 3,
      py: 2,
      overflowY: "auto",
      maxHeight: "60vh",
    }}
  >
    {selectedReport &&
      (internalNotes[selectedReport.id]?.length > 0 ? (
        internalNotes[selectedReport.id].map((note, index) => (
          <Box
            key={index}
            mb={2}
            p={2}
            sx={{
              backgroundColor: "#f9f9f9",
              borderRadius: 2,
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              borderRight: "4px solid #2e7d32",
            }}
          >
          <Box display="flex" alignItems="center" gap={1} mb={1} sx={{ direction: "rtl" }}>
  {note.NoteOwnerPicture && (
    <Box
      component="img"
      src={note.NoteOwnerPicture}
      alt="نویسنده"
      sx={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        objectFit: "cover",
        border: "1px solid #ccc",
      }}
    />
  )}
  <Typography
    variant="caption"
    fontWeight="bold"
    color="text.secondary"
    sx={{ overflowWrap: "anywhere", textAlign: "right" }}  // اضافه کردن textAlign به راست
  >
    یادداشت {index + 1} توسط {note.NoteOwnerName}
  </Typography>
</Box>

{/* ایمیل نویسنده */}
<Typography
  variant="caption"
  color="text.secondary"
  mb={1}
  textAlign="right"  // راست‌چین کردن ایمیل
  sx={{
    direction: "ltr",
    fontSize: "0.8rem",
    opacity: 0.8,
  }}
>
  📧 {note.NoteOwnerEmail}
</Typography>


            {/* متن یادداشت */}
            <Box
              sx={{
                fontSize: "0.95rem",
                fontFamily: "Vazirmatn, sans-serif",
                direction: "rtl",
                lineHeight: 1.8,
                color: "#333",
                overflowWrap: "anywhere",
                wordBreak: "break-word",
                "& ul, & ol": { paddingRight: 2, margin: 0 },
                "& li": { marginBottom: "4px" },
                "& a": { color: "#2e7d32", textDecoration: "underline" },
              }}
              dangerouslySetInnerHTML={{ __html: note.Information }}
            />

            {/* دکمه‌های ویرایش و حذف (در صورت مجاز بودن) */}
            {note.PutDeletePermission && (
  <Box display="flex" justifyContent="flex-end" mt={2} gap={1}>
    {/* دکمه ویرایش با آیکون مداد و رنگ سبز */}
    <IconButton
  color="success"
  size="small"
  onClick={() => handleEditNoteClick(note.id, note.Information)}
>
  <EditIcon fontSize="small" />
</IconButton>

<IconButton
  color="error"
  size="small"
  onClick={() => handleDeleteClick(note.id)}
>
  <DeleteIcon fontSize="small" />
</IconButton>


  </Box>
            )}
          </Box>
        ))
      ) : (
        <Typography variant="body2" textAlign="center">
         . یادداشتی موجود نیست
        </Typography>
      ))}
  </DialogContent>

  <DialogActions sx={{ px: 3, pb: 2 }}>
    <Button onClick={handleCloseViewNotesDialog} variant="contained" color="success" fullWidth>
      بستن
    </Button>
  </DialogActions>
</Dialog>





      {/* دیالوگ برای تغییر وضعیت گزارش */}
      <Dialog open={statusDialogOpen} onClose={handleCloseStatusDialog}>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel>وضعیت گزارش</InputLabel>
            <Select
              value={tempStatus}
              onChange={(e) => setTempStatus(e.target.value)}
              label="وضعیت گزارش"
            >
              <MenuItem value="در انتظار بررسی">در انتظار بررسی</MenuItem>
              <MenuItem value="در حال رسیدگی">در حال رسیدگی</MenuItem>
              <MenuItem value="حل‌شده">حل‌شده</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStatusDialog} color="error">انصراف</Button>
          <Button onClick={handleSaveStatus} variant="contained" color="primary">ذخیره</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for image preview */}
      <Dialog open={Boolean(selectedImage)} onClose={() => setSelectedImage(null)} maxWidth="md">
        <DialogContent sx={{ p: 0, position: "relative" }}>
          <IconButton
            onClick={() => setSelectedImage(null)}
            sx={{ position: 'absolute', top: 8, left: 8, zIndex: 10, background: "#fff" }}
          >
            <CloseIcon />
          </IconButton>
          <Box
            component="img"
            src={selectedImage}
            alt="نمایش بزرگ تصویر"
            sx={{ width: "100%", maxHeight: "90vh", objectFit: "contain" }}
          />
        </DialogContent>
      </Dialog>
      <Dialog open={editNoteDialogOpen} onClose={() => setEditNoteDialogOpen(false)} maxWidth="md" fullWidth>
  <DialogContent sx={{ pt: 3 }}>
    <Typography variant="h6" fontWeight="bold" textAlign="center" mb={2}>
      ✏️ ویرایش یادداشت
    </Typography>

    <Box
      sx={{
        "& .ql-container": {
          height: "200px",
          overflowY: "auto",
          borderBottomLeftRadius: "8px",
          borderBottomRightRadius: "8px",
        },
        "& .ql-editor": {
          direction: "rtl",
          fontFamily: 'Vazirmatn, sans-serif',
          fontSize: "0.95rem",
        },
        "& .ql-toolbar": {
          direction: "rtl",
          borderTopLeftRadius: "8px",
          borderTopRightRadius: "8px",
        },
        "& .ql-picker-label::after": {
          display: "none",
        },
        backgroundColor: "#fff",
        borderRadius: "8px",
        overflow: "hidden",
        mb: 2
      }}
    >
      <ReactQuill
        value={editNoteText}
        onChange={setEditNoteText}
        theme="snow"
        modules={modules}
        formats={formats}
      />
    </Box>
  </DialogContent>

  <DialogActions sx={{ px: 3, pb: 2, justifyContent: "space-between" }}>
    <Button
      onClick={() => setEditNoteDialogOpen(false)}
      color="error"
      variant="outlined"
      
    >
      انصراف
    </Button>

    <Button
      onClick={handleSaveEditedNote}
      color="success"
      variant="contained"
      
    >
      ذخیره
    </Button>
  </DialogActions>
</Dialog>

<Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
  <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
    ⚠️ حذف یادداشت
  </DialogTitle>
  <DialogContent>
    <Typography textAlign="center">
      آیا از حذف این یادداشت مطمئن هستید؟
    </Typography>
  </DialogContent>
  <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
    <Button onClick={() => setDeleteDialogOpen(false)} variant="outlined" color="primary">
      انصراف
    </Button>
    <Button onClick={handleConfirmDelete} variant="contained" color="error">
      حذف
    </Button>
  </DialogActions>
</Dialog>


    </Box>
  )
}
