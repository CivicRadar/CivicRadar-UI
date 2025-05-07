import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";
import { useCitizen } from "../context/CitizenContext";
import { useMayor } from "../context/MayorContext";

const LogoutDialog = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { logoutAdmin, admin } = useAdmin();
  const { logoutCitizen, citizen } = useCitizen();
  const { logoutMayor, mayor } = useMayor();

  const handleLogout = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/auth/logout/`,
        {
          method: "GET",
          credentials: "include",
        }
      );
  
      const data = await res.json();
      console.log(" Logout response:", data); // اضافه کن برای تست
  
      // پاک‌سازی سمت کلاینت
      if (admin) logoutAdmin();
      else if (citizen) logoutCitizen();
      else if (mayor) logoutMayor();
  
      navigate("/signuplogin");
    } catch (error) {
      console.error("Logout request failed:", error);
    }
  };
  

  return (
    <Dialog open={open} onClose={onClose} dir="rtl">
      <DialogTitle sx={{ textAlign: "right" }}>تأیید خروج</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ textAlign: "right" }}>
          آیا مطمئن هستید که می‌خواهید از حساب خود خارج شوید؟
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "flex-start", px: 3 }}>
        <Button
          onClick={onClose}
          sx={{
            color: "#007E33",
            fontWeight: "bold",
            "&:hover": {
              backgroundColor: "rgba(2, 41, 18, 0.1)",
            },
          }}
        >
          لغو
        </Button>
        <Button
          onClick={handleLogout}
          color="error"
          sx={{ fontWeight: "bold" }}
        >
          خروج
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LogoutDialog;
