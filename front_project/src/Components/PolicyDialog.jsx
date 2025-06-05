import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';

const PolicyDialog = ({ open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          direction: 'rtl',
          fontFamily: "Vazir, IranSans, IRANYekan, Vazirmatn, Shabnam, sans-serif",
        }
      }}
    >
      <DialogTitle sx={{ 
        textAlign: 'center',
        color: '#023',
        fontWeight: 'bold',
        fontFamily: "Vazir, IranSans, IRANYekan, Vazirmatn, Shabnam, sans-serif",
      }}>
        شرایط و قوانین استفاده از سامانه
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h6" 
            gutterBottom
            sx={{
              color: '#023',
              fontWeight: 'bold',
              fontFamily: "Vazir, IranSans, IRANYekan, Vazirmatn, Shabnam, sans-serif",
            }}
          >
            ۱. تعریف‌ها
          </Typography>
          <Typography 
            paragraph
            sx={{
              color: '#666',
              lineHeight: 2,
              fontSize: '1.1rem',
              fontFamily: "Vazir, IranSans, IRANYekan, Vazirmatn, Shabnam, sans-serif",
            }}
          >
            در این شرایط و قوانین، اصطلاحات زیر به معانی ذیل به کار می‌روند:
          </Typography>
          <Typography 
            component="div" 
            sx={{ 
              pr: 2,
              color: '#666',
              lineHeight: 2,
              fontSize: '1.1rem',
              fontFamily: "Vazir, IranSans, IRANYekan, Vazirmatn, Shabnam, sans-serif",
            }}
          >
            <ul>
              <li>سامانه: به معنای پلتفرم شهرسنج است</li>
              <li>کاربر: به معنای هر شخص حقیقی یا حقوقی است که از خدمات سامانه استفاده می‌کند</li>
              <li>خدمات: به معنای تمامی امکانات و قابلیت‌های ارائه شده در سامانه است</li>
            </ul>
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h6" 
            gutterBottom
            sx={{
              color: '#023',
              fontWeight: 'bold',
              fontFamily: "Vazir, IranSans, IRANYekan, Vazirmatn, Shabnam, sans-serif",
            }}
          >
            ۲. پذیرش شرایط
          </Typography>
          <Typography 
            paragraph
            sx={{
              color: '#666',
              lineHeight: 2,
              fontSize: '1.1rem',
              fontFamily: "Vazir, IranSans, IRANYekan, Vazirmatn, Shabnam, sans-serif",
            }}
          >
            با استفاده از سامانه، شما موافقت می‌کنید که این شرایط و قوانین را پذیرفته‌اید. اگر با هر یک از این شرایط موافق نیستید، لطفاً از استفاده از سامانه خودداری کنید.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h6" 
            gutterBottom
            sx={{
              color: '#023',
              fontWeight: 'bold',
              fontFamily: "Vazir, IranSans, IRANYekan, Vazirmatn, Shabnam, sans-serif",
            }}
          >
            ۳. مسئولیت‌های کاربر
          </Typography>
          <Typography 
            component="div" 
            sx={{ 
              pr: 2,
              color: '#666',
              lineHeight: 2,
              fontSize: '1.1rem',
              fontFamily: "Vazir, IranSans, IRANYekan, Vazirmatn, Shabnam, sans-serif",
            }}
          >
            <ul>
              <li>ارائه اطلاعات صحیح و دقیق در زمان ثبت گزارش</li>
              <li>حفظ محرمانگی اطلاعات حساب کاربری</li>
              <li>استفاده قانونی از خدمات سامانه</li>
              <li>رعایت حقوق سایر کاربران</li>
            </ul>
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h6" 
            gutterBottom
            sx={{
              color: '#023',
              fontWeight: 'bold',
              fontFamily: "Vazir, IranSans, IRANYekan, Vazirmatn, Shabnam, sans-serif",
            }}
          >
            ۴. محرمانگی اطلاعات
          </Typography>
          <Typography 
            paragraph
            sx={{
              color: '#666',
              lineHeight: 2,
              fontSize: '1.1rem',
              fontFamily: "Vazir, IranSans, IRANYekan, Vazirmatn, Shabnam, sans-serif",
            }}
          >
            سامانه متعهد به حفظ محرمانگی اطلاعات شخصی کاربران است. اطلاعات جمع‌آوری شده تنها برای بهبود خدمات و ارتباط با کاربران استفاده می‌شود.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h6" 
            gutterBottom
            sx={{
              color: '#023',
              fontWeight: 'bold',
              fontFamily: "Vazir, IranSans, IRANYekan, Vazirmatn, Shabnam, sans-serif",
            }}
          >
            ۵. محدودیت‌های استفاده
          </Typography>
          <Typography 
            paragraph
            sx={{
              color: '#666',
              lineHeight: 2,
              fontSize: '1.1rem',
              fontFamily: "Vazir, IranSans, IRANYekan, Vazirmatn, Shabnam, sans-serif",
            }}
          >
            کاربران مجاز به استفاده از سامانه برای اهداف غیرقانونی یا مخرب نیستند. هرگونه سوءاستفاده از خدمات سامانه پیگرد قانونی خواهد داشت.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h6" 
            gutterBottom
            sx={{
              color: '#023',
              fontWeight: 'bold',
              fontFamily: "Vazir, IranSans, IRANYekan, Vazirmatn, Shabnam, sans-serif",
            }}
          >
            ۶. تغییرات شرایط
          </Typography>
          <Typography 
            paragraph
            sx={{
              color: '#666',
              lineHeight: 2,
              fontSize: '1.1rem',
              fontFamily: "Vazir, IranSans, IRANYekan, Vazirmatn, Shabnam, sans-serif",
            }}
          >
            سامانه حق تغییر این شرایط و قوانین را در هر زمان محفوظ می‌دارد. تغییرات از طریق اعلان در سامانه به اطلاع کاربران خواهد رسید.
          </Typography>
        </Box>

      </DialogContent>
      <DialogActions>
        <Button 
          onClick={onClose}
          variant="contained"
          color="primary"
          sx={{
            fontFamily: "Vazir, IranSans, IRANYekan, Vazirmatn, Shabnam, sans-serif",
          }}
        >
          بستن
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PolicyDialog; 