import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  Grid,
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  useMediaQuery,
  Tooltip,
} from "@mui/material";
import { styled, useTheme } from "@mui/system";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ShareIcon from "@mui/icons-material/Share";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import CloseIcon from "@mui/icons-material/Close";
import NeshanMap from "react-neshan-map-leaflet";
import { Avatar } from '@mui/material';

const MAP_API_KEY = "web.2705e42e6fd74f8796b16a52b4a0b2aa";

const Count = styled(Typography)(({ theme }) => ({
  fontSize: "0.75rem",
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(0.25),
}));

export default function EngagementSection({ reportData }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [likeStatus, setLikeStatus] = useState(null); // true, false, null
  const [likes, setLikes] = useState(reportData.Likes || 0);
  const [dislikes, setDislikes] = useState(reportData.Dislikes || 0);
  const mapRef = useRef();


  useEffect(() => {
    if (!dialogOpen) {
      mapRef.current = null; // ریست نقشه وقتی دیالوگ بسته میشه
    }
  }, [dialogOpen]);
  

  useEffect(() => {
    // بارگزاری وضعیت لایک/دیسلایک
    fetch(
      `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/communicate/like/?CityProblemID=${reportData.id}`,
      {
        method: "GET",
        credentials: "include",
      }
    )
      .then((res) => res.ok ? res.json() : Promise.reject())
      .then((data) => setLikeStatus(data.Like))
      .catch((e) => console.error(e));
  }, [reportData.id]);

  const handleLike = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/communicate/like/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ CityProblemID: reportData.id, Like: true }),
        }
      );
      if (!res.ok) throw new Error();
      // به‌روزرسانی لوکال
      if (likeStatus === true) {
        setLikeStatus(null);
        setLikes((l) => l - 1);
      } else {
        if (likeStatus === false) setDislikes((d) => d - 1);
        setLikeStatus(true);
        setLikes((l) => l + 1);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDislike = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/communicate/like/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ CityProblemID: reportData.id, Like: false }),
        }
      );
      if (!res.ok) throw new Error();
      // به‌روزرسانی لوکال
      if (likeStatus === false) {
        setLikeStatus(null);
        setDislikes((d) => d - 1);
      } else {
        if (likeStatus === true) setLikes((l) => l - 1);
        setLikeStatus(false);
        setDislikes((d) => d + 1);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleShare = () => {
    navigator.clipboard
      .writeText(
        `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_FRONT}/reports/${reportData.id}`
      )
      .then(() => alert("لینک گزارش کپی شد!"))
      .catch((e) => console.error(e));
  };

  return (
    <>
      <Box
  sx={{
    p: isMobile ? 2 : 3,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: "16px",
    borderBottomRightRadius: "16px",
  }}
>

        <CardContent>
        <Grid container spacing={2} alignItems="flex-start">
        <Grid item xs={12} md={8}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 1,
                  cursor: "pointer",
                }}
                onClick={() => setDialogOpen(true)}
              >
                <LocationOnIcon color="action" fontSize="small" sx={{ mr: 1  , ml : 0.1}} />
                <Typography variant="body2" color="textSecondary">
                  {reportData.ProvinceName}
                  {"، "}
                  {reportData.CityName}
                  {"، "}
                  {reportData.FullAddress}{" "}
                  <Box
                    component="span"
                    sx={{
                      color: "success.main",
                      textDecoration: "underline",
                      fontSize: "0.75rem",
                      ml: 0.5,
                    }}
                  >
                    (نمایش بر نقشه)
                  </Box>
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
  {reportData.ReporterPicture ? (
    <Box
      component="img"
      src={`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}${reportData.ReporterPicture}`}
      alt={reportData.ReporterName}
      sx={{
        width: 42,
        height: 42,
        borderRadius: "50%",
        objectFit: "cover",
        border: "2px solid #00cc88",
      }}
    />
  ) : (
    <Avatar
      sx={{
        width: 42,
        height: 42,
        bgcolor: "#00cc88",
        fontWeight: 600,
        fontSize: "0.95rem",
      }}
    >
      {reportData.ReporterName?.[0] || "؟"}
    </Avatar>
  )}
  <Typography
    variant="body2"
    color="textSecondary"
    sx={{ lineHeight: 1.4 }}
  >
    {reportData.ReporterName}
  </Typography>
</Box>


            </Grid>

            <Grid
              item
              xs={12}
              md={4}
              sx={{
                display: "flex",
                justifyContent: isMobile ? "flex-start" : "flex-end",
                gap: 2,
              }}
            >
              <Box sx={{ textAlign: "center" }}>
                <Tooltip title="پسندیدن">
                  <IconButton
                    onClick={handleLike}
                    color={likeStatus === true ? "success" : "default"}
                  >
                    <ThumbUpIcon />
                  </IconButton>
                </Tooltip>
                <Count>{likes}</Count>
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <Tooltip title="نپسندیدن">
                  <IconButton
                    onClick={handleDislike}
                    color={likeStatus === false ? "error" : "default"}
                  >
                    <ThumbDownIcon />
                  </IconButton>
                </Tooltip>
                <Count>{dislikes}</Count>
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <Tooltip title="اشتراک‌گذاری">
                  <IconButton onClick={handleShare} color="primary">
                    <ShareIcon />
                  </IconButton>
                </Tooltip>
                <Count>اشتراک‌گذاری</Count>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Box>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          موقعیت روی نقشه
          <IconButton
            onClick={() => setDialogOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ height: 0, pt: "56.25%", position: "relative" }}>
            <NeshanMap
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
              options={{
                key: MAP_API_KEY,
                center: [reportData.Latitude, reportData.Longitude],
                zoom: 14,
              }}
              onInit={(L, map) => {
                if (mapRef.current) return;
                mapRef.current = map;
                L.marker([reportData.Latitude, reportData.Longitude]).addTo(map);
              }}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
