import { useEffect, useState } from 'react';
import { Grid, Checkbox, Button } from '@mui/material';

export const ImageOrderListWithKeyboard = ({
  images,
  setImages,
  handleSetAsCover,
  handleDeleteCheckBox,
  handleImageClick,
}) => {
  const [selectedToMove, setSelectedToMove] = useState(null); // imagen marcada para mover

  // Mover imagen
  const moveImage = (direction) => {
    if (selectedToMove === null) return;

    const index = images.findIndex((img) => img.id === selectedToMove.id);
    const newIndex = index + direction;

    if (newIndex < 0 || newIndex >= images.length) return;

    const newImages = [...images];
    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
    setImages(newImages);
  };

  // Capturar teclas globalmente
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowUp') {
        moveImage(-1);
      } else if (event.key === 'ArrowDown') {
        moveImage(1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedToMove, images]);

  return (
    <Grid container spacing={2} sx={{ padding: 2 }}>
      {images.map((img, index) => (
        <Grid item xs={12} sm={6} md={3} key={img.id}>
          <div
            style={{
              border: selectedToMove?.id === img.id ? '2px solid #1976d2' : '1px solid #ccc',
              borderRadius: '8px',
              padding: '8px',
              backgroundColor: 'white',
            }}
          >
            <Checkbox
              checked={selectedToMove?.id === img.id}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedToMove(img);
                } else {
                  setSelectedToMove(null);
                }
              }}
            />
            <img
              src={img.url}
              alt={`imagen-${index}`}
              onClick={() => handleImageClick(img.url)}
              style={{ width: '100%', borderRadius: '8px', cursor: 'pointer' }}
            />
            <Button
              fullWidth
              variant="outlined"
              sx={{ mt: 1 }}
              onClick={() => handleSetAsCover(img.id, img.url, img.destacada)}
            >
              Establecer como portada
            </Button>
            <Button
              fullWidth
              variant="outlined"
              color="error"
              sx={{ mt: 1 }}
              onClick={() => handleDeleteCheckBox(img.id, img.url)}
            >
              Marcar para eliminar
            </Button>
          </div>
        </Grid>
      ))}
    </Grid>
  );
};
