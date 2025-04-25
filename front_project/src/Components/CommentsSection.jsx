import React from "react";
import { Box, Typography, IconButton, Divider } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";

function CommentsSection() {
  const sampleComments = [
    {
      id: 1,
      name: "احمد خلیلی",
      comment: "واقعا دیدن چنین مناظری برای شهر ما خوب نیست. امیدوارم مسئولین رسیدگی کنند زودتر.",
      likes: 4,
      dislikes: 1,
      time: "امروز 14:33",
    },
    {
      id: 2,
      name: "مریم حسینی",
      comment: "از این اطلاعات استفاده کردم. امیدوارم مشکلات به زودی رفع شوند.",
      likes: 3,
      dislikes: 0,
      time: "دیروز 11:20",
    },
    {
      id: 3,
      name: "علی رضایی",
      comment: "آیا پیگیری برای این مشکل انجام شده است؟",
      likes: 5,
      dislikes: 2,
      time: "یک هفته پیش",
    },
  ];

  return (
    <Box
      sx={{
        marginTop: "30px",
        padding: "20px",
        backgroundColor: "#f0f0f0", // Section background
        borderRadius: "10px",
      }}
    >
      {/* Comments Section Title */}
      <Typography
        variant="h6"
        sx={{
          color: "#4CAF50", // Green for the title
          fontWeight: "bold",
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
        دیدگاه ها
      </Typography>

      {/* Comments List */}
      {sampleComments.map((comment) => (
        <Box
          key={comment.id}
          sx={{
            marginBottom: "20px",
            padding: "15px",
            backgroundColor: "#fff", // White background for comments
            borderRadius: "10px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: "bold",
              }}
            >
              {comment.name}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "#999",
              }}
            >
              {comment.time}
            </Typography>
          </Box>
          <Typography
            variant="body2"
            sx={{
              marginBottom: "10px",
              color: "#666",
            }}
          >
            {comment.comment}
          </Typography>
          <Box sx={{ display: "flex", gap: "15px" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <IconButton
                sx={{
                  color: "#999", // Default gray
                  "&:hover": { color: "#4CAF50" }, // Green on hover
                }}
              >
                <ThumbUpIcon />
              </IconButton>
              <Typography sx={{ fontSize: "0.9rem" }}>{comment.likes}</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <IconButton
                sx={{
                  color: "#999", // Default gray
                  "&:hover": { color: "#F44336" }, // Red on hover
                }}
              >
                <ThumbDownIcon />
              </IconButton>
              <Typography sx={{ fontSize: "0.9rem" }}>{comment.dislikes}</Typography>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

export default CommentsSection;
