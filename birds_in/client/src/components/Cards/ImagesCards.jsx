import * as React from 'react'
import { Card, CardActionArea, CardActions, CardMedia, IconButton, Typography } from '@mui/material'
import { CarruselGallery } from '../Galeries/CarruselGallery';
import { useTheme } from '@emotion/react';


export const ImagesCards = ({ foto, name, index, arrayImages }) => {


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
    <Card
      sx={{
        maxWidth: 'auto',
        minWidth: 415,
        minHeight: 280,
        width:'200px',
        height:'194px',
        position: 'relative',
        borderRadius: '15px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden', // Oculta cualquier contenido que se desborde
      }}
    >
      <CardActionArea>
        <img
          src={foto}
          alt={name}
          key={index}
          onClick={() => handleImageClick(selectedImageIndex)}
          style={{
            width: '100%',
            height: '100%', // Establece la altura al 100% para ocupar todo el espacio de la tarjeta
            objectFit: 'cover',
            borderRadius: '15px',
          }}
        />
      </CardActionArea>

      <CarruselGallery
        isOpen={isGalleryOpen}
        images={arrayImages}
        selectedIndex={selectedImageIndex}
        onClose={() => setIsGalleryOpen(false)}
      />
    </Card>
  );
};






