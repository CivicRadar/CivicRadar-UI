import React, { useState } from "react";
import { Box,useMediaQuery, IconButton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";


function MediaSlider({ reportData }) {
  const mediaItems = [];
  const isMobile = useMediaQuery("(max-width:900px)");


  // Add media URLs to the slider list
  if (reportData.Picture) {
    mediaItems.push({
      type: "image",
      url: `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}${reportData.Picture}`,
    });
  }
  if (reportData.Video) {
    mediaItems.push({
      type: "video",
      url: `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}${reportData.Video}`,
    });
  }

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % mediaItems.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + mediaItems.length) % mediaItems.length);
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: isMobile ? "200px" : "400px",
        borderRadius: "10px",
        overflow: "hidden",
        backgroundColor: "#f0f0f0", // Background for improved contrast
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Media Display */}
      {mediaItems[currentIndex]?.type === "image" && (
        <img
          src={mediaItems[currentIndex].url}
          alt="Report Media"
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
          }}
        />
      )}
      {mediaItems[currentIndex]?.type === "video" && (
        <video
          controls
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
          }}
        >
          <source src={mediaItems[currentIndex].url} type="video/mp4" />
          مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
        </video>
      )}

      {/* Navigation Buttons */}
      {mediaItems.length > 1 && (
        <>
          <IconButton
            onClick={handlePrev}
            sx={{
              position: "absolute",
              top: "50%",
              left: "10px",
              transform: "translateY(-50%)",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              color: "#fff",
              "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.7)" },
            }}
          >
            <ArrowBackIosIcon />
          </IconButton>
          <IconButton
            onClick={handleNext}
            sx={{
              position: "absolute",
              top: "50%",
              right: "10px",
              transform: "translateY(-50%)",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              color: "#fff",
              "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.7)" },
            }}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </>
      )}
    </Box>
  );
}

export default MediaSlider;
