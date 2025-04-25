import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Card,
  CardContent,
  Chip,
  Collapse,
  Dialog,
  DialogContent,
  IconButton,
  Menu,
  DialogActions,
} from "@mui/material";
import Masonry from "react-masonry-css";
import "./masonry.css"; // فایل استایل که می‌سازیم
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SearchIcon from "@mui/icons-material/Search";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import CloseIcon from "@mui/icons-material/Close";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DateObject from "react-date-object";
import { useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Swal from "sweetalert2";
import MapWithClickDialog from "./MapWithClickDialog"; // مسیر رو درست کن
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import PendingIcon from "@mui/icons-material/Pending";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import { getCity, getProvince } from "../services/admin-api"; // فرض بر این است که این فایل درست است

import { DialogTitle } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import logo from "../assets/lgo.png";


export default function Reports({ReportClick}) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [mapOpen, setMapOpen] = useState(false);
  const [selectedReportForMap, setSelectedReportForMap] = useState(null);

  const [reports, setReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedCity, setSelectedCity] = useState("");
  const [editNoteDialogOpen, setEditNoteDialogOpen] = useState(false);
  const [editNoteText, setEditNoteText] = useState("");
  const [editNoteId, setEditNoteId] = useState(null);
  const [priorityDialogOpen, setPriorityDialogOpen] = useState(false);
  const [tempPriority, setTempPriority] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [teamsDialogOpen, setTeamsDialogOpen] = useState(false);
  const [teamList, setTeamList] = useState([]);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedTeamID, setSelectedTeamID] = useState(null);
  const [editTeamOpen, setEditTeamOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [provinces, setProvinces] = useState([]); // برای استان‌ها
  const [cities, setCities] = useState([]); // برای شهرها
  const [editedProvince, setEditedProvince] = useState("");
  const [editedCity, setEditedCity] = useState("");
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [activeVideos, setActiveVideos] = useState([]); // آرایه‌ای برای نگهداری شناسه ویدیوهای فعال



  useEffect(() => {
    getProvince()
      .then(setProvinces)
      .catch((error) => console.error("خطا در دریافت استان‌ها:", error));
  }, []);

  useEffect(() => {
    if (editedProvince) {
      // مطمئن شوید که استان انتخاب شده وجود دارد
      getCity(editedProvince.id)
        .then(setCities)
        .catch((error) => console.error("خطا در دریافت شهرها:", error));
    } else {
      setCities([]); // اگر استان انتخاب نشده است، لیست شهرها را خالی کنید
    }
  }, [editedProvince]); // به روز رسانی هر زمان که استان تغییر کند

  useEffect(() => {
    if (selectedTeam) {
      // تنظیم اطلاعات استان و شهر هنگام ویرایش
      const province = provinces.find(
        (p) => p.Name === selectedTeam.ProvinceName
      );
      const city = cities.find((c) => c.Name === selectedTeam.CityName);

      setEditedProvince(province);
      setEditedCity(city);
    }
  }, [selectedTeam, provinces, cities]);

  useEffect(() => {
    if (selectedReport) {
      // ارسال درخواست برای دریافت تیم‌ها پس از تغییر استان یا شهر
      fetch(
        `${import.meta.env.VITE_APP_HTTP_BASE}://${
          import.meta.env.VITE_APP_URL_BASE
        }/supervise/mayor-delegate/?CityProblemID=${selectedReport.id}`,
        {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      )
        .then((res) => {
          if (!res.ok) throw new Error("خطا در دریافت تیم‌ها");
          return res.json();
        })
        .then((data) => {
          setTeamList(data); // بروزرسانی لیست تیم‌ها
        })
        .catch((err) => {
          console.error("❌ خطا در گرفتن تیم‌ها:", err);
        });
    }
  }, [selectedCity, editedProvince, editedCity]); // اضافه کردن `selectedCity`, `editedProvince` و `editedCity` به وابستگی‌ها

  const handleDelete = (teamID) => {
    setSelectedTeamID(teamID);
    setConfirmDeleteOpen(true); // باز کردن دیالوگ تایید حذف
  };
  const handleEdit = (team) => {
    setSelectedTeam(team);
    setEditTeamOpen(true);
  };

  const confirmDeleteHandler = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/supervise/mayor-delegate/`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ MayorDelegate_ID: selectedTeamID }),
          credentials: "include", // ارسال اطلاعات نشست (کوکی‌ها)
        }
      );

      const result = await response.json();

      if (response.ok) {
        Swal.fire("حذف موفق", result.success, "success");

        // به روز رسانی لیست تیم‌ها بعد از حذف
        setTeamList((prevList) =>
          prevList.filter((team) => team.id !== selectedTeamID)
        );
      } else {
        Swal.fire("خطا", "مشکلی در حذف تیم پیش آمد", "error");
      }
    } catch (error) {
      Swal.fire("خطا", "مشکلی در حذف تیم پیش آمد", "error");
    } finally {
      setConfirmDeleteOpen(false); // بستن دیالوگ
    }
  };

  const handleEditSubmit = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_HTTP_BASE}://${
          import.meta.env.VITE_APP_URL_BASE
        }/supervise/mayor-delegate/`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            MayorDelegate_ID: selectedTeam?.id,
            OrganHead_FullName: selectedTeam?.OrganHead_FullName,
            OrganHead_Email: selectedTeam?.OrganHead_Email,
            OrganHead_Number: selectedTeam?.OrganHead_Number,
            Type: selectedTeam?.Type,
            ProvinceID: editedProvince?.id, // استفاده از `editedProvince`
            CityID: editedCity?.id, // استفاده از `editedCity`
          }),
          credentials: "include", // برای ارسال اطلاعات نشست
        }
      );

      const result = await response.json();

      if (response.ok) {
        // به روز رسانی وضعیت تیم‌ها
        setTeamList((prevList) =>
          prevList.map((team) =>
            team.id === selectedTeam.id
              ? { ...team, ...selectedTeam } // به روز رسانی تیم ویرایش‌شده
              : team
          )
        );

        // فراخوانی مجدد برای دریافت تیم‌ها
        fetch(
          `${import.meta.env.VITE_APP_HTTP_BASE}://${
            import.meta.env.VITE_APP_URL_BASE
          }/supervise/mayor-delegate/?CityProblemID=${selectedReport.id}`,
          {
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        )
          .then((res) => res.json())
          .then((data) => setTeamList(data)) // لیست تیم‌ها به‌روز می‌شود
          .catch((err) => console.error("خطا در دریافت تیم‌ها:", err));

        Swal.fire("ویرایش موفق", "اطلاعات تیم با موفقیت ویرایش شد", "success");
        setEditTeamOpen(false);
      } else {
        Swal.fire(
          "خطا",
          result.error || "مشکلی در ویرایش تیم پیش آمد",
          "error"
        );
      }
    } catch (error) {
      Swal.fire("خطا", "مشکلی در ویرایش تیم پیش آمد", "error");
    }
  };

  const uniqueProvinces = [...new Set(reports.map((r) => r.ProvinceName))];
  const uniqueCities = [...new Set(reports.map((r) => r.CityName))];

  // state مربوط به منو و دیالوگ‌های یادداشت و تغییر وضعیت
  const [noteAnchor, setNoteAnchor] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);

  // دیالوگ افزودن یادداشت
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [noteText, setNoteText] = useState("");
  // ذخیره چندین یادداشت برای هر گزارش؛ کلید گزارش، مقدار آرایه‌ای از یادداشت‌ها
  const [internalNotes, setInternalNotes] = useState({});

  // دیالوگ نمایش یادداشت‌ها
  const [viewNotesDialogOpen, setViewNotesDialogOpen] = useState(false);

  // دیالوگ تغییر وضعیت گزارش
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [tempStatus, setTempStatus] = useState("");

  const translateStatus = (status) => {
    switch (status) {
      case "PendingReview":
        return "در انتظار بررسی";
      case "UnderConsideration":
        return "در حال رسیدگی";
      case "IssueResolved":
        return "حل‌شده";
      default:
        return status;
    }
  };

  const handleEditNoteClick = (noteId, information) => {
    setEditNoteId(noteId);
    setEditNoteText(information);
    setEditNoteDialogOpen(true);
  };
  const handleSaveEditedNote = () => {
    fetch(
      `${import.meta.env.VITE_APP_HTTP_BASE}://${
        import.meta.env.VITE_APP_URL_BASE
      }/supervise/mayor-note/`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          NoteID: editNoteId,
          Information: editNoteText,
        }),
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("ویرایش یادداشت ناموفق بود");
        return res.json();
      })
      .then(() => {
        setEditNoteDialogOpen(false);
        setEditNoteText("");
        setEditNoteId(null);
        handleOpenViewNotesDialog(); 
      })
      .catch((err) => {
        console.error("خطا در ویرایش:", err);
      });
  };
  const handleOpenTeamsDialog = () => {
    if (!selectedReport) return;

    fetch(
      `${import.meta.env.VITE_APP_HTTP_BASE}://${
        import.meta.env.VITE_APP_URL_BASE
      }/supervise/mayor-delegate/?CityProblemID=${selectedReport.id}`,
      {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("خطا در دریافت تیم‌ها");
        return res.json();
      })
      .then((data) => {
        setTeamList(data);
        setTeamsDialogOpen(true);
      })
      .catch((err) => {
        console.error("❌ خطا در گرفتن تیم‌ها:", err);
      });

    handleMenuClose(); 
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedType("");
    setSelectedProvince("");
    setSelectedCity("");
    setSelectedStatus("");
    setSelectedPriority("");
    setDateFrom("");
    setDateTo("");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "در حال رسیدگی":
        return "info";
      case "حل‌شده":
        return "success";
      default:
        return "warning";
    }
  };

  const updateReportStatus = (id, newStatus) => {
    setReports((prev) =>
      prev.map((report) =>
        report.id === id ? { ...report, status: newStatus } : report
      )
    );
  };

  const handleMenuOpen = (event, report) => {
    setNoteAnchor(event.currentTarget);
    setSelectedReport(report);
  };

  const handleMenuClose = () => {
    setNoteAnchor(null);
  };

  const handleOpenNoteDialog = () => {
    setNoteText("");
    setNotesDialogOpen(true);
    handleMenuClose();
  };

  const handleCloseNoteDialog = () => {
    setNotesDialogOpen(false);
    setNoteText("");
  };

  const handleSaveNote = () => {
    if (selectedReport && noteText.trim()) {
      fetch(
        `${import.meta.env.VITE_APP_HTTP_BASE}://${
          import.meta.env.VITE_APP_URL_BASE
        }/supervise/mayor-note/`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            CityProblemID: selectedReport.id,
            Information: noteText,
          }),
        }
      )
        .then((res) => {
          if (!res.ok) throw new Error("خطا در ذخیره یادداشت");
          return res.json();
        })
        .then((newNote) => {
          setInternalNotes((prev) => {
            const existingNotes = prev[selectedReport.id] || [];
            return {
              ...prev,
              [selectedReport.id]: [...existingNotes, newNote.Information],
            };
          });
          handleCloseNoteDialog();
          Swal.fire({
            icon: "success",
            title: "یادداشت با موفقیت اضافه شد",
            confirmButtonText: "باشه",
            customClass: {
              confirmButton: "swal-confirm-btn",
              title: "swal-title",
            },
          });
        })
        .catch((err) => {
          console.error("خطا در افزودن یادداشت:", err);
        });
    }
  };
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline"],
      ["link"],
      [{ align: [] }],
      ["clean"],
    ],
  };

  const formats = ["header", "bold", "italic", "underline", "link", "align"];

  const handleOpenViewNotesDialog = () => {
    if (!selectedReport) return;

    fetch(
      `${import.meta.env.VITE_APP_HTTP_BASE}://${
        import.meta.env.VITE_APP_URL_BASE
      }/supervise/mayor-note/?CityProblemID=${selectedReport.id}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("خطا در دریافت یادداشت‌ها");
        return res.json();
      })
      .then((notes) => {
        const fullBaseUrl = `${import.meta.env.VITE_APP_HTTP_BASE}://${
          import.meta.env.VITE_APP_URL_BASE
        }`;

        const noteTexts = Array.isArray(notes)
          ? notes.map((note) => ({
              id: note.id,
              Information: note.Information,
              NoteOwnerName: note.NoteOwnerName,
              NoteOwnerEmail: note.NoteOwnerEmail,
              PutDeletePermission: note.PutDeletePermission,
              NoteOwnerPicture: note.NoteOwnerPicture?.startsWith("/Media")
                ? `${fullBaseUrl}${note.NoteOwnerPicture}`
                : note.NoteOwnerPicture
                ? `${fullBaseUrl}/Media/Profile_Pictures/${note.NoteOwnerPicture}`
                : null,
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

    fetch(
      `${import.meta.env.VITE_APP_HTTP_BASE}://${
        import.meta.env.VITE_APP_URL_BASE
      }/supervise/mayor-note/`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ NoteID: noteToDelete }),
      }
    )
      .then((res) => {
        console.log("🔵 پاسخ دریافت شد، وضعیت:", res.status);
        if (!res.ok) throw new Error("خطا در حذف یادداشت");
        return res.json();
      })
      .then((data) => {
        console.log("✅ یادداشت با موفقیت حذف شد:", data);
        setDeleteDialogOpen(false);
        setNoteToDelete(null);
        handleOpenViewNotesDialog();
      })
      .catch((err) => {
        console.error("❌ خطا در عملیات حذف:", err);
      });
  };

  const handleCloseViewNotesDialog = () => {
    setViewNotesDialogOpen(false);
  };

  const handleReportClick = () => {
    ReportClick(selectedReport.id);
  };
  
  const handleOpenStatusDialog = () => {
    setTempStatus(selectedReport.status);
    setStatusDialogOpen(true);
    handleMenuClose();
  };

  const handleCloseStatusDialog = () => {
    setStatusDialogOpen(false);
    setTempStatus("");
  };

  const handleSaveStatus = () => {
    if (!selectedReport) return;

    fetch(
      `${import.meta.env.VITE_APP_HTTP_BASE}://${
        import.meta.env.VITE_APP_URL_BASE
      }/supervise/mayor-determine-cityproblem-situation/`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          CityProblemID: selectedReport.id,
          NewSituation: tempStatus,
        }),
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("خطا در تغییر وضعیت");
        return res.json();
      })
      .then(() => {
        setReports((prev) =>
          prev.map((report) =>
            report.id === selectedReport.id
              ? { ...report, Status: tempStatus }
              : report
          )
        );
        handleCloseStatusDialog();
      })
      .catch((err) => {
        console.error("❌ خطا:", err);
      });
  };

  const breakpointColumnsObj = {
    default: 2,
    960: 2,
    600: 1,
  };
  const translateType = (type) => {
    switch (type) {
      case "Lighting":
      case "lighting":
        return "روشنایی";
      case "Street":
      case "street":
        return "خیابان";
      case "Garbage":
      case "garbage":
        return "زباله";
      case "Others":
      case "others":
        return "سایر";
      default:
        return type;
    }
  };

  const filteredReports = reports.filter((r) => {
    const reportDate = new DateObject({
      date: new Date(r.DateTime),
      calendar: persian,
      locale: persian_fa,
    });

    const fromDateObj = dateFrom
      ? new DateObject(dateFrom).set({ hour: 0, minute: 0, second: 0 })
      : null;

    const toDateObj = dateTo
      ? new DateObject(dateTo).set({ hour: 23, minute: 59, second: 59 })
      : null;

    return (
      (selectedType === "" || translateType(r.Type) === selectedType) &&
      (selectedProvince === "" || r.ProvinceName === selectedProvince) &&
      (selectedCity === "" || r.CityName === selectedCity) &&
      (selectedStatus === "" || translateStatus(r.Status) === selectedStatus) &&
      (selectedPriority === "" || r.Priority === selectedPriority) &&
      (searchQuery === "" ||
        r.Information.includes(searchQuery) ||
        r.ReporterName.includes(searchQuery)) &&
      (!fromDateObj || reportDate >= fromDateObj) &&
      (!toDateObj || reportDate <= toDateObj)
    );
  });

  useEffect(() => {
    const fullBaseUrl = `${import.meta.env.VITE_APP_HTTP_BASE}://${
      import.meta.env.VITE_APP_URL_BASE
    }`;

    fetch(
      `${import.meta.env.VITE_APP_HTTP_BASE}://${
        import.meta.env.VITE_APP_URL_BASE
      }/supervise/mayor-watch-report/`,
      {
        credentials: "include",
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("خطا در دریافت گزارش‌ها");
        return res.json();
      })
      .then((data) => {
        const updated = data.map((item) => ({
          ...item,
          Picture: item.Picture?.startsWith("/Media")
            ? `${fullBaseUrl}${item.Picture}`
            : item.Picture
            ? `${fullBaseUrl}/Media/CivicProblem_Pictures/${item.Picture}`
            : null,

          Video: item.Video?.startsWith("/Media")
            ? `${fullBaseUrl}${item.Video}`
            : item.Video
            ? `${fullBaseUrl}/Media/CivicProblem_Videos/${item.Video}`
            : null,

          Status: item.Status || "در انتظار بررسی",
        }));

        setReports(updated);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleOpenPriorityDialog = () => {
    setTempPriority(selectedReport.Priority || "Medium");
    setPriorityDialogOpen(true);
    handleMenuClose();
  };

  const handleClosePriorityDialog = () => {
    setPriorityDialogOpen(false);
    setTempPriority("");
  };

  const handleSavePriority = () => {
    if (!selectedReport) return;

    fetch(
      `${import.meta.env.VITE_APP_HTTP_BASE}://${
        import.meta.env.VITE_APP_URL_BASE
      }/supervise/mayor-prioritize/`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          CityProblemID: selectedReport.id,
          Priority: tempPriority,
        }),
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("خطا در ثبت اولویت");
        return res.json();
      })
      .then(() => {
        setReports((prev) =>
          prev.map((report) =>
            report.id === selectedReport.id
              ? { ...report, Priority: tempPriority }
              : report
          )
        );
        setPriorityDialogOpen(false);
      })
      .catch((err) => {
        console.error("❌ خطا در ثبت اولویت:", err);
      });
  };

  return (
    <Box sx={{ textAlign: "center" }}>
      <Typography
        variant="h4"
        gutterBottom
        color="green"
        textAlign="center"
        fontSize={{ xs: "1.8rem", sm: "2.5rem" }}
      >
        گزارشات دریافتی
      </Typography>

      <Button
        variant="contained"
        startIcon={<FilterAltIcon sx={{ ml: 0.5 }} />}
        onClick={() => setShowFilters((prev) => !prev)}
        sx={{
          mb: 2,
          backgroundColor: "green",
          "&:hover": { backgroundColor: "#2e7d32" },
          borderRadius: 2,
          px: { xs: 2, sm: 3 },
          py: { xs: 1, sm: 1.5 },
          fontSize: { xs: "0.8rem", sm: "1rem" },
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
            mb: 4,
          }}
        >
          <Box
            sx={{
              position: "relative",
              minWidth: { xs: 250, sm: 300, md: 350 },
              width: "100%",
            }}
          >
            <TextField
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              fullWidth
              placeholder={
                searchQuery === ""
                  ? window.innerWidth >= 600
                    ? "جستجو در توضیحات یا نام گزارش‌دهنده"
                    : ""
                  : ""
              }
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: "gray", mr: 1 }} />,
              }}
            />

            {searchQuery === "" && (
              <Box
                sx={{
                  display: { xs: "flex", sm: "none" },
                  alignItems: "center",
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  right: 40,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  fontSize: "0.85rem",
                  color: "#aaa",
                  pointerEvents: "none",
                  paddingRight: 1,
                }}
              >
                <Box
                  sx={{
                    display: "inline-block",
                    animation: "scrollText 8s linear infinite",
                  }}
                >
                  جستجو در توضیحات یا نام گزارش‌دهنده
                </Box>
              </Box>
            )}
          </Box>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>نوع گزارش</InputLabel>
            <Select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              label="نوع گزارش"
            >
              <MenuItem value="">همه</MenuItem>
              <MenuItem value="خیابان">خرابی خیابان</MenuItem>
              <MenuItem value="روشنایی">مشکل روشنایی</MenuItem>
              <MenuItem value="زباله">زباله رها شده</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>استان</InputLabel>
            <Select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              label="استان"
            >
              <MenuItem value="">همه</MenuItem>
              {uniqueProvinces.map((province) => (
                <MenuItem key={province} value={province}>
                  {province}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>شهر</InputLabel>
            <Select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              label="شهر"
            >
              <MenuItem value="">همه</MenuItem>
              {uniqueCities.map((city) => (
                <MenuItem key={city} value={city}>
                  {city}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>وضعیت گزارش</InputLabel>
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              label="وضعیت گزارش"
            >
              <MenuItem value="">همه</MenuItem>
              <MenuItem value="در انتظار بررسی">در انتظار بررسی</MenuItem>
              <MenuItem value="در حال رسیدگی">در حال رسیدگی</MenuItem>
              <MenuItem value="حل‌شده">حل‌شده</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>درجه اهمیت</InputLabel>
            <Select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              label="درجه اهمیت"
            >
              <MenuItem value="">همه</MenuItem>
              <MenuItem value="High">زیاد</MenuItem>
              <MenuItem value="Medium">متوسط</MenuItem>
              <MenuItem value="Low">کم</MenuItem>
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

          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={resetFilters}
            startIcon={<ClearAllIcon />}
          >
            ریست
          </Button>
        </Box>
      </Collapse>

      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {filteredReports.map((report) => (
          <Card
            key={report.id}
            sx={{
              borderRadius: 3,
              position: "relative",
              mx: { xs: 0, sm: 1 },
              transition: "0.3s",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              "&:hover": {
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                transform: "translateY(-4px)",
              },
              background: "linear-gradient(to top left, #f8fdf8, #ffffff)",
            }}
          >

            <CardContent
              sx={{ display: "flex", flexDirection: "column", p: 2.5 }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Chip label={translateType(report.Type)} color="success" />

                <Box display="flex" alignItems="center">
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    display="flex"
                    alignItems="center"
                    sx={{ ml: 1 }}
                  >
                    <CalendarMonthIcon fontSize="small" sx={{ ml: 0.5 }} />
                    {new DateObject({
                      date: new Date(report.DateTime),
                      calendar: persian,
                      locale: persian_fa,
                    }).format("dddd YYYY/MM/DD - HH:mm")}
                  </Typography>

                  <IconButton
                    onClick={(e) => handleMenuOpen(e, report)}
                    size="small"
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Box>
              </Box>

              <Typography
                variant="body1"
                sx={{
                  fontWeight: 500,
                  my: 1,
                  color: "#333",
                  textAlign: "right",
                }}
              >
                {report.Information}
              </Typography>

              {report.Picture && (
                <Box
                  sx={{
                    border: "1px solid #ddd",
                    borderRadius: 2,
                    overflow: "hidden",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                    my: 1,
                    cursor: "pointer",
                  }}
                >
                  <Box
                    component="img"
                    src={report.Picture}
                    alt="گزارش تصویری"
                    onClick={() => setSelectedImage(report.Picture)}
                    sx={{
                      width: "100%",
                      height: 180,
                      objectFit: "cover",
                      transition: "0.2s",
                      "&:hover": { opacity: 0.9 },
                    }}
                  />
                </Box>
              )}

{report.Video && (
  <Box
    sx={{
      border: "1px solid rgba(255,255,255,0.2)", // حاشیه شفاف‌تر برای هماهنگی
      borderRadius: 2,
      overflow: "hidden",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      my: 1,
      cursor: "pointer",
      position: "relative",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      "&:hover": {
        transform: "scale(1.02)",
        boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
      },
    }}
    onClick={() => {
      setActiveVideos((prevActiveVideos) =>
        prevActiveVideos.includes(report.id)
          ? prevActiveVideos
          : [...prevActiveVideos, report.id]
      );
    }}
  >
    {activeVideos.includes(report.id) ? (
      <video
        controls
        style={{
          width: "100%",
          maxHeight: 180,
          objectFit: "cover",
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
        }}
      >
        <source src={report.Video} type="video/mp4" />
        مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
      </video>
    ) : (
      <Box
        sx={{
          width: "100%",
          height: 180,
          background: `linear-gradient(135deg, rgba(30,60,114,0.8) 0%, rgba(42,82,152,0.8) 100%)`, // گرادیان شفاف‌تر
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
          // اضافه کردن افکت بلوری و هاله
          backdropFilter: "blur(8px)", // افکت بلور شیشه‌ای
          WebkitBackdropFilter: "blur(8px)", // پشتیبانی از مرورگرهای مختلف
          boxShadow: "0 0 20px rgba(66,133,244,0.5), 0 0 40px rgba(30,60,114,0.3)", // هاله ترکیبی
          border: "1px solid rgba(255,255,255,0.3)", // حاشیه نئونی ملایم
        }}
      >
        {/* تصویر پیش‌نمایش (اختیاری) */}
        {logo && (
          <Box
            component="img"
            src={logo}
            sx={{
              width: "100%",
              height: "100%",
              position: "absolute",
              top: 0,
              left: 0,
              opacity: 0.6, // کمی محو‌تر برای هماهنگی با هاله
              filter: "blur(2px)", // بلور ملایم روی تصویر
            }}
          />
        )}
        {/* لایه رویی برای افکت گرادیان */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.4)", // لایه تیره‌تر برای کنتراست
          }}
        />
        {/* دکمه پخش با هاله بلوری */}
        <IconButton
          sx={{
            color: "#fff",
            background: "rgba(0,0,0,0.6)",
            border: "2px solid rgba(255,255,255,0.7)",
            boxShadow: "0 0 15px rgba(66,133,244,0.6), 0 0 25px rgba(255,255,255,0.3)", // هاله نئونی
            "&:hover": {
              background: "rgba(0,0,0,0.8)",
              transform: "scale(1.1)",
              boxShadow: "0 0 20px rgba(66,133,244,0.8), 0 0 30px rgba(255,255,255,0.5)",
            },
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
            zIndex: 1,
            backdropFilter: "blur(4px)", // بلور روی دکمه
            WebkitBackdropFilter: "blur(4px)",
          }}
        >
          <PlayArrowIcon fontSize="large" />
        </IconButton>
      </Box>
    )}
  </Box>
)}



              <Box
                display="flex"
                justifyContent="space-between"
                flexDirection={{ xs: "column", sm: "row" }}
                gap={2}
                mt={2}
              >
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="flex-start"
                  textAlign="left"
                  gap={1}
                >
                  <Box display="flex" alignItems="center">
  {/* Check if ReporterPicture exists and convert to full URL if needed */}
  {report.ReporterPicture ? (
    <Box
      component="img"
      src={`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}${report.ReporterPicture}`}
      alt="گزارش‌دهنده"
      sx={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        objectFit: "cover",
        border: "1px solid #ccc",
        marginRight: 1, // فواصل بین عکس و متن
      }}
    />
  ) : (
    <PersonIcon fontSize="small" sx={{ ml: 0.5 }} />
  )}
  <Typography variant="caption" sx={{ marginRight: 1 }}>
    گزارش‌دهنده: {report.ReporterName}
  </Typography>
</Box>


                  <Box
                    display="flex"
                    flexDirection={{ xs: "column", sm: "row" }}
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    gap={1}
                    width="100%"
                  >
                    <Chip
                      icon={
                        report.Status === "IssueResolved" ? (
                          <CheckCircleIcon sx={{ color: "#2e7d32" }} />
                        ) : report.Status === "UnderConsideration" ? (
                          <HourglassTopIcon sx={{ color: "#f9a825" }} />
                        ) : (
                          <PendingIcon sx={{ color: "#1976d2" }} />
                        )
                      }
                      label={
                        report.Status === "IssueResolved"
                          ? "حل‌شده"
                          : report.Status === "UnderConsideration"
                          ? "در حال بررسی"
                          : "در انتظار بررسی"
                      }
                      sx={{
                        backgroundColor:
                          report.Status === "IssueResolved"
                            ? "#e8f5e9"
                            : report.Status === "UnderConsideration"
                            ? "#fffde7"
                            : "#e3f2fd",
                        color:
                          report.Status === "IssueResolved"
                            ? "#2e7d32"
                            : report.Status === "UnderConsideration"
                            ? "#f57f17"
                            : "#1565c0",
                        fontWeight: 500,
                        borderRadius: "12px",
                        px: 1.5,
                      }}
                      size="small"
                    />

                    <Chip
                      icon={<span style={{ fontSize: "1rem" }}>🎯</span>}
                      label={`اهمیت: ${
                        report.Priority === "High"
                          ? "زیاد"
                          : report.Priority === "Medium"
                          ? "متوسط"
                          : report.Priority === "Low"
                          ? "کم"
                          : "تعیین نشده"
                      }`}
                      variant="outlined"
                      size="small"
                      sx={{
                        direction: "rtl",
                        borderRadius: "16px",
                        fontWeight: 500,
                        px: 1.5,
                        backgroundColor:
                          report.Priority === "High"
                            ? "#ffebee"
                            : report.Priority === "Medium"
                            ? "#fff8e1"
                            : report.Priority === "Low"
                            ? "#f5f5f5"
                            : "#eeeeee",
                        color:
                          report.Priority === "High"
                            ? "#c62828"
                            : report.Priority === "Medium"
                            ? "#f9a825"
                            : report.Priority === "Low"
                            ? "#616161"
                            : "#9e9e9e",
                        border: "none",
                        alignSelf: { xs: "flex-start", sm: "center" },
                        mt: { xs: 1, sm: 0 },
                      }}
                    />
                  </Box>
                </Box>

                <Box
                  display="flex"
                  flexDirection="column"
                  color="gray"
                  alignItems="flex-start"
                  textAlign="left"
                >
                  <Box display="flex" alignItems="center" mb={0.5}>
                    <LocationOnIcon
                      fontSize="small"
                      sx={{ ml: 0.5, color: "#2e7d32" }}
                    />
                    <Typography variant="caption">
                      {report.CityName}، {report.ProvinceName}
                    </Typography>
                  </Box>

                  {report.FullAdress && (
                    <Typography
                      variant="caption"
                      color="green"
                      sx={{
                        pl: 3,
                        cursor: "pointer",
                        "&:hover": { textDecoration: "underline" },
                      }}
                      onClick={() => setSelectedReportForMap(report)}
                    >
                      {report.FullAdress}
                    </Typography>
                  )}
                </Box>
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

      <Menu
        anchorEl={noteAnchor}
        open={Boolean(noteAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleReportClick}>رفتن به صفحه گزارش</MenuItem>
        <MenuItem onClick={handleOpenNoteDialog}>افزودن یادداشت داخلی</MenuItem>
        <MenuItem onClick={handleOpenViewNotesDialog}>
          نمایش یادداشت‌های ثبت شده
        </MenuItem>
        <MenuItem onClick={handleOpenStatusDialog}>تغییر وضعیت گزارش</MenuItem>
        <MenuItem onClick={handleOpenPriorityDialog}>تغییر درجه اهمیت</MenuItem>
        <MenuItem onClick={handleOpenTeamsDialog}>نمایش تیم‌های مسئول</MenuItem>
      </Menu>

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
                fontFamily: "Vazirmatn, sans-serif",
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
          <Button
            onClick={handleCloseNoteDialog}
            variant="outlined"
            color="error"
          >
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

      <Dialog
        open={viewNotesDialogOpen}
        onClose={handleCloseViewNotesDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxHeight: "80vh",
          },
        }}
      >
        <DialogTitle
          sx={{ textAlign: "center", fontWeight: "bold", fontSize: "1.1rem" }}
        >
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
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                    mb={1}
                    sx={{ direction: "rtl" }}
                  >
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
                      sx={{ overflowWrap: "anywhere", textAlign: "right" }} 
                    >
                      یادداشت {index + 1} توسط {note.NoteOwnerName}
                    </Typography>
                  </Box>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    mb={1}
                    textAlign="right" 
                    sx={{
                      direction: "ltr",
                      fontSize: "0.8rem",
                      opacity: 0.8,
                    }}
                  >
                    📧 {note.NoteOwnerEmail}
                  </Typography>

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

                  {note.PutDeletePermission && (
                    <Box
                      display="flex"
                      justifyContent="flex-end"
                      mt={2}
                      gap={1}
                    >
                      <IconButton
                        color="success"
                        size="small"
                        onClick={() =>
                          handleEditNoteClick(note.id, note.Information)
                        }
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
          <Button
            onClick={handleCloseViewNotesDialog}
            variant="contained"
            color="success"
            fullWidth
          >
            بستن
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={statusDialogOpen} onClose={handleCloseStatusDialog}>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel>وضعیت گزارش</InputLabel>
            <Select
              value={tempStatus}
              onChange={(e) => setTempStatus(e.target.value)}
              label="وضعیت"
            >
              <MenuItem
                value="PendingReview"
                disabled={selectedReport?.Status !== "PendingReview"}
              >
                در انتظار بررسی
              </MenuItem>
              <MenuItem
                value="UnderConsideration"
                disabled={selectedReport?.Status === "IssueResolved"}
              >
                در حال بررسی
              </MenuItem>
              <MenuItem value="IssueResolved">حل‌شده</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStatusDialog} color="error">
            انصراف
          </Button>
          <Button
            onClick={handleSaveStatus}
            variant="contained"
            color="primary"
          >
            ذخیره
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={Boolean(selectedImage)}
        onClose={() => setSelectedImage(null)}
        maxWidth="md"
      >
        <DialogContent sx={{ p: 0, position: "relative" }}>
          <IconButton
            onClick={() => setSelectedImage(null)}
            sx={{
              position: "absolute",
              top: 8,
              left: 8,
              zIndex: 10,
              background: "#fff",
            }}
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
      <Dialog
        open={editNoteDialogOpen}
        onClose={() => setEditNoteDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
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
                fontFamily: "Vazirmatn, sans-serif",
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
              mb: 2,
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

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
          ⚠️ حذف یادداشت
        </DialogTitle>
        <DialogContent>
          <Typography textAlign="center">
            آیا از حذف این یادداشت مطمئن هستید؟
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
            color="primary"
          >
            انصراف
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
          >
            حذف
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={priorityDialogOpen} onClose={handleClosePriorityDialog}>
        <DialogTitle
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            color: "#black", 
          }}
        >
          🎯 انتخاب درجه اهمیت
        </DialogTitle>

        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel
              sx={{
                color: "#2e7d32",
                "&.Mui-focused": {
                  color: "#2e7d32",
                },
              }}
            >
              درجه اهمیت
            </InputLabel>

            <Select
              value={tempPriority}
              onChange={(e) => setTempPriority(e.target.value)}
              label="درجه اهمیت"
              sx={{
                "& .MuiSelect-select": {
                  color: "#2e7d32",
                  fontWeight: 500,
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#a5d6a7", 
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#81c784",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#388e3c",
                },
              }}
            >
              <MenuItem value="High">زیاد</MenuItem>
              <MenuItem value="Medium">متوسط</MenuItem>
              <MenuItem value="Low">کم</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", px: 3, pb: 2 }}>
          <Button
            onClick={handleClosePriorityDialog}
            variant="outlined"
            sx={{ borderColor: "#2e7d32", color: "#2e7d32" }}
          >
            انصراف
          </Button>
          <Button
            onClick={handleSavePriority}
            variant="contained"
            sx={{
              backgroundColor: "#4caf50",
              "&:hover": { backgroundColor: "#388e3c" },
            }}
          >
            ثبت
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={statusDialogOpen}
        onClose={handleCloseStatusDialog}
        maxWidth="xs"
        fullWidth
        BackdropProps={{
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.25)", 
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            color: "black", 
          }}
        >
          وضعیت گزارش
        </DialogTitle>

        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel
              sx={{
                color: "#2e7d32",
                "&.Mui-focused": { color: "#2e7d32" },
              }}
            >
              وضعیت گزارش
            </InputLabel>
            <Select
              value={tempStatus}
              onChange={(e) => setTempStatus(e.target.value)}
              label="وضعیت گزارش"
              sx={{
                "& .MuiSelect-select": {
                  color: "#2e7d32",
                  fontWeight: 500,
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#a5d6a7",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#81c784",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#388e3c",
                },
              }}
            >
              <MenuItem
                value="PendingReview"
                disabled={selectedReport?.Status !== "PendingReview"}
              >
                در انتظار بررسی
              </MenuItem>
              <MenuItem
                value="UnderConsideration"
                disabled={selectedReport?.Status === "IssueResolved"}
              >
                در حال بررسی
              </MenuItem>
              <MenuItem value="IssueResolved">حل‌شده</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", px: 3, pb: 2 }}>
          <Button
            onClick={handleCloseStatusDialog}
            variant="outlined"
            sx={{
              borderColor: "#2e7d32",
              color: "#2e7d32",
              fontWeight: "bold",
            }}
          >
            انصراف
          </Button>
          <Button
            onClick={handleSaveStatus}
            variant="contained"
            sx={{
              backgroundColor: "#4caf50",
              "&:hover": { backgroundColor: "#388e3c" },
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            ذخیره
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={teamsDialogOpen}
        onClose={() => setTeamsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
          👥 تیم‌های مسئول
        </DialogTitle>

        <DialogContent dividers sx={{ direction: "rtl" }}>
          {teamList.length > 0 ? (
            teamList.map((team, index) => (
              <Box
                key={index}
                mb={2}
                p={2}
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: 2,
                  textAlign: "right",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  نوع مسئولیت:{" "}
                  {team.Type === "Waste"
                    ? "زباله"
                    : team.Type === "Water"
                    ? "آب"
                    : team.Type === "Gas"
                    ? "گاز"
                    : team.Type === "Electricity"
                    ? "برق"
                    : team.Type}
                </Typography>

                <Box display="flex" justifyContent="flex-end">
  <IconButton onClick={() => handleEdit(team)} sx={{ color: 'green' }}>
    <EditIcon />
  </IconButton>
  <IconButton
    onClick={() => handleDelete(team.id)}
    color="error"
  >
    <DeleteIcon />
  </IconButton>
</Box>


                <Typography
                  variant="body2"
                  display="flex"
                  alignItems="center"
                  gutterBottom
                >
                  <PersonIcon
                    fontSize="small"
                    sx={{ ml: 1, color: "#2e7d32" }}
                  />{" "}
                  {team.OrganHead_FullName}
                </Typography>

                <Typography
                  variant="body2"
                  display="flex"
                  alignItems="center"
                  gutterBottom
                >
                  <EmailIcon
                    fontSize="small"
                    sx={{ ml: 1, color: "#2e7d32" }}
                  />{" "}
                  {team.OrganHead_Email}
                </Typography>

                <Typography
                  variant="body2"
                  display="flex"
                  alignItems="center"
                  gutterBottom
                >
                  <PhoneIcon
                    fontSize="small"
                    sx={{ ml: 1, color: "#2e7d32" }}
                  />{" "}
                  {team.OrganHead_Number}
                </Typography>

                <Typography variant="body2" display="flex" alignItems="center">
                  <LocationOnIcon
                    fontSize="small"
                    sx={{ ml: 1, color: "#2e7d32" }}
                  />
                  {team.CityName}، {team.ProvinceName}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography textAlign="center" color="text.secondary">
              تیمی برای این گزارش ثبت نشده است.
            </Typography>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setTeamsDialogOpen(false)}
            variant="contained"
            color="success"
          >
            بستن
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
      >
        <DialogTitle>آیا مطمئن هستید؟</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)} color="primary">
            خیر
          </Button>
          <Button onClick={confirmDeleteHandler} color="error">
            بله، حذف کن
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={editTeamOpen}
        onClose={() => setEditTeamOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>ویرایش تیم</DialogTitle>
        <DialogContent>
          <TextField
            label="نام مسئول"
            value={selectedTeam?.OrganHead_FullName || ""}
            onChange={(e) =>
              setSelectedTeam({
                ...selectedTeam,
                OrganHead_FullName: e.target.value,
              })
            }
            fullWidth
            margin="normal"
          />

          <TextField
            label="ایمیل"
            value={selectedTeam?.OrganHead_Email || ""}
            onChange={(e) =>
              setSelectedTeam({
                ...selectedTeam,
                OrganHead_Email: e.target.value,
              })
            }
            fullWidth
            margin="normal"
          />

          <TextField
            label="شماره تماس"
            value={selectedTeam?.OrganHead_Number || ""}
            onChange={(e) =>
              setSelectedTeam({
                ...selectedTeam,
                OrganHead_Number: e.target.value,
              })
            }
            fullWidth
            margin="normal"
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>نوع سازمان</InputLabel>
            <Select
              value={selectedTeam?.Type || ""}
              onChange={(e) =>
                setSelectedTeam({ ...selectedTeam, Type: e.target.value })
              }
              label="نوع سازمان"
            >
              <MenuItem value="Water">آب</MenuItem>
              <MenuItem value="Waste">پسماند</MenuItem>
              <MenuItem value="Gas">گاز</MenuItem>
              <MenuItem value="Electricity">برق</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>استان</InputLabel>
            <Select
              value={editedProvince?.Name || ""}
              onChange={(e) =>
                setEditedProvince(
                  provinces.find((p) => p.Name === e.target.value)
                )
              }
              label="استان"
            >
              {provinces.map((province) => (
                <MenuItem key={province.id} value={province.Name}>
                  {province.Name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>شهر</InputLabel>
            <Select
              value={editedCity?.Name || ""}
              onChange={(e) =>
                setEditedCity(cities.find((c) => c.Name === e.target.value))
              }
              label="شهر"
            >
              {cities.map((city) => (
                <MenuItem key={city.id} value={city.Name}>
                  {city.Name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setEditTeamOpen(false)} color="error">
            بستن
          </Button>
          <Button onClick={handleEditSubmit} color="success">
            ثبت ویرایش
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
