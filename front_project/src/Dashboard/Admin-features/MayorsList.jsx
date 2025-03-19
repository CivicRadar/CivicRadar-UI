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
const MayorsList = () => {
  const [mayors, setMayors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [cities, setcities] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedcities, setSelectedcities] = useState([]);
  const [selectedMayor, setSelectedMayor] = useState({
    id: "",
    FullName: "",
    Email: "",
    Password: "",
    cities: [],
  });

  const fetchMayors = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/mayor-registry/mayor-complex-list/", {
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

  const handleDelete = async (id) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/mayor-registry/delete/", {
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
  };

  const handleEditClick = (mayor) => {
    // Find the mayor in the mayors list by ID
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

  const handleAddCity = async (city) => {
    console.log(selectedMayor.id);
    console.log(city.id);
    try {
      const response = await fetch("http://127.0.0.1:8000/mayor-registry/add-mayor-city/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          MayorID: selectedMayor.id,
          CityID: city.id,
        }),
      });

      if (!response.ok) {
        throw new Error("خطا در افزودن شهر به مسئول");
      }

      setSelectedcities((prevcities) => [...prevcities, city]);
      alert("شهر با موفقیت اضافه شد");
    } catch (error) {
      alert(`خطا در افزودن شهر: ${error.message}`);
    }
  };

  const handleRemoveCity = async (city) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/mayor-registry/remove-mayor-city/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          MayorID: selectedMayor.id,
          CityID: city.id, // Use city id for deletion
        }),
      });
  
      if (!response.ok) {
        throw new Error("خطا در حذف شهر از مسئول");
      }
  
      setSelectedcities((prevcities) => prevcities.filter((c) => c.id !== city.id)); // Update state to remove city
      alert("شهر با موفقیت حذف شد");
    } catch (error) {
      alert(`خطا در حذف شهر: ${error.message}`);
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
    { field: "FullName", headerName: "نام و نام خانوادگی", flex: 2, headerAlign: "right" },
    { field: "Email", headerName: "ایمیل", flex: 1, headerAlign: "right" },
    {
      field: "cities",
      headerName: "شهرها",
      flex: 2,
      headerAlign: "right",
      renderCell: (params) => (
        <Typography variant="body2">{params.row.cities}</Typography>
      ),
    },
    {
      field: "LastCooperation",
      headerName: "آخرین همکاری",
      flex: 1,
      headerAlign: "right",
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value ? new Date(params.value).toLocaleDateString() : "N/A"}
        </Typography>
      ),
    },
    {
      field: "MonthlyReportCheck",
      headerName: "گزارش ماهانه بررسی",
      flex: 1,
      headerAlign: "right",
      renderCell: (params) => (
        <Typography variant="body2">{params.value || 0}</Typography>
      ),
    },
    {
      field: "MonthlyReportCheckPercentage",
      headerName: "درصد بررسی گزارش ماهانه",
      flex: 1,
      headerAlign: "right",
      renderCell: (params) => (
        <Typography variant="body2">
          {`${params.value || 0}%`}
        </Typography>
      ),
    },
    {
      field: "MaximumMonthlyReportCheck",
      headerName: "حداکثر بررسی گزارش ماهانه",
      flex: 1,
      headerAlign: "right",
      renderCell: (params) => (
        <Typography variant="body2">{params.value || "N/A"}</Typography>
      ),
    },
    {
      field: "Actions",
      headerName: "عملیات",
      flex: 0.5, // Thinner column for actions
      minWidth: 50,
      headerAlign: "right",
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: "8px" }}>
          <DeleteIcon
            sx={{ color: "black", cursor: "pointer", "&:hover": { color: "#005a24" } }}
            onClick={() => handleDelete(params.row.id)}
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
        variant="h5"
        gutterBottom
        sx={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "30px" }}
      >
        <EngineeringIcon sx={{ color: "green" }} />
        <FormatListBulletedIcon sx={{ color: "green" }} />
        لیست مسئولین ثبت‌شده
      </Typography>

      <Box sx={{ height: 400, width: "86%", backgroundColor: "white", boxShadow: "0 0 20px 4px #005a24", borderRadius: "12px" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={17}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          sx={{
            direction: "rtl",
            "& .MuiDataGrid-columnHeaders": { backgroundColor: "#f5f5f5", justifyContent: "flex-end", textAlign: "right" },
            "& .MuiDataGrid-columnHeaderTitle": { justifyContent: "flex-end", textAlign: "right" },
            "& .MuiDataGrid-cell": { textAlign: "right" },
          }}
        />
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
          ویرایش مسئول
        </DialogTitle>
        <DialogContent>
          <TextField
            label="نام و نام خانوادگی"
            Name="FullName"
            fullWidth
            margin="dense"
            value={selectedMayor.FullName}
            onChange={handleInputChange}
          />
          <TextField
            label="ایمیل"
            Name="Email"
            fullWidth
            margin="dense"
            value={selectedMayor.Email}
            onChange={handleInputChange}
          />
          <TextField
            label="رمز عبور جدید"
            Name="Password"
            type="Password"
            fullWidth
            margin="dense"
            value={selectedMayor.Password}
            onChange={handleInputChange}
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
            onClick={fetchMayors}
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
    </Box>
  );
};

export default MayorsList;