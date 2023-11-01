import * as React from 'react'
import { Card, CardActionArea } from '@mui/material'
import { CarruselGallery } from '../Galeries/CarruselGallery';
import { useTheme } from '@emotion/react';


export const ImagesCards = ({ foto, name, index, arrayImages }) => {
  const theme = useTheme()
  const [isGalleryOpen, setIsGalleryOpen] = React.useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = React.useState('');


  const openGallery = (foto) => {
    // console.log('Clic en la imagen, índice:', index);
    // console.log('Clic en la imagen, nombre:', foto);
    setSelectedImageIndex(foto);
    setIsGalleryOpen(true);
  };

  // const handleImageClick = (index) => {
  //   setSelectedImageIndex(index);
  //   openGallery();
  // };

  return (
    <Card
      sx={{
        maxWidth: 'auto',
        minWidth: 415,
        minHeight: 280,
        width: '200px',
        height: '194px',
        position: 'relative',
        borderRadius: '15px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden', // Oculta cualquier contenido que se desborde
        mb:5
      }}
    >
      <CardActionArea onClick={() => openGallery(index)}>
        <img
          src={foto}
          alt={name}
          key={index}
          // onClick={() => handleImageClick(selectedImageIndex)}
          style={{
            width: '100%',
            height: '100%', // Establece la altura al 100% para ocupar todo el espacio de la tarjeta
            objectFit: 'cover',
            borderRadius: '15px',
          }}
          loading="lazy"
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






