import * as React from 'react'
import { Card, CardActionArea, CardActions, CardMedia, IconButton, Typography } from '@mui/material'
import { CarruselGallery } from '../Galeries/CarruselGallery';
import { useTheme } from '@emotion/react';


export const Cards = ({ foto, name, index }) => {
  console.log('soy', foto)

  const theme = useTheme()
  const [isGalleryOpen, setIsGalleryOpen] = React.useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);

  const openGallery = () => {
    setIsGalleryOpen(true);
  };

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
    openGallery();
  };

  return (
    <Card sx={{
      maxWidth: 'auto',
      minWidth: 415,
      minHeight: 280, // Establece una altura mínima para la tarjeta
      position: 'relative',
      borderRadius: '15px',
      display: 'flex', // Establece la tarjeta como un contenedor flexible
      flexDirection: 'column', // Alinea el contenido verticalmente
      justifyContent: 'space-between', // Centra verticalmente el contenido
    }}>
      <CardActionArea>
        {foto[selectedImageIndex] && foto[selectedImageIndex].url ? (
          <CardMedia
            component="img"
            height="194"
            image={foto[selectedImageIndex].url}
            alt={name}
            key={index}
            onClick={() => handleImageClick(selectedImageIndex)}
            sx={{ objectFit: 'cover' }}
          />
        ) : (
          <Typography variant="body2">Imagen no disponible</Typography>
        )}
      </CardActionArea>
      <CardActions disableSpacing>
        <Typography>
          {name}
        </Typography>
      </CardActions>
      <CarruselGallery
        isOpen={isGalleryOpen}
        images={foto}
        selectedIndex={selectedImageIndex}
        onClose={() => setIsGalleryOpen(false)} />
    </Card>
  );
}






