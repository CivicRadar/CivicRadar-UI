export default function getCroppedImg(imageSrc, crop) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
  
        const width = crop.width;
        const height = crop.height;
  
        // Clamp to size limits
        const maxDim = 1080;
        const minDim = 100;
  
        const clampedWidth = Math.min(Math.max(width, minDim), maxDim);
        const clampedHeight = Math.min(Math.max(height, minDim), maxDim);
  
        canvas.width = clampedWidth;
        canvas.height = clampedHeight;
  
        ctx.drawImage(
          image,
          crop.x,
          crop.y,
          crop.width,
          crop.height,
          0,
          0,
          clampedWidth,
          clampedHeight
        );
  
        canvas.toBlob((blob) => {
          if (!blob) return reject(new Error("Canvas is empty"));
          const fileUrl = URL.createObjectURL(blob);
          resolve(fileUrl);
        }, "image/jpeg");
      };
  
      image.onerror = () => reject(new Error("Image load error"));
    });
  }
  