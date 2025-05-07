import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import EngineeringIcon from "@mui/icons-material/Engineering";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Autocomplete from "@mui/material/Autocomplete";
import { getProvince, getCity } from "../../services/admin-api";
import IconButton from "@mui/material/IconButton";
import { gridClasses } from '@mui/x-data-grid';
import { grey } from '@mui/material/colors';
// import moment from 'moment';
import Swal from "sweetalert2";
import moment from "moment-jalaali";
moment.loadPersian({ dialect: "persian-modern", usePersianDigits: true });


const faIR = {
  // Root
  noRowsLabel: 'سطری موجود نیست',
  noResultsOverlayLabel: 'نتیجه‌ای یافت نشد.',
  
  // Density selector toolbar button text
  toolbarDensity: 'تراکم',
  toolbarDensityLabel: 'تراکم',
  toolbarDensityCompact: 'فشرده',
  toolbarDensityStandard: 'استاندارد',
  toolbarDensityComfortable: 'راحت',

  // Columns selector toolbar button text
  toolbarColumns: 'ستون‌ها',
  toolbarColumnsLabel: 'ستون‌ها را انتخاب کنید',

  // Filters toolbar button text
  toolbarFilters: 'فیلترها',
  toolbarFiltersLabel: 'نمایش فیلترها',
  toolbarFiltersTooltipHide: 'مخفی کردن فیلترها',
  toolbarFiltersTooltipShow: 'نمایش فیلترها',
  toolbarFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} فیلتر فعال` : `${count} فیلتر فعال`,

  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: 'جستجو...',
  toolbarQuickFilterLabel: 'جستجو',
  toolbarQuickFilterDeleteIconLabel: 'پاک کردن',

  // Export selector toolbar button text
  toolbarExport: 'خروجی',
  toolbarExportLabel: 'خروجی',
  toolbarExportCSV: 'دانلود CSV',
  toolbarExportPrint: 'چاپ',

  // Columns panel text
  columnsPanelTextFieldLabel: 'پیدا کردن ستون',
  columnsPanelTextFieldPlaceholder: 'عنوان ستون',
  columnsPanelDragIconLabel: 'جابجایی ستون',
  columnsPanelShowAllButton: 'نمایش همه',
  columnsPanelHideAllButton: 'مخفی کردن همه',

  // Filter panel text
  filterPanelAddFilter: 'افزودن فیلتر',
  filterPanelDeleteIconLabel: 'حذف',
  filterPanelOperators: 'عملگرها',
  filterPanelOperatorAnd: 'و',
  filterPanelOperatorOr: 'یا',
  filterPanelColumns: 'ستون‌ها',
  filterPanelInputLabel: 'مقدار',
  filterPanelInputPlaceholder: 'مقدار فیلتر',

  // Filter operators text
  filterOperatorContains: 'شامل',
  filterOperatorEquals: 'مساوی',
  filterOperatorStartsWith: 'شروع با',
  filterOperatorEndsWith: 'پایان با',
  filterOperatorIs: 'هست',
  filterOperatorNot: 'نیست',
  filterOperatorAfter: 'بعد از',
  filterOperatorOnOrAfter: 'در یا بعد از',
  filterOperatorBefore: 'قبل از',
  filterOperatorOnOrBefore: 'در یا قبل از',
  filterOperatorIsEmpty: 'خالی است',
  filterOperatorIsNotEmpty: 'خالی نیست',

  // Filter values text
  filterValueAny: 'هر',
  filterValueTrue: 'صحیح',
  filterValueFalse: 'غلط',

  // Column menu text
  columnMenuLabel: 'منو',
  columnMenuShowColumns: 'نمایش ستون‌ها',
  columnMenuFilter: 'فیلتر',
  columnMenuHide: 'مخفی',
  columnMenuUnsort: 'حذف مرتب‌سازی',
  columnMenuSortAsc: 'مرتب‌سازی صعودی',
  columnMenuSortDesc: 'مرتب‌سازی نزولی',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} فیلتر فعال` : `${count} فیلتر فعال`,
  columnHeaderFiltersLabel: 'نمایش فیلترها',
  columnHeaderSortIconLabel: 'مرتب‌سازی',

  // Rows selected footer text
  footerRowSelected: (count) =>
    count !== 1
      ? `${count.toLocaleString()} سطر انتخاب شده`
      : `${count.toLocaleString()} سطر انتخاب شده`,

  // Total row amount footer text
  footerTotalRows: 'تعداد کل سطرها:',

  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} از ${totalCount.toLocaleString()}`,

  // Pagination text
  MuiTablePagination: {
    labelRowsPerPage: 'تعداد سطر در هر صفحه:',
    labelDisplayedRows: ({ from, to, count }) =>
      `${from}-${to} از ${count !== -1 ? count : `بیش از ${to}`}`,
  }
};
const MayorsList = () => {
  const [mayors, setMayors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedcities, setSelectedcities] = useState([]);
  const [cities, setcities] = useState([]);
  const [citiesToAdd, setcitiesToAdd] = useState([]);
  const [citiesToRemove, setcitiesToRemove] = useState([]);
  const [selectedMayor, setSelectedMayor] = useState({
    id: "",
    FullName: "",
    Email: "",
    Password: "",
    cities: [],
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // Controls the warning dialog
  const [mayorToDelete, setMayorToDelete] = useState(null); // Tracks the mayor selected for deletion
  const [pageSize, setPageSize] = useState(5);
  const [rowId, setRowId] = useState(null);
  const fetchMayors = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/mayor-registry/mayor-complex-list/`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("خطا در دریافت اطلاعات مسئولین");
      }

      const data = await response.json();
      setMayors(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteIconClick = (id) => {
    setMayorToDelete(id); // Set the mayor to delete
    setDeleteDialogOpen(true); // Open confirmation dialog
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/mayor-registry/delete/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error("خطا در حذف مسئول");
      }

      setMayors((prevMayors) => prevMayors.filter((mayor) => mayor.id !== id));
      Swal.fire({
        icon: "success",
        title: "حذف موفق",
        text: "مسئول با موفقیت حذف شد ✅",
        confirmButtonText: "باشه",
        customClass: {
          confirmButton: 'swal-confirm-btn',
          title: 'swal-title',
        }
      });
      
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "خطا",
        text: `حذف با خطا مواجه شد ❌: ${err.message}`,
        confirmButtonText: "باشه",
        customClass: {
          confirmButton: 'swal-confirm-btn',
          title: 'swal-title',
        }
      });
      
    }
    setDeleteDialogOpen(false);
  };

  const handleEditClick = (mayor) => {
    // Find the mayor in the mayors list by ID
    setcitiesToAdd([])
    setcitiesToRemove([])
    const selectedMayorFromList = mayors.find((m) => m.id === mayor.id);
  
    if (selectedMayorFromList) {
      setSelectedMayor({
        id: selectedMayorFromList.id,
        FullName: selectedMayorFromList.FullName,
        Email: selectedMayorFromList.Email,
        Password: "", // Password remains empty for editing
        cities: selectedMayorFromList.cities || [], // Use cities directly from the found mayor object
      });
      setSelectedcities(selectedMayorFromList.cities || []); // Keep cities intact for adding/removing
      setOpen(true);
    } else {
      Swal.fire({
        icon: "error",
        title: "خطا",
        text: "مسئول موردنظر یافت نشد ❌",
        confirmButtonText: "باشه",
        customClass: {
          confirmButton: 'swal-confirm-btn',
          title: 'swal-title',
        }
      });
      
    }
  };
  

  const handleInputChange = (e) => {
    setSelectedMayor({ ...selectedMayor, [e.target.Name]: e.target.value });
  };

  const handleAddCity = (city) => {
    // Avoid duplicates: check if the city is already in selectedcities or citiesToAdd
    if (
      !selectedcities.some((c) => c.id === city.id) &&
      !citiesToAdd.some((c) => c.id === city.id)
    ) {
      setcitiesToAdd([...citiesToAdd, city]); // Add to citiesToAdd
      setSelectedcities([...selectedcities, city]); // Update UI
    }
  };
  const handleRemoveCity = (city) => {
    // Check if the city is in citiesToAdd (i.e., undo the add action)
    if (citiesToAdd.some((c) => c.id === city.id)) {
      setcitiesToAdd(citiesToAdd.filter((c) => c.id !== city.id)); // Remove from citiesToAdd
    } else {
      setcitiesToRemove([...citiesToRemove, city]); // Add to citiesToRemove
    }
  
    // Update the UI
    setSelectedcities(selectedcities.filter((c) => c.id !== city.id));
  };
    
  const handleUpdate = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/mayor-registry/update/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          id: selectedMayor.id,
          FullName: selectedMayor.FullName,
          Email: selectedMayor.Email,
          Password: selectedMayor.Password,
        }),
      });
  
      if (!response.ok) {
        throw new Error("خطا در به‌روزرسانی اطلاعات مسئول");
      }
     // Handle additions
      for (const city of citiesToAdd) {
        await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/mayor-registry/add-mayor-city/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            MayorID: selectedMayor.id,
            CityID: city.id,
          }),
        });
      }
  
      // Handle removals
      for (const city of citiesToRemove) {
        await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/mayor-registry/remove-mayor-city/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            MayorID: selectedMayor.id,
            CityID: city.id,
          }),
        });
      }
  
      Swal.fire({
        icon: "success",
        title: "بروزرسانی موفق",
        text: "اطلاعات مسئول با موفقیت ذخیره شد ✅",
        confirmButtonText: "باشه",
        customClass: {
          confirmButton: 'swal-confirm-btn',
          title: 'swal-title',
        }
      });
      
      setOpen(false); // Close the dialog
      fetchMayors(); // Refresh the list
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "خطا در بروزرسانی",
        text: `${error.message} ❌`,
        confirmButtonText: "باشه",
        customClass: {
          confirmButton: 'swal-confirm-btn',
          title: 'swal-title',
        }
      });
      
    }
  };
  

  const handleProvinceChange = async (event, newValue) => {
    setSelectedProvince(newValue);
    if (newValue) {
      try {
        const data = await getCity(newValue.id);
        setcities(data);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "خطا",
          text: "دریافت اطلاعات شهرها با خطا مواجه شد ❌",
          confirmButtonText: "باشه",
          customClass: {
            confirmButton: 'swal-confirm-btn',
            title: 'swal-title',
          }
        });
              }
    } else {
      setcities([]);
    }
  };

  useEffect(() => {
    fetchMayors();
  }, []);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const data = await getProvince();
        setProvinces(data);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "خطا",
          text: "دریافت اطلاعات استان‌ها با خطا مواجه شد ❌",
          confirmButtonText: "باشه",
          customClass: {
            confirmButton: 'swal-confirm-btn',
            title: 'swal-title',
          }
        });
              }
    };

    fetchProvinces();
  }, []);

  const columns = [
    { 
      field: "FullName", 
      headerName: "نام و نام خانوادگی", 
      width: 180,
      headerAlign: 'center', // 🔥 این کلیدیه
      editable: false,
    },
    { 
      field: "Email", 
      headerName: "ایمیل", 
      width: 200,
      headerAlign: 'center', // 🔥 این کلیدیه
      editable: false,
    },
    {
      field: "cities",
      headerName: "شهرها",
      width: 250,
      headerAlign: 'center', // 🔥 این کلیدیه
      editable: false,
    },
    {
      field: "LastCooperation",
      headerName: "آخرین همکاری",
      width: 230,
      headerAlign: 'center', // 🔥 این کلیدیه
      editable: false,
      renderCell: (params) => {
        const date = params.row.LastCooperation;
      
        if (!date || date === "N/A") return "بدون همکاری";
      
        const formatted = moment(date)
          .local()
          .format("jD jMMMM jYYYY، ساعت HH:mm");
          
        return formatted;
      }
      
    },
    {
      field: "MonthlyReportCheck",
      headerName: "گزارش ماهانه",
      width: 130,
      headerAlign: 'center', // 🔥 این کلیدیه
      editable: false,
    },
    {
      field: "Actions",
      headerName: "عملیات",
      type: 'actions',
      width: 100,
      headerAlign: 'center', // 🔥 این کلیدیه
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: "8px" }}>
          <DeleteIcon
            sx={{ color: "black", cursor: "pointer", "&:hover": { color: "#005a24" } }}
            onClick={() => handleDeleteIconClick(params.row.id)}
          />
          <EditIcon
            sx={{ color: "black", cursor: "pointer", "&:hover": { color: "#005a24" } }}
            onClick={() => handleEditClick(params.row)}
          />
        </Box>
      ),
    },
  ];
  

  const rows = mayors.map((mayor) => {
    return {
      id: mayor.id,
      FullName: mayor.FullName,
      Email: mayor.Email,
      cities: mayor.cities ? mayor.cities.map((city) => city.Name).join(", ") : "", // Display city names
      LastCooperation: mayor.LastCooperation || "N/A", // Default to "N/A" if null
      MonthlyReportCheck: mayor.monthly_report_check || 0, // Default to 0
      MonthlyReportCheckPercentage: mayor.monthly_report_check_percentage || 0, // Default to 0
      MaximumMonthlyReportCheck: mayor.maximum_monthly_report_check || "N/A", // Default to "N/A" if null
    };
  });
  

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={4}  width="100%">
      <Typography
        variant="h3"
        component="h3"
        sx={{ 
          textAlign: 'center', 
          mt: 3, 
          mb: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingLeft: { xs: '60px', sm: 0 }, // Add padding to the right for mobile

          gap: "10px",
          fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem' }, // استایل ریسپانسیو برای تایتل
          flexWrap: { xs: 'wrap', sm: 'nowrap' } // در موبایل آیکون‌ها و متن در خط جدید قرار بگیرند
        }}
      >
        <EngineeringIcon sx={{ color: "green" }} />
        <FormatListBulletedIcon sx={{ color: "green" }} />
        لیست مسئولین ثبت‌شده
      </Typography>
      <Box 
      sx={{ 
        width: '90%',
        overflow: 'auto', // اضافه کردن اسکرول افقی
        maxWidth: '100vw', // حداکثر عرض برابر با عرض ویوپورت
        '&::-webkit-scrollbar': {
          height: '8px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0,90,36,0.5)',
          borderRadius: '4px',
        }
      }}
    >
       <Box sx={{ 
        minWidth: { xs: '800px', sm: '100%' , md: '100%'  }, 
      }}>

      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row) => row.id}
        rowsPerPageOptions={[5, 10, 20]}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        getRowSpacing={(params) => ({
          top: params.isFirstVisible ? 0 : 5,
          bottom: params.isLastVisible ? 0 : 5,
        })}
        autoHeight 
        sx={{
          direction: "rtl",
          border: 'none',
          [`& .${gridClasses.row}`]: {
            bgcolor: (theme) =>
              theme.palette.mode === 'light' ? grey[200] : grey[900],
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: "#f5f5f5",
            borderBottom: '2px solid #005a24',
            fontSize: { xs: '0.9rem', md: '1rem' },
            fontWeight: 'bold',
          },
          '& .MuiDataGrid-columnHeader': {
            justifyContent: 'center', // متن سرستون رو وسط چین کن
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 'bold',
            textAlign: 'center',
            width: '100%',
            display: 'block', // مهم! این باعث میشه متن واقعا وسط بیفته
          },
          '& .MuiDataGrid-cell': {
            textAlign: 'right',
            direction: 'rtl',
            fontSize: { xs: '0.8rem', md: '0.9rem' },
            padding: '10px',
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: '1px solid rgba(224, 224, 224, 1)',
            fontSize: { xs: '0.8rem', md: '0.9rem' },
          },
          '& .MuiTablePagination-root': {
            fontSize: { xs: '0.8rem', md: '0.9rem' },
          },
        }}
        onCellEditCommit={(params) => setRowId(params.id)}
        localeText={faIR}
      />
      </Box>
  </Box>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth   maxWidth="sm" >
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
          ویرایش مسئول
        </DialogTitle>
        <DialogContent>
        <TextField
          label="نام و نام خانوادگی"
          name="FullName"
          fullWidth
          margin="dense"
          value={selectedMayor.FullName} // Bind to selectedMayor state
          onChange={(e) =>
            setSelectedMayor((prev) => ({
              ...prev,
              FullName: e.target.value, // Update FullName in state
            }))
          }
          sx={{
            direction: 'rtl',
            '& input': {
              textAlign: 'right',
            },
            '& label': {
              right: 54,
              left: 'auto',
              transformOrigin: 'top right',
            },
            '& .MuiInputLabel-shrink': {
              right: 30,
              left: 'auto',
              transformOrigin: 'top right',
            },
            '& legend': {
              textAlign: 'right',
            },
            '& .MuiOutlinedInput-root': {
              justifyContent: 'flex-end',
            },
            '& .MuiSvgIcon-root': {
              left: 12,
              right: 'auto',
            },
          }}
        />

        {/* Email Field */}
        <TextField
          label="ایمیل"
          name="Email"
          fullWidth
          margin="dense"
          value={selectedMayor.Email} // Bind to selectedMayor state
          onChange={(e) =>
            setSelectedMayor((prev) => ({
              ...prev,
              Email: e.target.value, // Update Email in state
            }))
          }
          sx={{
            direction: 'rtl',
            '& input': {
              textAlign: 'right',
            },
            '& label': {
              right: 54,
              left: 'auto',
              transformOrigin: 'top right',
            },
            '& .MuiInputLabel-shrink': {
              right: 30,
              left: 'auto',
              transformOrigin: 'top right',
            },
            '& legend': {
              textAlign: 'right',
            },
            '& .MuiOutlinedInput-root': {
              justifyContent: 'flex-end',
            },
            '& .MuiSvgIcon-root': {
              left: 12,
              right: 'auto',
            },
          }}
        />
        {/* Password Field */}
        <TextField
          label="رمز عبور جدید"
          name="Password"
          type="password"
          fullWidth
          margin="dense"
          value={selectedMayor.Password} // Bind to selectedMayor state
          onChange={(e) =>
            setSelectedMayor((prev) => ({
              ...prev,
              Password: e.target.value, // Update Password in state
            }))
          }
          sx={{
            direction: 'rtl',
            '& input': {
              textAlign: 'right',
            },
            '& label': {
              right: 54,
              left: 'auto',
              transformOrigin: 'top right',
            },
            '& .MuiInputLabel-shrink': {
              right: 30,
              left: 'auto',
              transformOrigin: 'top right',
            },
            '& legend': {
              textAlign: 'right',
            },
            '& .MuiOutlinedInput-root': {
              justifyContent: 'flex-end',
            },
            '& .MuiSvgIcon-root': {
              left: 12,
              right: 'auto',
            },
          }}
        />
          {/* Current cities */}
          <Typography variant="body2" sx={{ marginTop: "10px", textAlign: 'right' }}>:
  شهرهای فعلی
</Typography>

<Box
  display="flex"
  flexWrap="wrap"
  gap="8px"
  justifyContent="flex-end" // راست‌چین کل باکس‌ها
  sx={{ marginTop: "8px" }}
  mb={1}
>
  {selectedcities.map((city) => (
    <Box
      key={city.id}
      sx={{
        display: "flex",
        flexDirection: "row-reverse", // آیکون حذف در سمت چپ قرار می‌گیرد
        alignItems: "center",
        gap: "6px",
        padding: "4px 8px",
        backgroundColor: "#f5f5f5",
        borderRadius: "20px",
      }}
    >
      <Typography
        variant="body2"
        sx={{ fontWeight: "bold" }}
      >
        {city.Name}
      </Typography>
      <IconButton
        onClick={() => handleRemoveCity(city)}
        size="small"
        sx={{
          color: "red",
          "&:hover": {
            backgroundColor: "#ffe5e5",
          },
        }}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Box>
  ))}
</Box>

          {/* Province Dropdown */}
          <Autocomplete
            options={provinces}
            getOptionLabel={(option) => option.Name}
            value={selectedProvince}
            onChange={handleProvinceChange}
            renderInput={(params) => (
              <TextField {...params} label="استان" fullWidth margin="dense" 
              sx={{
                direction: 'rtl',
                '& input': {
                  textAlign: 'right',
                },
                '& label': {
                  right: 54,
                  left: 'auto',
                  transformOrigin: 'top right',
                },
                '& .MuiInputLabel-shrink': {
                  right: 30,
                  left: 'auto',
                  transformOrigin: 'top right',
                },
                '& legend': {
                  textAlign: 'right',
                },
                '& .MuiOutlinedInput-root': {
                  justifyContent: 'flex-end',
                },
                '& .MuiSvgIcon-root': {
                  left: 12,
                  right: 'auto',
                },
              }}/>
            )}
          />

          {/* cities Dropdown */}
          <Autocomplete
            options={cities}
            getOptionLabel={(option) => option.Name} // Use city.Name for dropdown
            value={null} // Reset after each add
            onChange={(event, newCity) => {
              if (newCity) handleAddCity(newCity);
            }}
            renderInput={(params) => (
              <TextField {...params} label="افزودن شهر جدید" fullWidth margin="dense"sx={{
                direction: 'rtl',
                '& input': {
                  textAlign: 'right',
                },
                '& label': {
                  right: 54,
                  left: 'auto',
                  transformOrigin: 'top right',
                },
                '& .MuiInputLabel-shrink': {
                  right: 30,
                  left: 'auto',
                  transformOrigin: 'top right',
                },
                '& legend': {
                  textAlign: 'right',
                },
                '& .MuiOutlinedInput-root': {
                  justifyContent: 'flex-end',
                },
                '& .MuiSvgIcon-root': {
                  left: 12,
                  right: 'auto',
                },
              }}/>
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpen(false)}
            sx={{ color: "#005a24", fontWeight: "bold" }}
          >
            لغو
          </Button>
          <Button
            onClick={handleUpdate}
            sx={{
              backgroundColor: "#005a24",
              color: "white",
              "&:hover": { backgroundColor: "#003d19" },
            }}
            variant="contained"
          >
            ذخیره
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)} // Close dialog if user cancels
        fullWidth
        maxWidth="xs" // تنظیم حداکثر عرض دیالوگ برای هشدار
      >
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
          هشدار
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            آیا مطمئن هستید که می‌خواهید مسئول را حذف کنید؟
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)} // Close dialog without deleting
            sx={{ color: "gray", fontWeight: "bold" }}
          >
            لغو
          </Button>
          <Button
            onClick={() => handleDelete(mayorToDelete)} // Proceed with deletion
            sx={{
              backgroundColor: "red",
              color: "white",
              "&:hover": { backgroundColor: "#cc0000" },
            }}
            variant="contained"
          >
            حذف
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MayorsList;