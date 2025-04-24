import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import NeshanMap from 'react-neshan-map-leaflet';

const MAP_API_KEY = "web.2705e42e6fd74f8796b16a52b4a0b2aa";
const SERVICE_API_KEY = "service.368ec1865d634daaaeac06a233800da6";

export default function MapWithClickDialog({ onClose, lat = 35.699739, lng = 51.338097 }) {
  const [address, setAddress] = useState("");
  const mapRef = useRef(null);

  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.off();   
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);
  

  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth scroll="body">
      <DialogTitle
  sx={{
    direction: "rtl",
    fontWeight: "bold",
    paddingRight: 8,
    fontSize: { xs: "1rem", sm: "1.25rem" }, // ریسپانسیو
    whiteSpace: "nowrap", // جلوگیری از چند خطی‌شدن
    overflow: "hidden",
    textOverflow: "ellipsis",
  }}
>
  موقعیت روی نقشه
  <IconButton
    onClick={onClose}
    sx={{
      position: 'absolute',
      right: 8,
      top: 8,
    }}
  >
    <CloseIcon />
  </IconButton>
</DialogTitle>




      <DialogContent>
        <NeshanMap
          style={{ width: "100%", height: "400px" }}
          options={{
            key: MAP_API_KEY,
            center: [lat, lng],
            zoom: 1,
          }}
          onInit={(L, myMap) => {
            if (mapRef.current) return; // اگر قبلاً مقداردهی شده، نرو جلو
          
            mapRef.current = myMap;
          
            const marker = L.marker([lat, lng]).addTo(myMap);
          
            myMap.on('click', async (e) => {
              const { lat, lng } = e.latlng;
              marker.setLatLng(e.latlng);
          
              try {
                const response = await fetch(
                  `https://api.neshan.org/v5/reverse?lat=${lat}&lng=${lng}`,
                  {
                    headers: { "Api-Key": SERVICE_API_KEY }
                  }
                );
                if (response.ok) {
                  const data = await response.json();
                  setAddress(data.formatted_address || "آدرسی یافت نشد");
                } else {
                  setAddress("خطا در دریافت آدرس");
                }
              } catch (err) {
                console.error(err);
                setAddress("خطا در اتصال به سرور");
              }
            });
          }}
          
        />

{address && (
  <div
    style={{
      marginTop: 12,
      fontSize: "0.9rem",
      background: "#f1f1f1",
      padding: "10px",
      borderRadius: "6px",
      direction: "rtl",         
      textAlign: "right",        
    }}
  >
    آدرس انتخاب‌شده: <strong>{address}</strong>
  </div>
)}

      </DialogContent>
    </Dialog>
  );
}
