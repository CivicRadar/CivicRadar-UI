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
import moment from 'moment';

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
      alert("مسئول موردنظر با موفقیت حذف شد");
    } catch (err) {
      alert(`خطا در حذف: ${err.message}`);
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
      alert("خطا: مسئول موردنظر یافت نشد");
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
  
      alert("اطلاعات با موفقیت بروزرسانی شد");
      setOpen(false); // Close the dialog
      fetchMayors(); // Refresh the list
    } catch (error) {
      alert(`خطا در بروزرسانی اطلاعات: ${error.message}`);
    }
  };
  

  const handleProvinceChange = async (event, newValue) => {
    setSelectedProvince(newValue);
    if (newValue) {
      try {
        const data = await getCity(newValue.id);
        setcities(data);
      } catch (error) {
        alert("خطا در دریافت شهرها");
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
        alert("خطا در دریافت استان‌ها");
      }
    };

    fetchProvinces();
  }, []);

  const columns = [
    { 
      field: "FullName", 
      headerName: "نام و نام خانوادگی", 
      width: 180,
      editable: false,
    },
    { 
      field: "Email", 
      headerName: "ایمیل", 
      width: 200,
      editable: false,
    },
    {
      field: "cities",
      headerName: "شهرها",
      width: 250,
      editable: false,
    },
    {
      field: "LastCooperation",
      headerName: "آخرین همکاری",
      width: 150,
      editable: false,
      renderCell: (params) =>
        moment(params.row.LastCooperation).format('YYYY-MM-DD'),
    },
    {
      field: "MonthlyReportCheck",
      headerName: "گزارش ماهانه",
      width: 130,
      editable: false,
    },
    {
      field: "Actions",
      headerName: "عملیات",
      type: 'actions',
      width: 100,
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
    <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
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
          gap: "10px",
        }}
      >
        <EngineeringIcon sx={{ color: "green" }} />
        <FormatListBulletedIcon sx={{ color: "green" }} />
        لیست مسئولین ثبت‌شده
      </Typography>

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
            direction: 'rtl',
            fontSize: '1rem',
            fontWeight: 'bold',
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            textAlign: 'right',
            marginRight: '8px',
            width: '100%',
          },
          '& .MuiDataGrid-cell': {
            textAlign: 'right',
            direction: 'rtl',
            fontSize: '0.9rem',
            padding: '10px',
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: '1px solid rgba(224, 224, 224, 1)',
          }
        }}
        onCellEditCommit={(params) => setRowId(params.id)}
        localeText={faIR}
      />

      <Dialog open={open} onClose={() => setOpen(false)}>
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
        />
          {/* Current cities */}
          <Typography variant="body2" sx={{ marginTop: "10px" }}>
            شهرهای فعلی:
          </Typography>
          <Box
            display="flex"
            flexWrap="wrap"
            gap="8px"
            sx={{ marginTop: "8px" }}
          >
            {selectedcities.map((city) => (
              <Box
                key={city.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 8px",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "20px",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: "bold",
                  }}
                >
                  {city.Name} {/* Display city name */}
                </Typography>
                <IconButton
                  onClick={() => handleRemoveCity(city)} // Call the remove function
                  size="small"
                  sx={{
                    color: "red",
                    "&:hover": {
                      backgroundColor: "#ffe5e5",
                    },
                  }}
                >
                  <DeleteIcon fontSize="small" /> {/* Red trash icon */}
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
              <TextField {...params} label="استان" fullWidth margin="dense" />
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
              <TextField {...params} label="افزودن شهر جدید" fullWidth margin="dense" />
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