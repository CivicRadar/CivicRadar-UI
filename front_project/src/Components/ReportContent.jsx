import React from "react";
import { Box, Typography } from "@mui/material";

function ReportContent({ reportData }) {
  // Map type to Persian sentences
  const typeMapping = {
    Lighting: "مشکل روشنایی",
    Street: "مشکل خیابان",
    Garbage: "زباله‌ها",
    Others: "مشکلی",
  };
  console.log(reportData)
  // Construct title
  const title = `${typeMapping[reportData.Type] || "مشکلی "} در ${reportData.CityName}`;

  return (
    <Box
      sx={{
        marginTop: "20px",
        textAlign: "center",
      }}
    >
      {/* Title */}
      <Typography
        variant="h4"
        sx={{
          color: "#4CAF50", // Green color
          fontWeight: "bold",
          marginBottom: "10px",
        }}
      >
        {title}
      </Typography>

      {/* Date and Type Row */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginX: "20px",
          marginBottom: "20px",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            color: "#666",
          }}
        >
          {typeMapping[reportData.Type] || "سایر"}
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            color: "#666",
          }}
        >
          {new Date(reportData.DateTime).toLocaleDateString("fa-IR")}
        </Typography>
      </Box>

      {/* Information Section */}
      <Box
        sx={{
          textAlign: "justify",
          padding: "20px",
        }}
      >
        <Typography variant="body1">{reportData.Information}</Typography>
      </Box>
    </Box>
  );
}

export default ReportContent;