import { useEffect, useState } from 'react';
import { Grid, TextField, Button, Typography } from '@mui/material';

export const ManualOrderImages = ({
  initialImages,
  handleSetAsCover,
  handleDeleteCheckBox,
  handleImageClick,
  onSaveOrder
}) => {
  const [imagesState, setImagesState] = useState([]);
  const [displayImages, setDisplayImages] = useState([]);

  useEffect(() => {
    const withOrder = initialImages.map((img, index) => ({
      ...img,
      orden: img.orden ?? index + 1,
    }));
    setImagesState(withOrder);
    setDisplayImages(withOrder); // visualmente primero el orden original
  }, [initialImages]);

  const handleOrderChange = (id, newOrder) => {
    setImagesState((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, orden: parseInt(newOrder) || 0 } : img
      )
    );
  };

  const applyNewOrder = () => {
    const sorted = [...imagesState].sort((a, b) => a.orden - b.orden);
    setDisplayImages(sorted);
  };

  return (
    <>
      <Grid container spacing={2} sx={{ p: 2 }}>
        {displayImages.map((img, index) => (
          <Grid item xs={12} sm={6} md={3} key={img.id}>
            <div
              style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '10px',
                backgroundColor: 'white',
              }}
            >
              <TextField
                label="Orden"
                type="number"
                value={imagesState.find((i) => i.id === img.id)?.orden || ''}
                onChange={(e) => handleOrderChange(img.id, e.target.value)}
                fullWidth
                sx={{ mb: 1 }}
              />
              <img
                src={img.url}
                alt={`img-${index}`}
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

      <Grid container spacing={2} justifyContent="center" sx={{ mt: 2 }}>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={applyNewOrder}
          >
            Organizar
          </Button>
        </Grid>
        {onSaveOrder && (
          <Grid item>
            <Button
              variant="outlined"
              color="success"
              onClick={() => onSaveOrder(displayImages)}
            >
              Guardar orden
            </Button>
          </Grid>
        )}
      </Grid>
    </>
  );
};
