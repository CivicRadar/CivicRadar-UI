import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  FormLabel,
  FormGroup,
  Autocomplete,
  Grid,
} from "@mui/material";
import Swal from "sweetalert2";
import { getCity, getProvince } from "../services/admin-api";

// تابع اعتبارسنجی ایمیل
const isValidEmail = (email) => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase());
};

const TeamRegistrationForm = () => {
  const [provinces, setProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);

  const [formData, setFormData] = useState({
    Type: "",
    OrganHead_FullName: "",
    OrganHead_Email: "",
    OrganHead_Number: "",
  });
  const typeOptions = [
    { label: "آب", value: "Water" },
    { label: "پسماند", value: "Waste" },
    { label: "گاز", value: "Gas" },
    { label: "برق", value: "Electricity" },
  ];

  const [errors, setErrors] = useState({});

  useEffect(() => {
    getProvince().then(setProvinces).catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      getCity(selectedProvince.id)
        .then(setCities)
        .catch(console.error);
    } else {
      setCities([]);
    }
  }, [selectedProvince]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate required fields
    if (!formData.OrganHead_FullName) newErrors.OrganHead_FullName = "لطفاً نام مسئول را وارد کنید";
    if (!formData.OrganHead_Email) newErrors.OrganHead_Email = "لطفاً ایمیل مسئول را وارد کنید";
    if (!isValidEmail(formData.OrganHead_Email)) newErrors.OrganHead_Email = "ایمیل وارد شده معتبر نیست";
    if (!formData.OrganHead_Number) newErrors.OrganHead_Number = "لطفاً شماره تماس مسئول را وارد کنید";
    if (!formData.Type) newErrors.Type = "لطفاً نوع سازمان را انتخاب کنید";
    if (!selectedCity) newErrors.city = "لطفاً یک شهر انتخاب کنید";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return; // If validation fails, stop the form submission
    }

    const payload = {
      CityID: selectedCity.id,
      ...formData,
    };

    try {
      const res = await fetch(
        `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/supervise/mayor-delegate/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
        const data = await res.json();
        Swal.fire({
          icon: "success",
          title: "تیم با موفقیت ثبت شد",
          text: `نام مسئول: ${data.OrganHead_FullName}`,
        });
        setFormData({
          Type: "",
          OrganHead_FullName: "",
          OrganHead_Email: "",
          OrganHead_Number: "",
        });
        setSelectedCity(null);
        setSelectedProvince(null);
      } else {
        const errorData = await res.json(); // Get the error details from the response
        console.log(errorData);
        console.error("Server Error:", errorData);
        throw new Error(errorData.detail || "خطای غیرمنتظره در سمت سرور");
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "خطا در ثبت تیم",
        text: err.message,
      });
    }
  };

  const handleReset = () => {
    setFormData({
      Type: "",
      OrganHead_FullName: "",
      OrganHead_Email: "",
      OrganHead_Number: "",
    });
    setSelectedCity(null);
    setSelectedProvince(null);
    setErrors({});
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 3, maxWidth: 600, mx: "auto", boxShadow: 2, borderRadius: 2, bgcolor: "background.paper" }}>
      <Typography variant="h6" mb={2} sx={{ fontWeight: "bold", color: "#2E3B55" }}>ثبت تیم جدید</Typography>

      <FormGroup>
        <FormLabel sx={{ fontWeight: "bold", color: "#2E3B55" }}>نام و اطلاعات مسئول</FormLabel>
        <TextField
          label="نام مسئول"
          name="OrganHead_FullName"
          value={formData.OrganHead_FullName}
          onChange={handleChange}
          fullWidth
          margin="normal"
          sx={{ borderRadius: 2 }}
          error={!!errors.OrganHead_FullName}
          helperText={errors.OrganHead_FullName}
        />
        <TextField
          label="ایمیل"
          name="OrganHead_Email"
          value={formData.OrganHead_Email}
          onChange={handleChange}
          fullWidth
          margin="normal"
          sx={{ borderRadius: 2 }}
          error={!!errors.OrganHead_Email}
          helperText={errors.OrganHead_Email}
        />
        <TextField
          label="شماره تماس"
          name="OrganHead_Number"
          value={formData.OrganHead_Number}
          onChange={handleChange}
          fullWidth
          margin="normal"
          sx={{ borderRadius: 2 }}
          error={!!errors.OrganHead_Number}
          helperText={errors.OrganHead_Number}
        />

        <Autocomplete
          options={typeOptions}
          getOptionLabel={(option) => option.label}
          value={typeOptions.find(opt => opt.value === formData.Type) || null}
          onChange={(e, val) => {
            setFormData((prev) => ({
              ...prev,
              Type: val ? val.value : "",
            }));
          }}
          renderInput={(params) => (
            <TextField {...params} label="نوع سازمان" margin="normal" sx={{ borderRadius: 2 }} error={!!errors.Type} helperText={errors.Type} />
          )}
        />
      </FormGroup>

      <FormGroup>
        <FormLabel sx={{ fontWeight: "bold", color: "#2E3B55" }}>موقعیت جغرافیایی</FormLabel>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              options={provinces}
              getOptionLabel={(option) => option.Name}
              value={selectedProvince}
              onChange={(e, val) => setSelectedProvince(val)}
              renderInput={(params) => <TextField {...params} label="استان" margin="normal" sx={{ borderRadius: 2 }} />}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              options={cities}
              getOptionLabel={(option) => option.Name}
              value={selectedCity}
              onChange={(e, val) => setSelectedCity(val)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="شهر"
                  margin="normal"
                  error={!!errors.city}
                  helperText={errors.city}
                  sx={{ borderRadius: 2 }}
                />
              )}
            />
          </Grid>
        </Grid>
      </FormGroup>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Button type="submit" variant="contained" color="success" fullWidth sx={{ mt: 2, borderRadius: 2 }}>
            ثبت تیم
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button type="button" variant="outlined" color="error" fullWidth sx={{ mt: 2, borderRadius: 2 }} onClick={handleReset}>
            ریست
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TeamRegistrationForm;
