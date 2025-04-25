import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Typography, CircularProgress, Box } from "@mui/material";
import { getReportData } from "../services/mayor-api";
import MediaSlider from "./slider";
import ReportContent from "./ReportContent";
import EngagementSection from "./EngagementSection";
import CommentsSection from "./CommentsSection";

const statusMapping = {
  PendingReview: "برسی اولیه",
  UnderConsideration: "درحال پیگیری",
  IssueResolved: "پیگیری شده",
};

const statusStyles = {
  default: {
    color: "#999",
  },
  current: {
    color: "#4CAF50", // Vibrant green
    fontWeight: "bold",
  },
  completed: {
    color: "#A5D6A7", // Grayed green
  },
};

function ReportDetails() {
  const { id } = useParams(); // Extract 'id' from the URL
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const data = await getReportData(id); // Call the API using the extracted 'id'
        setReportData(data);
      } catch (err) {
        setError(err.message || "Failed to fetch report data");
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  const handleAddressClick = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleShare = (url) => {
    navigator.clipboard.writeText(url).then(() => {
      alert("URL copied to clipboard!");
    });
  };
    
  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  const renderStepper = () => {
    const activeIndex = Object.keys(statusMapping).indexOf(reportData.Status);
    return (
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="20px" marginTop="20px">
        {Object.values(statusMapping).map((label, index) => {
          const isActive = index === activeIndex;
          const isCompleted = index < activeIndex;

          return (
            <React.Fragment key={index}>
              <Box
                style={{
                  textAlign: "center",
                  flex: 1,
                  color: isActive ? statusStyles.current.color : isCompleted ? statusStyles.completed.color : statusStyles.default.color,
                  fontWeight: isActive ? "bold" : "normal",
                }}
              >
                {label}
              </Box>
              {/* Add connector line except after the last step */}
              {index < Object.values(statusMapping).length - 1 && (
                <Box
                  style={{
                    flex: 1,
                    height: "2px",
                    backgroundColor: isCompleted ? statusStyles.completed.color : statusStyles.default.color,
                    margin: "0 10px",
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </Box>
    );
  };

  return (
    <Box
      sx={{
        maxWidth: "1200px",
        margin: "auto",
        padding: "20px",
        borderRadius: "20px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        backgroundColor: "#fff",
      }}
    >
      {/* Custom Stepper */}
      {renderStepper()}

      <MediaSlider reportData={reportData} />
      <ReportContent reportData={reportData} />
      <EngagementSection handleShare={handleShare} reportData={reportData} />
      <CommentsSection />
    </Box>
  );
}

export default ReportDetails;