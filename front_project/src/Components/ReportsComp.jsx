import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  useMediaQuery,
  useTheme,
  MenuItem,
  Autocomplete,
  CircularProgress
} from '@mui/material';
import { LinearProgress } from '@mui/material';


import { MyLocation, Delete as DeleteIcon, AddPhotoAlternate, VideoLibrary,Close,Place } from '@mui/icons-material';
import NeshanMap from 'react-neshan-map-leaflet';
import {getProvince , getCity} from '../services/admin-api'
const MAP_API_KEY = "web.2705e42e6fd74f8796b16a52b4a0b2aa";
const SERVICE_API_KEY = "service.368ec1865d634daaaeac06a233800da6";

const steps = [
  { label: 'اطلاعات کلی', number: 1 },
  { label: 'ثبت مکان', number: 2 },
  { label: 'ثبت مستندات', number: 3 }
];

const greenPalette = {
  light: '#81c784',
  main: '#4caf50',
  dark: '#388e3c',
  darkest: '#00661c',
  contrastText: '#fff',
};

const ReportForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [mapInitialized, setMapInitialized] = useState(false);
  const mapRef = useRef(null);
  const [showMap, setShowMap] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery('(max-width:900px)');
  const [mapDialogOpen, setMapDialogOpen] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const mapDialogRef = useRef(null);
  const [mapLoading, setMapLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null); // null یا عدد بین 0 تا 100



useEffect(() => {
  // When the component unmounts or activeStep changes, reset the map view
  return () => {
    if (mapRef.current?.map) {
      mapRef.current.map.remove();
      mapRef.current = null;
    }
    setShowMap(false);
    setTimeout(() => setShowMap(true), 100); // Re-render with fresh state
  };
}, [activeStep]);

// Add this to handle window resizing
useEffect(() => {
  const handleResize = () => {
    if (mapRef.current?.map) {
      setTimeout(() => {
        mapRef.current.map.invalidateSize();
      }, 100);
    }
  };

  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);
  
  const [formData, setFormData] = useState({
    reportSubject: '',
    reportTitle: '',
    description: '',
    province: null,
    city: null,
    fullAddress: '',
    mapAddress: '',
    lat: 35.699739,
    lng: 51.338097,
    image: null,
    video: null
  });

  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);

  // Initialize map only once when component mounts
  useEffect(() => {
    setMapInitialized(true);
    
    return () => {
      // Cleanup only when component unmounts
      if (mapRef.current?.map) {
        mapRef.current.map.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const handleMapInit = (L, map) => {
    if (mapRef.current?.map) {
      mapRef.current.map.remove(); // Remove the existing map instance
      mapRef.current = null;
    }
  
    const marker = L.marker([formData.lat, formData.lng]).addTo(map);
    map.on('click', async (e) => {
      const { lat, lng } = e.latlng;
      updateMapPosition(lat, lng);
      fetchAddress(lat, lng);
    });
  
    mapRef.current = { L, map, marker };
  };
  

  const handleOpenMapDialog = () => {
    setMapDialogOpen(true);
    setUserLocation(null);
  };

  const handleCloseMapDialog = () => {
    setMapDialogOpen(false);
  };

  const handleMapDialogInit = (L, map) => {
    mapDialogRef.current = { L, map, marker: null };
    setMapLoading(false);
    
    // Click handler for manual location selection
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      updateMarkerPosition(lat, lng);
    });
  };

  const updateMarkerPosition = (lat, lng) => {
    if (mapDialogRef.current) {
      const { L, map, marker } = mapDialogRef.current;
      if (marker) {
        marker.setLatLng([lat, lng]);
      } else {
        mapDialogRef.current.marker = L.marker([lat, lng]).addTo(mapDialogRef.current.map);
      }
      mapDialogRef.current.map.setView([lat, lng], 15);
      setUserLocation({ lat, lng });
    }
  };

  const confirmMapLocation = () => {
    if (userLocation) {
      handleChange('lat', userLocation.lat);
      handleChange('lng', userLocation.lng);
      fetchAddress(userLocation.lat, userLocation.lng);
    }
    handleCloseMapDialog();
  };
  

  const updateMapPosition = (lat, lng) => {
    if (mapRef.current) {
      const { marker, map } = mapRef.current;
      marker.setLatLng([lat, lng]);
      map.setView([lat, lng]);
    }
    setFormData(prev => ({ ...prev, lat, lng }));
  };

  const fetchAddress = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://api.neshan.org/v5/reverse?lat=${lat}&lng=${lng}`,
        { headers: { "Api-Key": SERVICE_API_KEY } }
      );
      const data = await response.json();
      const address = data.formatted_address || "آدرسی یافت نشد";
      setFormData(prev => ({
        ...prev,
        mapAddress: address,
        fullAddress: address
      }));
    } catch (err) {
      console.error("Error fetching address:", err);
      setFormData(prev => ({
        ...prev,
        fullAddress: "خطا در دریافت آدرس"
      }));
    }
  };

  const getCurrentLocation = () => {
    setMapLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          updateMarkerPosition(latitude, longitude);
          setMapLoading(false);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setMapLoading(false);
          alert("دریافت موقعیت مکانی با مشکل مواجه شد");
        }
      );
    } else {
      alert("مرورگر شما از موقعیت مکانی پشتیبانی نمی‌کند");
      setMapLoading(false);
    }
  };

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      alert("مرورگر شما از موقعیت مکانی پشتیبانی نمی‌کند");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        updateMapPosition(latitude, longitude);
        fetchAddress(latitude, longitude);
      },
      () => alert("دریافت موقعیت مکانی با مشکل مواجه شد")
    );
  };

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateCurrentStep = () => {
    const newErrors = {};
    
    if (activeStep === 0) {
      if (!formData.reportSubject) newErrors.reportSubject = 'لطفاً موضوع گزارش را انتخاب کنید';
      if (!formData.reportTitle) newErrors.reportTitle = 'لطفاً عنوان گزارش را وارد کنید';
      if (!formData.description) newErrors.description = 'لطفاً توضیحات را وارد کنید';
    }
    else if (activeStep === 1) {
      if (!formData.province) newErrors.province = 'لطفاً استان را انتخاب کنید';
      if (!formData.city) newErrors.city = 'لطفاً شهر را انتخاب کنید';
      if (!formData.fullAddress) newErrors.fullAddress = 'لطفاً آدرس کامل را وارد کنید';
    }
    else if (activeStep === 2) {
      if (!formData.image) newErrors.image = 'لطفاً عکس را اضافه کنید';
      if (!formData.video) newErrors.video = 'لطفاً فیلم را اضافه کنید';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleChange('image', URL.createObjectURL(file));
    }
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleChange('video', URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    handleChange('image', null);
  };

  const handleRemoveVideo = () => {
    handleChange('video', null);
  };

  // Fetch provinces
  useEffect(() => {
    const fetchProvince = async () => {
      try {
        const response = await getProvince();
        setProvinces(response);
      } catch (error) {
        console.error("Error fetching Provinces:", error);
        setErrors(prev => ({
          ...prev,
          province: "خطا در دریافت استان‌ها"
        }));
      }
    };
    fetchProvince();
  }, []);

  // Fetch cities when province is selected
  useEffect(() => {
    const fetchCity = async () => {
      try {
        if (formData.province) {
          const response = await getCity(formData.province.id);
          setCities(response);
        }
      } catch (error) {
        console.error("Error fetching Cities:", error);
        setErrors(prev => ({
          ...prev,
          city: "خطا در دریافت شهرها"
        }));
      }
    };
    fetchCity();
  }, [formData.province]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (mapRef.current?.map) {
        setTimeout(() => {
          mapRef.current.map.invalidateSize();
        }, 100);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


    // Add this function to your component
    const submitReport = async () => {
      if (!validateCurrentStep()) return;
    
      try {
        const formDataToSend = new FormData();
        formDataToSend.append('CityID', formData.city?.id || '');
        formDataToSend.append('Information', formData.description);
        formDataToSend.append('Type', formData.reportSubject);
    
        if (formData.image) {
          const imageResponse = await fetch(formData.image);
          const imageBlob = await imageResponse.blob();
          formDataToSend.append('Picture', imageBlob, 'image.jpg');
        }
    
        if (formData.video) {
          const videoResponse = await fetch(formData.video);
          const videoBlob = await videoResponse.blob();
          formDataToSend.append('Video', videoBlob, 'video.mp4');
        }
    
        formDataToSend.append('Longitude', formData.lng);
        formDataToSend.append('Latitude', formData.lat);
        formDataToSend.append('FullAdress', formData.fullAddress);
    
        const xhr = new XMLHttpRequest();
    
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(percentComplete);
          }
        };
    
        xhr.onload = () => {
          setUploadProgress(null); // Reset progress
          if (xhr.status >= 200 && xhr.status < 300) {
            alert("گزارش با موفقیت ثبت شد");
            setActiveStep(0);
            setFormData({
              reportSubject: '',
              reportTitle: '',
              description: '',
              province: null,
              city: null,
              fullAddress: '',
              mapAddress: '',
              lat: 35.699739,
              lng: 51.338097,
              image: null,
              video: null
            });
          } else {
            const response = JSON.parse(xhr.responseText);
            throw new Error(response.message || 'خطا در ارسال اطلاعات');
          }
        };
    
        xhr.onerror = () => {
          setUploadProgress(null);
          alert("ارسال گزارش با خطا مواجه شد");
        };
    
        xhr.open(
          "POST",
          `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/supervise/citizen-report-problem/`,
          true
        );
        xhr.withCredentials = true;
        xhr.send(formDataToSend);
      } catch (error) {
        setUploadProgress(null);
        console.error("Error:", error);
        alert("خطا در ثبت گزارش: " + (error.message || "خطای ناشناخته"));
      }
    };
    
  return (
    <Box sx={{ 
      maxWidth: 1000, 
      margin: 'auto', 
      p: 3, 
      border: '1px solid #e0e0e0', 
      borderRadius: 2,
      backgroundColor: 'white'
    }}>
      {/* Stepper */}
      <Box sx={{ 
        width: '100%',
        mb: 4,
        position: 'relative',
        '& .step-connector': {
          position: 'absolute',
          top: '20px',
          height: '2px',
          backgroundColor: '#e0e0e0',
          '&.active': {
            backgroundColor: '#9fe0b1'
          }
        }
      }}>
        <Box sx={{ 
          display: 'flex',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 1
        }}>
          {steps.map((step, index) => (
            <Box key={index} sx={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1
            }}>
              <Box sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: activeStep >= index ? '#278240' : '#e0e0e0',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 1
              }}>
                {step.number}
              </Box>
              <Typography variant="body2" sx={{ 
                fontWeight: activeStep === index ? 'bold' : 'normal',
                textAlign: 'center'
              }}>
                {step.label}
              </Typography>
            </Box>
          ))}
        </Box>
        
        {/* Connector lines */}
        <Box className={`step-connector ${activeStep >= 1 ? 'active' : ''}`} 
          sx={{ left: '16.66%', right: '16.66%' }} />
        <Box className={`step-connector ${activeStep >= 2 ? 'active' : ''}`} 
          sx={{ left: '49.99%', right: '49.99%' }} />
      </Box>

      {/* Current Step Content */}
      <Box sx={{ my: 3,  display: 'flex', flexDirection: 'column' }}>
        {activeStep === 0 && (
          <>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  موضوع گزارش:
                </Typography>
                <TextField
                  select
                  fullWidth
                  value={formData.reportSubject}
                  onChange={(e) => handleChange('reportSubject', e.target.value)}
                  error={!!errors.reportSubject}
                  label="موضوع گزارش"
                >
                  <MenuItem value="lighting">نور </MenuItem>
                  <MenuItem value="street">خیابان</MenuItem>
                  <MenuItem value="garbage">زباله</MenuItem>
                  <MenuItem value="others">سایر</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  عنوان گزارش:
                </Typography>
                <TextField
                  fullWidth
                  value={formData.reportTitle}
                  onChange={(e) => handleChange('reportTitle', e.target.value)}
                  error={!!errors.reportTitle}
                  placeholder="عنوان گزارش را وارد کنید"
                />
              </Grid>
            </Grid>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
              توضیحات:
            </Typography>
            <TextField
              multiline
              rows={8}
              placeholder="توضیحات خود را وارد کنید..."
              fullWidth
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              error={!!errors.description}
              sx={{ flex: 1 }}
            />
          </>
        )}

        {activeStep === 1 && (
          <Grid container spacing={3} sx={{ flex: 1 }}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <Autocomplete
                  options={provinces}
                  getOptionLabel={(option) => option.Name}
                  value={formData.province}
                  onChange={(e, newValue) => handleChange('province', newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="استان"
                      error={!!errors.province}
                    />
                  )}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Autocomplete
                  options={cities}
                  getOptionLabel={(option) => option.Name}
                  value={formData.city}
                  onChange={(e, newValue) => handleChange('city', newValue)}
                  disabled={!formData.province}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="شهر"
                      error={!!errors.city}
                    />
                  )}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Button 
                  variant="contained" 
                  onClick={isMobile ? handleOpenMapDialog : getUserLocation}
                  startIcon={<MyLocation />}
                  sx={{
                    color: 'white',
                    bgcolor: greenPalette.dark,
                    '&:hover': {
                      color: greenPalette.dark,
                      backgroundColor: '#e8f5e9' // light green background
                    }
                  }}
                  fullWidth
                >
                  {isMobile ? 'انتخاب از روی نقشه' : 'موقعیت فعلی من'}
                </Button>
              </Box>

              <TextField
                label="آدرس کامل"
                variant="outlined"
                fullWidth
                multiline
                rows={8}
                value={formData.fullAddress}
                onChange={(e) => handleChange('fullAddress', e.target.value)}
                error={!!errors.fullAddress}
                placeholder="آدرس دقیق را وارد کنید (خیابان، کوچه، نشانی و...)"
              />
            </Grid>

            {!isMobile && (

  <Grid item xs={12} md={6}>
    
    <Box sx={{ height: '100%', position: 'relative' }}>
      {mapInitialized && (
        <NeshanMap
          key="neshan-map-static"
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '4px',
          }}
          options={{
            key: MAP_API_KEY,
            center: [formData.lat, formData.lng],
            zoom: 13,
          }}
          onInit={handleMapInit}
        />
      )}
      {formData.mapAddress && (
        <Paper elevation={1} sx={{
          position: 'absolute',
          bottom: 16,
          right: 16,
          left: { xs: 16, md: 'auto' },
          width: { xs: 'calc(100% - 32px)', md: 'auto' },
          p: 1,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
        }}>
          <Typography variant="body2" sx={{ px: 1 }}>
            {formData.mapAddress}
          </Typography>
        </Paper>
      )}
      
    </Box>
  </Grid>
)}
<Dialog
  open={mapDialogOpen}
  onClose={handleCloseMapDialog}
  fullScreen={false} // حالا false می‌ذاریم حتی برای موبایل
  maxWidth="sm"
  fullWidth
  sx={{
    '& .MuiDialog-container': {
      justifyContent: 'center',
      alignItems: 'center',
    },
    '& .MuiDialog-paper': {
      margin: 1.55,
      width: '100%',
      height: '85vh',
      maxHeight: '85vh',
      borderRadius: 3, // گوشه‌ها گرد
    }
  }}
>


        <DialogTitle sx={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          bgcolor: 'background.paper',
          borderBottom: '1px solid #e0e0e0',
          p: 2
        }}>
          <Typography variant="h6">انتخاب موقعیت روی نقشه</Typography>
          <IconButton onClick={handleCloseMapDialog} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent
  sx={{
    p: 0,
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
    height: isMobile ? 'calc(100vh - 110px)' : '100%', // برای موبایل فضای دکمه‌ها رو کم می‌کنیم
  }}
>

          {mapLoading && (
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(255,255,255,0.7)',
              zIndex: 1
            }}>
              <CircularProgress />
            </Box>
          )}
          
          <NeshanMap
            key="neshan-map-dialog"
            style={{ 
              width: "100%", 
              height: "100%",
              position: 'absolute',
              top: 0,
              left: 0
            }}
            options={{
              key: MAP_API_KEY,
              center: userLocation || [35.699739, 51.338097],
              zoom: 13,
              touchZoom: true,
              zoomControl: true
            }}
            onInit={handleMapDialogInit}
          />
        </DialogContent>
        
        <DialogActions sx={{ 
          bgcolor: 'background.paper',
          borderTop: '1px solid #e0e0e0',
          p: 1,
          justifyContent: 'space-between'
        }}>
          <Button 
            startIcon={<MyLocation />}
            onClick={getCurrentLocation}
            disabled={mapLoading}
            size="small"
            sx={{
              color: greenPalette.dark,
            }}
          >
            موقعیت فعلی من
          </Button>
          
          <Box>
            <Button 
              onClick={handleCloseMapDialog}
              color="inherit"
              size="small"
              sx={{ mx: 1 }}
            >
              بستن
            </Button>
            <Button 
              onClick={confirmMapLocation}
              variant="contained"
              disabled={!userLocation}
              size="small"
              startIcon={<Place />}
              sx={{
                color: 'white',
                bgcolor: greenPalette.dark,
                '&:hover': {
                  color: greenPalette.dark,
                  backgroundColor: '#e8f5e9' // light green background
                }
              }}
            >
              ثبت موقعیت
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

          </Grid>
        )}

{activeStep === 2 && (
  <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
      مستندات گزارش
    </Typography>

    <Grid container spacing={3}>
      {/* عکس */}
      <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
        <Box
          sx={{
            minHeight: 250,
            maxHeight: 320,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            flexGrow: 1,
          }}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
            id="image-upload"
          />
          <label htmlFor="image-upload">
            <Button
              variant="outlined"
              component="span"
              fullWidth
              sx={{
                minHeight: 220,
                maxHeight: 320,
                display: 'flex',
                color: greenPalette.darkest,
                borderColor: greenPalette.light,
                '&:hover': {
                  borderColor: greenPalette.main,
                },
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                borderStyle: formData.image ? 'solid' : 'dashed',
                position: 'relative',
                overflow: 'hidden',
                height: '100%',
              }}
            >
              {formData.image ? (
                <>
                  <Box
                    component="img"
                    src={formData.image}
                    alt="Uploaded"
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage();
                    }}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      bgcolor: 'white',
                      boxShadow: 1,
                      '&:hover': {
                        bgcolor: 'error.light',
                      }
                    }}
                  >
                    <DeleteIcon color="error" />
                  </IconButton>
                </>
              ) : (
                <>
                  <AddPhotoAlternate fontSize="large" />
                  <Typography sx={{ mt: 1 }}>عکس برای این گزارش اضافه کنید</Typography>
                </>
              )}
            </Button>
          </label>
          {errors.image && (
            <Typography color="error" variant="caption" sx={{ mt: 1 }}>
              {errors.image}
            </Typography>
          )}
        </Box>
      </Grid>

      {/* ویدیو */}
      <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
        <Box
          sx={{
            minHeight: 250,
            maxHeight: 320,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            flexGrow: 1,
          }}
        >
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoUpload}
            style={{ display: 'none' }}
            id="video-upload"
          />
          <label htmlFor="video-upload">
            <Button
              variant="outlined"
              component="span"
              fullWidth
              sx={{
                minHeight: 220,
                maxHeight: 320,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                borderStyle: formData.video ? 'solid' : 'dashed',
                position: 'relative',
                overflow: 'hidden',
                color: greenPalette.darkest,
                borderColor: greenPalette.light,
                '&:hover': {
                  borderColor: greenPalette.main,
                },
                height: '100%',
              }}
            >
              {formData.video ? (
                <>
                  <Box
                    component="video"
                    src={formData.video}
                    controls
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveVideo();
                    }}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      bgcolor: 'white',
                      boxShadow: 1,
                      '&:hover': {
                        bgcolor: 'error.light',
                      }
                    }}
                  >
                    <DeleteIcon color="error" />
                  </IconButton>
                </>
              ) : (
                <>
                  <VideoLibrary fontSize="large" />
                  <Typography sx={{ mt: 1 }}>فیلمی برای این گزارش اضافه کنید</Typography>
                </>
              )}
            </Button>
          </label>
          {errors.video && (
            <Typography color="error" variant="caption" sx={{ mt: 1 }}>
              {errors.video}
            </Typography>
          )}
        </Box>
      </Grid>
    </Grid>
  </Box>
)}


      </Box>

      {/* Upload Progress Bar */}
{uploadProgress !== null && (
  <Box sx={{ my: 2 }}>
    <Typography variant="body2" align="center" sx={{ mb: 1 }}>
      در حال ارسال فایل‌ها... {uploadProgress}٪
    </Typography>
    <LinearProgress
  variant="determinate"
  value={uploadProgress}
  sx={{
    height: 8,
    borderRadius: 5,
    backgroundColor: '#e0f2f1',
    '& .MuiLinearProgress-bar': {
      backgroundColor: greenPalette.dark
    }
  }}
/>

  </Box>
)}

      {/* Navigation Buttons */}
      <Box
  sx={{
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: { xs: 'column', sm: 'row' }, // دکمه‌ها زیر هم در موبایل
    gap: 2,
    mt: 3,
    pt: 2,
    borderTop: '1px solid #f0f0f0',
  }}
>
  {/* دکمه قبلی */}
  <Button
    variant="outlined"
    onClick={handleBack}
    disabled={activeStep === 0}
    sx={{
      borderColor: greenPalette.light,
      color: greenPalette.dark,
      '&:hover': {
        borderColor: greenPalette.main,
      },
      minWidth: 120,
      width: { xs: '100%', sm: 'auto' }, // تمام عرض در موبایل
    }}
  >
    قبلی
  </Button>

  {/* دکمه ثبت یا مرحله بعدی */}
  {activeStep < steps.length - 1 ? (
    <Button
      variant="contained"
      onClick={handleNext}
      sx={{
        backgroundColor: greenPalette.main,
        '&:hover': {
          backgroundColor: greenPalette.dark,
        },
        minWidth: 120,
        width: { xs: '100%', sm: 'auto' },
      }}
    >
      مرحله بعدی
    </Button>
  ) : (
    <Button
      variant="contained"
      color="success"
      onClick={() => {
        if (validateCurrentStep()) {
          submitReport();
        }
      }}
      sx={{
        backgroundColor: greenPalette.dark,
        '&:hover': {
          backgroundColor: '#2e7d32',
        },
        minWidth: 120,
        width: { xs: '100%', sm: 'auto' },
      }}
    >
      ثبت نهایی
    </Button>
  )}
</Box>

    </Box>
  );
};

export default ReportForm;