import React, { useState } from "react";
import {
  Box,
  useMediaQuery,
  IconButton,
  Dialog,
  useTheme,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useSwipeable } from "react-swipeable";

function MediaSlider({ reportData }) {
  const mediaItems = [];
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width:900px)");

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
  const [selectedImage, setSelectedImage] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const itemsPerSlide = isMobile ? 1 : 2;
  const maxIndex = Math.ceil(mediaItems.length / itemsPerSlide) - 1;

  const handleNext = () =>
    setCurrentIndex((prev) => (prev + 1 > maxIndex ? 0 : prev + 1));
  const handlePrev = () =>
    setCurrentIndex((prev) => (prev - 1 < 0 ? maxIndex : prev - 1));

  const handleMediaClick = (item) => {
    if (item.type === "image") {
      setSelectedImage(item.url);
      setDialogOpen(true);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedImage(null);
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleNext(),
    onSwipedRight: () => handlePrev(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  const currentItems = mediaItems.slice(
    currentIndex * itemsPerSlide,
    currentIndex * itemsPerSlide + itemsPerSlide
  );

  return (
    <Box>
      {/* Slider Container */}
      <Box
        {...swipeHandlers}
        sx={{
          position: "relative",
          width: "100%",
          height: isMobile ? "200px" : "400px",
          borderRadius: "10px",
          overflow: "hidden",
          backgroundColor: "#f0f0f0",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Media Display */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            px: 2,
          }}
        >
          {currentItems.map((item, index) => (
            <Box
              key={index}
              sx={{
                flex: 1,
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#ddd",
                borderRadius: 2,
                overflow: "hidden",
                cursor: item.type === "image" ? "pointer" : "default",
              }}
              onClick={() => handleMediaClick(item)}
            >
              {item.type === "image" ? (
                <img
                  src={item.url}
                  alt={`Media ${index}`}
                  style={{
                    height: "100%",
                    width: "100%",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <video
                  controls
                  style={{
                    height: "100%",
                    width: "100%",
                    objectFit: "contain",
                  }}
                >
                  <source src={item.url} type="video/mp4" />
                  مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
                </video>
              )}
            </Box>
          ))}
        </Box>

        {/* Navigation Buttons */}
        {mediaItems.length > itemsPerSlide && (
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

      {/* Dialog for Image Zoom */}
      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="lg" fullWidth>
  <Box
    sx={{
      width: '100%',
      height: '80vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      bgcolor: '#000',
      p: 2,
    }}
  >
    {selectedImage && (
      <Box
        component="img"
        src={selectedImage}
        alt="Zoomed"
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
      />
    )}
  </Box>
</Dialog>

    </Box>
  );
}

export default MediaSlider;
