import { Typography, Box, Button } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #021524, #023, #034, #056)",
        backgroundSize: "400% 400%",
        animation: "gradientAnimation 10s ease infinite",
        color: "white",
        textAlign: "center",
        overflow: "hidden",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 100, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <Typography variant="h3" component="h1" sx={{ color: "#00e5ff" }} gutterBottom>
          انژکتور تبریز تقدیم میکند 
        </Typography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.8 }}
      >
        <Typography variant="h5" component="h2" sx={{ color: "#b0bec5" }}>
      صفحه اصلی : هنوز در مراحل اولیه       
</Typography>
      </motion.div>

      {/* Login/Signup Button */}
      <motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 1, ease: "easeOut", delay: 1.2 }}
>
  <Button
    variant="contained"
    sx={{
      position: "absolute",
      top: 20,
      right: 20,
      background: "#034",
      color: "white",
      ':hover': {
        background: "#056",
      },
    }}
    onClick={() => navigate("/signuplogin")}
  >
    Login / Signup
  </Button>
</motion.div>

    </Box>
  );
}

export default LandingPage;
