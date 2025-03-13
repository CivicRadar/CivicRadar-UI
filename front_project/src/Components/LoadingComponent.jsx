import React from "react";
import { Backdrop, CircularProgress, Typography, Box } from "@mui/material";

const LoadingComponent = ({ isLoading }) => {
    return (
        <Backdrop
            open={isLoading}
            sx={{
                color: "#fff",
                zIndex: (theme) => theme.zIndex.drawer + 1,
                background: "linear-gradient(135deg, rgba(0,0,0,0.7) 10%, rgba(72,85,99,0.8) 50%, rgba(0,0,0,0.7) 90%)",
                backdropFilter: "blur(8px)", 
                transition: "all 0.5s ease-in-out", 
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Box 
                sx={{
                    display: "flex", 
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "20px",
                    borderRadius: "12px",
                    backgroundColor: "rgba(255,255,255,0.1)", 
                    boxShadow: "0px 4px 20px rgba(255, 255, 255, 0.1)", 
                }}
            >
                <CircularProgress 
                    sx={{ 
                        color: "#90caf9", 
                        animation: "spin 1.2s linear infinite",
                    }} 
                    size={60} 
                    thickness={4} 
                />
                <Typography 
                    variant="h6" 
                    sx={{ 
                        marginTop: 2, 
                        fontWeight: "bold", 
                        letterSpacing: "1px", 
                        color: "#fff",
                        textShadow: "0px 0px 8px rgba(255,255,255,0.5)", 
                        animation: "fadeText 1.5s infinite alternate", 
                    }}
                >
                   ...لطفاً صبر کنید
                </Typography>
            </Box>

            <style>
                {`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                @keyframes fadeText {
                    0% { opacity: 0.6; }
                    100% { opacity: 1; }
                }
                `}
            </style>
        </Backdrop>
    );
};

export default LoadingComponent;
