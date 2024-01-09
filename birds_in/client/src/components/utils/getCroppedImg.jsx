
export const getCroppedImg = (imageSrc, croppedAreaPixels) => {
    return new Promise((resolve) => {
      const image = new Image();
      image.src = imageSrc;
  
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
  
        // Establece dimensiones fijas para el lienzo
        const fixedWidth = 200;
        const fixedHeight = 200;
  
        canvas.width = fixedWidth;
        canvas.height = fixedHeight;
  
        // Calcula la relación de aspecto de la porción recortada
        const aspectRatio = croppedAreaPixels.width / croppedAreaPixels.height;
  
        // Calcula las dimensiones ajustadas para mantener la relación de aspecto
        let drawWidth = fixedWidth;
        let drawHeight = fixedHeight;
  
        if (aspectRatio > 1) {
          drawHeight = fixedWidth / aspectRatio;
        } else {
          drawWidth = fixedHeight * aspectRatio;
        }
  
        // Calcula la posición de inicio para centrar la porción recortada
        const drawX = (fixedWidth - drawWidth) / 2;
        const drawY = (fixedHeight - drawHeight) / 2;
  
        // Dibuja la porción recortada en el lienzo con dimensiones fijas
        ctx.drawImage(
          image,
          croppedAreaPixels.x,
          croppedAreaPixels.y,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
          drawX,
          drawY,
          drawWidth,
          drawHeight
        );
  
        // Convierte el lienzo a un objeto Blob y resuelve con la URL de la imagen recortada
        canvas.toBlob((blob) => {
          resolve(URL.createObjectURL(blob));
        }, 'image/jpeg');
      };
    });
  };