import React, { useState, useEffect, useRef, useImperativeHandle } from 'react';
import {
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  IconButton,
  Box,
  Checkbox,
  Tooltip,
  Fab
} from '@mui/material';
import BeenhereTwoToneIcon from '@mui/icons-material/BeenhereTwoTone';
import TurnedInTwoToneIcon from '@mui/icons-material/TurnedInTwoTone';
import SaveIcon from '@mui/icons-material/Save';

const PhotosOrganizerContainer = React.forwardRef(({
  initialImages,
  handleSetAsCover,
  handleDeleteCheckBox,
  handleImageClick,
  onSaveOrder,
  onSaveToDB,
  highlightedImage
}, ref) => {
  const [images, setImages] = useState(initialImages || []);
  const [orientations, setOrientations] = useState({});
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedToMoveIndex, setSelectedToMoveIndex] = useState(null);
console.log(images,'imagenes ne organizer')
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleFocus = () => console.log('🟢 FOCUS ganado');
    const handleBlur = () => console.log('🔴 FOCUS perdido');

    container.addEventListener('focus', handleFocus);
    container.addEventListener('blur', handleBlur);

    return () => {
      container.removeEventListener('focus', handleFocus);
      container.removeEventListener('blur', handleBlur);
    };
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, []);

  useEffect(() => {
    setImages(initialImages || []);
  }, [initialImages]);

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

  const handleSave = () => {
    if (onSaveOrder) onSaveOrder(images);
    if (onSaveToDB) onSaveToDB(images);
  };

  useImperativeHandle(ref, () => ({
    focusContainer: () => {
      containerRef.current?.focus();
    },
    getCurrentImages: () => images
  }));

  const handleBlur = () => {
    setTimeout(() => {
      const active = document.activeElement;

      const isInsideContainer = containerRef.current?.contains(active);
      const isInEliminarBtn = document.getElementById('boton-eliminar')?.contains(active);
      const isInBuscarBtn = document.getElementById('boton-buscar')?.contains(active);
      const isInInfoBtn = document.getElementById('info-boton')?.contains(active);

      if (
        selectedToMoveIndex !== null &&
        !isInsideContainer &&
        !isInEliminarBtn &&
        !isInBuscarBtn &&
        !isInInfoBtn
      ) {
        containerRef.current?.focus();
      }
    }, 50);
  };


  const handleKeyDown = (event) => {
    if (selectedToMoveIndex === null) return;

    if (event.key === '1' && selectedToMoveIndex > 0) {
      const newImages = [...images];
      [newImages[selectedToMoveIndex - 1], newImages[selectedToMoveIndex]] =
        [newImages[selectedToMoveIndex], newImages[selectedToMoveIndex - 1]];
      setImages(newImages);
      setSelectedToMoveIndex(selectedToMoveIndex - 1);
    }

    if (event.key === '2' && selectedToMoveIndex < images.length - 1) {
      const newImages = [...images];
      [newImages[selectedToMoveIndex + 1], newImages[selectedToMoveIndex]] =
        [newImages[selectedToMoveIndex], newImages[selectedToMoveIndex + 1]];
      setImages(newImages);
      setSelectedToMoveIndex(selectedToMoveIndex + 1);
    }

    if (event.key === 'Delete') {
      const imageToDelete = images[selectedToMoveIndex];
      if (imageToDelete) {
        handleDeleteCheckBox(imageToDelete.id, imageToDelete.url);
        const newImages = images.filter((_, i) => i !== selectedToMoveIndex);
        setImages(newImages);
        setSelectedToMoveIndex(null);
      }
    }
  };


  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onBlur={handleBlur}
      onFocus={() => console.log('🟢 FOCUS ganado')}
      onKeyDown={handleKeyDown}
      style={{ outline: 'none' }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', gap: 2, px: 4, mb: 2, mt: -1 }}>
        <Tooltip title="Guardar orden" placement="top">
          <Fab color="primary" onClick={handleSave}>
            <SaveIcon />
          </Fab>
        </Tooltip>
      </Box>
      <Typography variant="h4" color="primary" sx={{ px: 4, mb: 2, mt: -1 }}>
        Usa <strong>1</strong> para mover a la Izquierda <strong>2</strong> para mover a la Derecha
      </Typography>
      <Grid container spacing={1} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {images.map((imageUrl, index) => (
          <Grid key={imageUrl.id} item>
            <Card
              sx={{
                borderRadius: '6px',
                width: { xs: 450, sm: 450, md: 470, lg: 470 },
                minWidth: { xs: 450, sm: 450, md: 470, lg: 470 },
                margin: '0px 0px',
                flexDirection: 'column',
                background: 'linear-gradient(to top, rgba(0,56,28,0.5), transparent)',
                border: selectedToMoveIndex === index ? '3px solid #FFD700' : 'none'
              }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex(index);
                setTimeout(() => {
                  containerRef.current?.focus();
                }, 0);
              }}

              onDoubleClick={(e) => {
                e.stopPropagation();
                if (selectedIndex === index) setSelectedIndex(null);
              }}

            >
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
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'linear-gradient(to top, rgba(0,56,28,0.50), transparent)', borderRadius: '0px 0px 30px 30px' }}>
                      <Typography variant="h4" color="white" sx={{ mb: 0.5, m: 0.5 }}>Portada</Typography>
                      <BeenhereTwoToneIcon fontSize="large" sx={{ mb: 0.5, color: 'yellow' }} />
                    </Box>
                  ) : (
                    <TurnedInTwoToneIcon fontSize="large" sx={{ mb: 0.5, color: 'orange' }} />
                  )}
                </IconButton>
                <img
                  src={imageUrl.url}
                  alt={`Imagen ${index + 1}`}
                  style={{ height: 290, objectFit: orientations[imageUrl.id] ? 'cover' : 'scale-down', width: '100%' }}
                  loading="lazy"
                />
              </CardActionArea>
              <CardContent sx={{ height: 'auto' }}>
                <Grid container alignItems="center" spacing={1}>
                  <Grid item xs={9} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox
                      color="success"
                      checked={selectedToMoveIndex === index}
                      onChange={(e) => {
                        e.stopPropagation();
                        setSelectedToMoveIndex(e.target.checked ? index : null);
                      }}
                      inputProps={{ 'aria-label': 'Seleccionar para mover' }}
                      sx={{ p: 0, mr: 1 }}
                    />
                    <Typography variant="h6" color="white">{imageUrl.titulo}</Typography>
                  </Grid>

                  <Grid item xs={3}>
                    <Checkbox
                      id="boton-eliminar"
                      color="error"
                      onChange={() => handleDeleteCheckBox(imageUrl.id, imageUrl.url)}
                      sx={{ position: 'absolute', left: '85%', mt: -3 }}
                    />
                    <Typography
                      variant="h4"
                      sx={{ position: 'absolute', mt: 1, left: '83%', fontSize: 'medium', mb: 1 }}
                      color="error"
                    >
                      Eliminar
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
});

export default PhotosOrganizerContainer;