import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  IconButton,
  Box,
  Checkbox,
  TextField,
  Button,
  Tooltip,
  Fab
} from '@mui/material';
import BeenhereTwoToneIcon from '@mui/icons-material/BeenhereTwoTone';
import TurnedInTwoToneIcon from '@mui/icons-material/TurnedInTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SwitchAccessShortcutIcon from '@mui/icons-material/SwitchAccessShortcut';

const PhotosOrganizerContainer = ({
  initialImages,
  handleSetAsCover,
  handleDeleteCheckBox,
  handleImageClick,
  onSaveOrder,
  onSaveToDB,
  highlightedImage
}) => {
  const [images, setImages] = useState(initialImages || []);
  const [manualOrder, setManualOrder] = useState({});
  const [orientations, setOrientations] = useState({});
console.log(initialImages, 'soy imagen')
    useEffect(() => {
    setImages(initialImages || []);
  }, [initialImages])

   useEffect(() => {
    if (!initialImages) return;
    initialImages.forEach((img) => {
      const imageObj = new Image();
      imageObj.src = img?.url;
      imageObj.onload = () => {
        setOrientations((prev) => ({
          ...prev,
          [img.id]: imageObj.width > imageObj.height
        }));
      };
    });
  }, [initialImages]);

  // const handleManualOrderChange = (id, value) => {
  //   setManualOrder((prev) => ({
  //     ...prev,
  //     [id]: value
  //   }));
  // };

  React.useEffect(() => {
  if (initialImages && initialImages.length > 0) {
    const initialOrder = {};
    initialImages.forEach((img, index) => {
      initialOrder[img.id] = index + 1;
    });
    setManualOrder(initialOrder);
  }
}, [initialImages]);

  const handleOrganizeClick = () => {
    const sorted = [...images].sort((a, b) => {
      const orderA = parseInt(manualOrder[a.id], 10);
      const orderB = parseInt(manualOrder[b.id], 10);
      if (isNaN(orderA)) return 1;
      if (isNaN(orderB)) return -1;
      return orderA - orderB;
    });

    setImages(sorted);
    if (onSaveOrder) onSaveOrder(sorted);
  };

  const handleManualOrderChange = (id, value) => {
    const numericValue = parseInt(value, 10);
    if (numericValue < 0 && value !== '') return;

    const updatedOrder = {
      ...manualOrder,
      [id]: value
    };

    setManualOrder(updatedOrder);

    const sorted = [...images].sort((a, b) => {
      const orderA = parseInt(updatedOrder[a.id], 10);
      const orderB = parseInt(updatedOrder[b.id], 10);
      if (isNaN(orderA)) return 1;
      if (isNaN(orderB)) return -1;
      return orderA - orderB;
    });

    setImages(sorted);
    if (onSaveOrder) onSaveOrder(sorted);
  };

  const handleValidatedSave = () => {
  const values = Object.values(manualOrder)
    .filter(v => v !== '')
    .map(v => parseInt(v, 10))
    .filter(v => !isNaN(v));

  const hasDuplicates = new Set(values).size !== values.length;
  const isSequential = values
    .sort((a, b) => a - b)
    .every((num, idx) => num === idx + 1);

  if (hasDuplicates || !isSequential) {
    alert('El orden debe ser una secuencia única y consecutiva (1, 2, 3, ...).');
    return;
  }

  // Si pasa la validación, ordenamos las imágenes y las guardamos
  const sorted = [...images].sort((a, b) => {
    const orderA = parseInt(manualOrder[a.id], 10);
    const orderB = parseInt(manualOrder[b.id], 10);
    if (isNaN(orderA)) return 1;
    if (isNaN(orderB)) return -1;
    return orderA - orderB;
  });

  setImages(sorted);
  if (onSaveOrder) onSaveOrder(sorted);
  onSaveToDB(sorted)
};

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          gap: 2,
          px: 4,
          mb: 2,
          mt: -1
        }}
      >
        {/* <Tooltip title="Organizar fotos" placement="top">
          <Fab color="primary" onClick={handleOrganizeClick}>
            <SwitchAccessShortcutIcon />
          </Fab>
        </Tooltip> */}

        <Tooltip title="Guardar orden" placement="top">
          <Fab color="primary" onClick={handleValidatedSave}>
            <SaveIcon />
          </Fab>
        </Tooltip>
      </Box>

      <Grid container spacing={1} sx={{

        display: 'flex',
        justifyContent: 'center', // Centra horizontalmente las tarjetas
        alignItems: 'center',
      }}>
        {images.map((imageUrl, index) => (
          <Grid key={imageUrl.id} item>
            <Card sx={{
              borderRadius: '6px',
              p: '0 auto',
              width: { xs: 450, sm: 450, md: 470, lg: 470 },
              minWidth: { xs: 450, sm: 450, md: 470, lg: 470 },
              margin: '0px 0px',
              flexDirection: 'column',
              background: 'linear-gradient(to top, rgba(0,56,28,0.5), transparent)',
            }}>
              <CardActionArea
                sx={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                onClick={() => handleImageClick(imageUrl.url)}
              >
                <IconButton
                  aria-label="set as cover"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSetAsCover(imageUrl.id, imageUrl.url, imageUrl.destacada);
                  }}
                  sx={{
                    position: 'absolute',
                    top: 5,
                    left: 30,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}
                >
                  {imageUrl.destacada ? (
                    <Box sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      background: 'linear-gradient(to top, rgba(0,56,28,0.50), transparent)',
                      borderRadius: '0px 0px 30px 30px',
                    }}>
                      <Typography variant="h4" color='primary' sx={{ mb: 0.5, color: 'white', m: 0.5 }}>
                        Portada
                      </Typography>
                      <BeenhereTwoToneIcon fontSize="large" sx={{ mb: 0.5, color: 'yellow' }} />
                    </Box>
                  ) : (
                    <TurnedInTwoToneIcon fontSize="large" sx={{ mb: 0.5, color: 'orange' }} />
                  )}
                </IconButton>
                <img
                  src={imageUrl.url}
                  alt={`Imagen ${index + 1}`}
                  style={{
                    height: 290,
                    objectFit: orientations[imageUrl.id] ? 'cover' : 'scale-down',
                    width: '100%',
                  }}
                  loading="lazy"
                />
              </CardActionArea>
              <CardContent sx={{ height: 'auto' }}>
                <Grid container alignItems="center" spacing={1}>
                  <Grid item xs={9}>
                    <Typography variant="h6" color="white">
                      {imageUrl.titulo}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Checkbox
                      color="error"
                      onChange={() => handleDeleteCheckBox(imageUrl.id, imageUrl.url)}
                      sx={{ position: 'absolute', left: '85%', mt: -3 }}
                    />
                    <Typography
                      variant="h4"
                      sx={{
                        position: 'absolute',
                        mt: 1,
                        left: '83%',
                        fontSize: 'medium',
                        mb: 1
                      }}
                      color='error'
                    >
                      Eliminar
                    </Typography>
                  </Grid>
                </Grid>
                <TextField
                  label="Orden"
                  type="number"
                  size="small"
                  variant="outlined"
                  value={manualOrder[imageUrl.id] || ''}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    if (value >= 0 || e.target.value === '') {
                      handleManualOrderChange(imageUrl.id, e.target.value);
                    }
                  }}
                  sx={{
                    mt: 2,
                    width: '80px',
                    input: { color: 'white', textAlign: 'center' },
                    label: { color: 'white' },
                  }}
                  InputProps={{
                    style: {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    }
                  }}
                />

              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>



    </>
  );
};

export default PhotosOrganizerContainer;
