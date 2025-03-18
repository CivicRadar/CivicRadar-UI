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

const MayorsList = () => {
  const [mayors, setMayors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedMayor, setSelectedMayor] = useState({
    id: "",
    FullName: "",
    Email: "",
    Password: "",
  });

  const fetchMayors = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/mayor-registry/list/", {
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

  useEffect(() => {
    fetchMayors();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/mayor-registry/delete/`, {
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
    setSelectedMayor({
      id: mayor.id,
      FullName: `${mayor.FirstName} ${mayor.LastName}`,
      Email: mayor.Email,
      Password: "",
    });
    setOpen(true);
  };

  const handleInputChange = (e) => {
    setSelectedMayor({ ...selectedMayor, [e.target.name]: e.target.value });
  };

const handleUpdate = async () => {
  // Validate FullName field
  if (!selectedMayor.FullName.includes(" ") || selectedMayor.FullName.trim().split(" ").length < 2) {
    alert("نام و نام خانوادگی باید شامل دو بخش باشد");
    return; // Stop execution if validation fails
  }

  try {
    const response = await fetch("http://127.0.0.1:8000/mayor-registry/update/", {
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
      throw new Error("خطا در ویرایش اطلاعات مسئول");
    }

    alert("اطلاعات مسئول با موفقیت ویرایش شد");
    setOpen(false);
    fetchMayors();
  } catch (err) {
    alert(`خطا در ویرایش: ${err.message}`);
  }
};


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

  const columns = [
    { field: "FirstName", headerName: "نام", flex: 1, headerAlign: "right" },
    { field: "LastName", headerName: "نام خانوادگی", flex: 1, headerAlign: "right" },
    { field: "Email", headerName: "ایمیل", flex: 1, headerAlign: "right" },
    {
      field: "Actions",
      headerName: "عملیات",
      flex: 1,
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
    const [firstName, lastName] = mayor.FullName.split(" ");
    return {
      id: mayor.id,
      FirstName: firstName || "",
      LastName: lastName || "",
      Email: mayor.Email,
    };
  });

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

      {/* Dialog برای ویرایش اطلاعات */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle
          sx={{
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          ویرایش مسئول
        </DialogTitle>
        <DialogContent>
          <TextField label="نام و نام خانوادگی" name="FullName" fullWidth margin="dense" value={selectedMayor.FullName} onChange={handleInputChange} />
          <TextField label="ایمیل" name="Email" fullWidth margin="dense" value={selectedMayor.Email} onChange={handleInputChange} />
          <TextField label="رمز عبور جدید" name="Password" type="Password" fullWidth margin="dense" value={selectedMayor.Password} onChange={handleInputChange} />
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
    </Box>
  );
};

export default MayorsList;
