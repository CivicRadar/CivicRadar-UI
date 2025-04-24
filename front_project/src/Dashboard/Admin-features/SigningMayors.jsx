import React, { useState, useEffect } from 'react';
import { TextField, Button, FormControl, FormGroup, FormLabel, Box, Typography, Autocomplete } from '@mui/material';
import { getCity, getProvince, addMayor } from '../../services/admin-api';
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Swal from "sweetalert2";


const SignUpForm = ({gotoregisted}) => {
  // const [loading, setLoading] = useState(true);
  const [provinces, setProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [cities, setCities] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]); // For multiple cities

  // Form data state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Error messages state
  const [errorMessages, setErrorMessages] = useState({});

  // Password strength validator
  const isStrongPassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[@#$%^&*()!~]/.test(password);

    return (
      minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar
    );
  };

  // Fetch provinces on component mount
  useEffect(() => {
    const fetchProvince = async () => {
      try {
        const response = await getProvince();
        setProvinces(response);
        // setLoading(false);
      } catch (error) {
        console.error("Error fetching Provinces:", error);
      }
    };
    fetchProvince();
  }, []);

  // Fetch cities when a province is selected
  useEffect(() => {
    const fetchCity = async () => {
      try {
        const response = await getCity(selectedProvince?.id);
        setCities(response);
      } catch (error) {
        console.error("Error fetching Cities:", error);
      }
    };
    if (selectedProvince) {
      fetchCity();
    }
  }, [selectedProvince]);

  // Form submission handler with enhanced error handling
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessages({});

    if (selectedCities.length === 0) {
      setErrorMessages((prev) => ({
        ...prev,
        city: "لطفاً حداقل یک شهر انتخاب کنید ❌",
      }));
      return;
    }

    if (fullName.trim() === "") {
      setErrorMessages((prev) => ({
        ...prev,
        fullName: "نام و نام خانوادگی نمی‌تواند خالی باشد ❌",
      }));
      return;
    }

    if (!email.includes("@")) {
      setErrorMessages((prev) => ({
        ...prev,
        email: "فرمت ایمیل نامعتبر است ❌",
      }));
      return;
    }

    if (!isStrongPassword(password)) {
      setErrorMessages((prev) => ({
        ...prev,
        password:
          "رمز عبور باید حداقل ۸ کاراکتر، شامل حروف بزرگ، کوچک، عدد و کاراکتر خاص باشد ❌",
      }));
      return;
    }

    if (!selectedProvince) {
      setErrorMessages((prev) => ({
        ...prev,
        province: "لطفاً استان خود را انتخاب کنید ❌",
      }));
      return;
    }

    const MayorData = {
      FullName: fullName,
      Email: email,
      Password: password,
      cities: selectedCities.map((city) => ({ id: city.id })),
    };

    try {
      const response = await addMayor(MayorData);
      console.log("Form submitted successfully:", response);
      Swal.fire({
        icon: "success",
        title: "ثبت‌نام موفقیت‌آمیز بود",
        text: "اکنون می‌توانید به لیست مسئولین بروید",
        confirmButtonText: "باشه",
        customClass: {
          confirmButton: 'swal-confirm-btn',
          title: 'swal-title',
        }
      });
      
    } catch (error) {
      console.error(
        "Authentication Error:",
        error.response?.data || error.message
      );
      setErrorMessages((prev) => ({
        ...prev,
        email: "فرمت این ایمیل استاندار نیست یا تکراری است ❌",
      }))
    }
  };

  const handleCitySelect = (event, newValue) => {
    if (newValue && !selectedCities.find((city) => city.id === newValue.id)) {
      setSelectedCities((prev) => [...prev, newValue]);
    }
  };

  const handleCityRemove = (id) => {
    setSelectedCities((prev) => prev.filter((city) => city.id !== id));
  };


  const handleProvinceChange = async (event, newValue) => {
    setSelectedProvince(newValue);
    if (newValue) {
      try {
        const data = await getCity(newValue.id);
        setCities(data);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "خطا",
          text: "خطا در دریافت شهرها ❌",
          confirmButtonText: "باشه",
          customClass: {
            confirmButton: 'swal-confirm-btn',
            title: 'swal-title',
          }
        });
        
      }
    } else {
      setCities([]);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Personal Information Section */}
      <Box
        sx={{
          backgroundColor: '#f5f5f5',
          padding: 2,
          marginBottom: 2,
          borderRadius: 1,
        }}
      >
        <FormGroup>
          <FormLabel>اطلاعات شخصی</FormLabel>
          <TextField
            label="نام و نام خانوادگی"
            variant="outlined"
            fullWidth
            margin="normal"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            error={!!errorMessages.fullName}
            helperText={errorMessages.fullName}
          />
          <TextField
            label="ایمیل"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errorMessages.email}
            helperText={errorMessages.email}
          />
          <TextField
            label="رمز عبور"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errorMessages.password}
            helperText={errorMessages.password}
          />
        </FormGroup>
      </Box>

      {/* Province and City Selection */}
      <Box
        sx={{
          backgroundColor: '#f0f0f0',
          padding: 2,
          marginBottom: 2,
          borderRadius: 1,
        }}
      >
        <FormGroup>
        <FormLabel>اطلاعات سازمانی</FormLabel>
          <Autocomplete
            options={provinces}
            getOptionLabel={(option) => option.Name}
            value={selectedProvince}
            onChange={handleProvinceChange}
            helperText={errorMessages.provinces}
            renderInput={(params) => (
              <TextField
                {...params}
                label="استان"
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!errorMessages.province}
                helperText={errorMessages.province}
              />
            )}
          />

          <Autocomplete
            options={cities}
            getOptionLabel={(option) => option.Name}
            onChange={handleCitySelect}
            renderInput={(params) => (
              <TextField
                {...params}
                label="شهر"
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!errorMessages.city}
                helperText={errorMessages.city}
              />
            )}
          />
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, marginTop: 2 }}>
          {selectedCities.map((city) => (
            <Box
              key={city.id}
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#e0e0e0",
                borderRadius: "16px",
                padding: "0 8px",
              }}
            >
              <Typography variant="body2">{city.Name}</Typography>
              <IconButton
                  onClick={() => handleCityRemove(city.id)} // Call the remove function
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
        </FormGroup>
      </Box>

      {/* API Error Message */}
      {errorMessages.api && (
        <Typography color="error" sx={{ marginBottom: 2 }}>
          {errorMessages.api}
        </Typography>
      )}

      {/* Buttons */}
      <Box
  sx={{
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' }, // responsive layout
    justifyContent: { sm: 'space-between' },
    alignItems: { xs: 'stretch', sm: 'center' },
    gap: 2, // فاصله بین دکمه‌ها
    marginTop: 2,
  }}
>
  <Button variant="contained" color="success" type="submit">
    ثبت
  </Button>
  <Button
    variant="outlined"
    color="success"
    onClick={gotoregisted}
  >
    لیست مسئولین ثبت شده
  </Button>
  <Button
    variant="outlined"
    color="error"
    onClick={() => {
      setFullName("");
      setEmail("");
      setPassword("");
      setSelectedProvince(null);
      setSelectedCities([]);
      setCities([]);
      setErrorMessages({});
    }}
  >
    از سرگیری
  </Button>
</Box>

    </form>
  );
};

export default SignUpForm;
