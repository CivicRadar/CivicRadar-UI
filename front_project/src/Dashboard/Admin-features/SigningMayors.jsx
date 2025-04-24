import React, { useState, useEffect } from 'react';
import { TextField, Button, FormControl, FormGroup, FormLabel, Box, Typography, Autocomplete } from '@mui/material';
import { getCity, getProvince, addMayor } from '../../services/admin-api';

const SignUpForm = () => {
  const [loading, setLoading] = useState(true);
  const [provinces, setProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);

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
        setLoading(false);
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

    // Clear previous error messages
    setErrorMessages({});

    // Validation checks
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

    if (!selectedCity) {
      setErrorMessages((prev) => ({
        ...prev,
        city: "لطفاً شهر خود را انتخاب کنید ❌",
      }));
      return;
    }

    const MayorData = {
      FullName: fullName,
      Email: email,
      Password: password,
      CityID: selectedCity?.id,
    };

    try {
      const response = await addMayor(MayorData);
      console.log("Form submitted successfully:", response);
      alert("ثبت نام با موفقیت انجام شد!");
    } catch (error) {
      console.error("Error submitting form:", error);

      // Handle specific server-side error messages
      let errorMessage =
        error.response?.data?.message || "مشکلی پیش آمد! ❌ لطفاً دوباره تلاش کنید.";
      setErrorMessages((prev) => ({
        ...prev,
        api: errorMessage,
      }));
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
          <Autocomplete
            options={provinces}
            getOptionLabel={(option) => option.Name}
            value={selectedProvince}
            onChange={(e, newValue) => setSelectedProvince(newValue)}
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
            value={selectedCity}
            onChange={(e, newValue) => setSelectedCity(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="شهر"
                variant="outlined"
                fullWidth
                margin="normal"
                disabled={!selectedProvince}
                error={!!errorMessages.city}
                helperText={errorMessages.city}
              />
            )}
          />
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
          justifyContent: 'space-between',
          marginTop: 2,
        }}
      >
        <Button variant="contained" color="success" type="submit">
          ثبت
        </Button>
        <Button
        variant="outlined"
        color="error"
        onClick={() => {
          // Clear all fields and reset states
          setFullName("");
          setEmail("");
          setPassword("");
          setSelectedProvince(null);
          setCities([]); // Clear cities when province is reset
          setSelectedCity(null);
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
