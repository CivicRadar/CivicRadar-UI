import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, IconButton, Dialog, DialogTitle, useMediaQuery, DialogContent } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ShareIcon from "@mui/icons-material/Share";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import CloseIcon from "@mui/icons-material/Close";
import NeshanMap from "react-neshan-map-leaflet";

const MAP_API_KEY = "web.2705e42e6fd74f8796b16a52b4a0b2aa";

function EngagementSection({ reportData }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [likeStatus, setLikeStatus] = useState(null); // True (liked), false (disliked), null (neutral)
  const [likes, setLikes] = useState(reportData.Likes || 0);
  const [dislikes, setDislikes] = useState(reportData.Dislikes || 0);
  const mapRef = useRef(null);
  const isMobile = useMediaQuery("(max-width:900px)");
  const reportID = reportData.id;

  // Fetch current like/dislike status on load
  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/communicate/like/?CityProblemID=${reportData.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include", // Include credentials
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch like/dislike status");
        }

        const data = await response.json();
        setLikeStatus(data.Like); // Update likeStatus based on API response (true, false, null)
      } catch (error) {
        console.error("Error fetching like/dislike status:", error.message);
      }
    };

    fetchLikeStatus();
  }, [reportData.id]);

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleShowMap = () => {
    setDialogOpen(true);
  };

  const handleShare = () => {

    navigator.clipboard
      .writeText(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_FRONT}/reports/${reportData.id}`)
      .then(() => alert("لینک گزارش کپی شد!"))
      .catch((error) => console.error("Failed to copy:", error));
  };
  
  const handleLike = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/communicate/like/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include credentials
          body: JSON.stringify({
            CityProblemID: reportData.id,
            Like: true, // Like action
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit like");
      }

      if(likeStatus)
      {
        setLikeStatus(null);
        setLikes((prev) => prev - 1);
      }
      else
      {
        setLikeStatus(true);
        setLikes((prev) => prev + 1);
      }

      if (likeStatus === false) {
        setDislikes((prev) => prev - 1); // Remove the previous dislike
      }
    } catch (error) {
      console.error("Error submitting like:", error.message);
    }
  };

  const handleDislike = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/communicate/like/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include credentials
          body: JSON.stringify({
            CityProblemID: reportData.id,
            Like: false, // Dislike action
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit dislike");
      }

      if(likeStatus === false)
        {
          setLikeStatus(null);
          setDislikes((prev) => prev - 1);
        }
        else
        {
          setLikeStatus(false);
          setDislikes((prev) => prev + 1);
        }

      if (likeStatus === true) {
        setLikes((prev) => prev - 1); // Remove the previous like
      }
    } catch (error) {
      console.error("Error submitting dislike:", error.message);
    }
  };

  return (
    <Box
      sx={
        isMobile
          ? {
              marginTop: "10px",
              justifyContent: "space-between",
              alignItems: "center",
            }
          : {
              marginTop: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "20px",
            }
      }
    >
      <Box>
        {/* Location Section */}
        <Box
          sx={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}
          onClick={handleShowMap}
        >
          <LocationOnIcon sx={{ color: "#999", fontSize: "large", cursor: "pointer" }} />
          <Typography sx={{ color: "#666", fontSize: "0.9rem", cursor: "pointer" }}>
            {reportData.ProvinceName}، {reportData.CityName}، {reportData.FullAddress}{" "}
            <span style={{ color: "blue", textDecoration: "underline" }}>(نمایش بر نقشه)</span>
          </Typography>
        </Box>

        {/* Reporter Section */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <PersonIcon sx={{ color: "#999", fontSize: "large" }} />
          <Typography sx={{ color: "#666", fontSize: "0.9rem" }}>{reportData.ReporterName}</Typography>
        </Box>
      </Box>

      {/* Like/Dislike/Share Section */}
      <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <Box>
          <IconButton
            onClick={handleLike}
            sx={{
              color: likeStatus === true ? "#4CAF50" : "#999",
              "&:hover": { color: "#4CAF50" },
            }}
          >
            <ThumbUpIcon sx={{ fontSize: "1.5rem" }} />
          </IconButton>
          <Typography sx={{ color: "#666", fontSize: "0.7rem" }}>{likes}</Typography>
        </Box>
        <Box>
          <IconButton
            onClick={handleDislike}
            sx={{
              color: likeStatus === false ? "#F44336" : "#999",
              "&:hover": { color: "#F44336" },
            }}
          >
            <ThumbDownIcon sx={{ fontSize: "1.5rem" }} />
          </IconButton>
          <Typography sx={{ color: "#666", fontSize: "0.7rem" }}>{dislikes}</Typography>
        </Box>
        <Box>
          <IconButton
          onClick={handleShare}
            sx={{
              color: "#999",
              "&:hover": { color: "#1976D2" },
            }}
          >
            <ShareIcon sx={{ fontSize: "1.5rem" }} />
          </IconButton>
          <Typography sx={{ color: "#666", fontSize: "0.7rem" }}>اشتراک‌گذاری</Typography>
        </Box>
      </Box>

      {/* Map Dialog */}
      {dialogOpen && (
        <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="md" fullWidth>
          <DialogTitle>
            موقعیت روی نقشه
            <IconButton onClick={handleDialogClose} sx={{ position: "absolute", right: 8, top: 8 }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <NeshanMap
              style={{ width: "100%", height: "400px" }}
              options={{
                key: MAP_API_KEY,
                center: [reportData.Latitude, reportData.Longitude],
                zoom: 14,
              }}
              onInit={(L, myMap) => {
                if (mapRef.current) return;

                mapRef.current = myMap;

                // Add marker at the provided coordinates
                L.marker([reportData.Latitude, reportData.Longitude]).addTo(myMap);
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
}

export default EngagementSection;
