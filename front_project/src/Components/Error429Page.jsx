import React from 'react';
import { Box, Typography, Button, Paper, Stack } from '@mui/material';
import errorImage from '../assets/429.jpg';
import logo from '../assets/lgo.png'; // لوگوی سایت
import { useNavigate } from 'react-router-dom';


export default function Error429Page() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f1fdf5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        fontFamily: 'Vazir, sans-serif',
      }}
    >
      <Paper
        elevation={10}
        sx={{
          maxWidth: 600,
          width: '100%',
          p: 5,
          pt: 3,
          borderRadius: '24px',
          textAlign: 'center',
          boxShadow: '0 0 30px 10px rgba(46, 125, 50, 0.6)',
          position: 'relative',
        }}
      >
        {/* لوگو بالا سمت چپ */}
        <Box
          component="img"
          src={logo}
          alt="Site Logo"
          sx={{
            position: 'absolute',
            top: 20,
            left: 20,
            width: 80, // سایز بزرگ‌تر
            height: 'auto',
          }}
        />

        <Stack spacing={3} alignItems="center" mt={6}>
          {/* تصویر خطا */}
          <Box
            component="img"
            src={errorImage}
            alt="429 Error"
            sx={{
              width: '100%',
              maxHeight: 240,
              objectFit: 'contain',
              borderRadius: 3,
            }}
          />

          {/* متن */}
          <Typography
            variant="h6" // فونت کوچک‌تر از h5
            sx={{
              color: '#000',
              fontWeight: 'bold',
              fontFamily: 'Vazir, sans-serif',
            }}
          >
            شما تعداد زیادی درخواست در مدت زمان کوتاهی ارسال کرده‌اید.
            لطفاً چند لحظه صبر کرده و دوباره امتحان کنید
          </Typography>

          {/* دکمه */}
          <Button
  variant="contained"
  color="success"
  size="large"
  onClick={() => navigate('/signuplogin')}
  sx={{
    borderRadius: '16px',
    px: 4,
    py: 1.5,
    fontWeight: 'bold',
    fontFamily: 'Vazir, sans-serif',
    boxShadow: '0 0 12px rgba(46, 125, 50, 0.6)',
  }}
>
  بازگشت به صفحه ورود
</Button>

        </Stack>
      </Paper>
    </Box>
  );
}
