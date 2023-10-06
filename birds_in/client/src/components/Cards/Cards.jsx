import * as React from 'react'
import { Card, CardActionArea, CardActions, CardMedia, IconButton, Typography } from '@mui/material'
import { CarruselGallery } from '../Galeries/CarruselGallery';
import { useTheme } from '@emotion/react';
import { useDispatch } from 'react-redux';
import { sendParameter } from '../../redux/actions/fetchAllBirds';

export const Cards = ({ foto, name, index }) => {

  const theme = useTheme()
  const dispatch = useDispatch()
  const [isGalleryOpen, setIsGalleryOpen] = React.useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
  const destacadaImage = foto.find((img) => img.destacada);

  const openGallery = () => {
    setIsGalleryOpen(true);
  };

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
    openGallery();
  };

  const handleDetailClick = () => {
    const selectOption = { ingles: [{ nombre: name }] };
    dispatch(sendParameter(selectOption))
  };

  return (
    <Card sx={{
      maxWidth: 'auto',
      minWidth: 415,
      minHeight: 320, // Establece una altura mínima para la tarjeta
      position: 'relative',
      borderRadius: '15px',
      display: 'flex', // Establece la tarjeta como un contenedor flexible
      flexDirection: 'column', // Alinea el contenido verticalmente
      justifyContent: 'space-between', // Centra verticalmente el contenido
    }}>
      <CardActionArea>
        {destacadaImage && destacadaImage.url ? (
          <CardMedia
            component="img"
            height="260"
            image={destacadaImage.url}
            alt={name}
            key={index}
            onClick={handleDetailClick}
            sx={{ objectFit: 'cover' }}
          />
        ) : (
          <Typography variant="body2">Imagen no disponible</Typography>
        )}
      </CardActionArea>
      <CardActions disableSpacing>
        <Typography onClick={handleDetailClick} style={{ cursor: 'pointer' }}>
          {name}
        </Typography>
      </CardActions>
      <CarruselGallery
        isOpen={isGalleryOpen}
        images={foto}
        selectedIndex={selectedImageIndex}
        onClose={() => setIsGalleryOpen(false)}
      />
    </Card>
  );
};






