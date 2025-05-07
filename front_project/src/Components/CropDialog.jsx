import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Dialog, DialogActions, DialogContent, DialogTitle, Slider, Button } from "@mui/material";
import getCroppedImg from "./cropUtils"; // helper function defined below

const CropDialog = ({ imageSrc, open, onClose, onCropComplete }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleCropDone = async () => {
    const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
    onCropComplete(croppedImage);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Crop Image</DialogTitle>
      <DialogContent sx={{ position: "relative", height: 400, background: "#333" }}>
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={handleCropComplete}
        />
      </DialogContent>
      <DialogActions>
        <Slider
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          onChange={(e, zoom) => setZoom(zoom)}
          sx={{ mx: 2, flexGrow: 1 }}
        />
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleCropDone}>Crop</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CropDialog;
