import * as React from 'react'
import { Card, CardActionArea, Typography } from '@mui/material'
import { CarruselGallery } from '../Galeries/Aves/CarruselGallery';

export const ImagesCards = ({ foto, name, arrayImages }) => {

  const [isGalleryOpen, setIsGalleryOpen] = React.useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = React.useState('');

  const handleImageClick = (url) => {
    setSelectedImageIndex(url);
    setIsGalleryOpen(true)
  };

  const extractNameAfterUnderscore = (url) => {
    const firstUnderscoreIndex = url.indexOf('_');
    if (firstUnderscoreIndex !== -1 && firstUnderscoreIndex !== url.length - 1) {
      return url.substring(firstUnderscoreIndex + 1);
    } else {
      return url;
    }
  };

  return (
    <Card
      sx={{

        // maxWidth: '100%',
        // minWidth: 415,
        // minHeight: 280,
        // width: '200px',
        // height: '194px',
        position: 'relative',
        borderRadius: '15px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden', // Oculta cualquier contenido que se desborde
        mb: 5
      }}
    >

      <CardActionArea onClick={() => handleImageClick(foto)}>
        <Typography
          variant="h5"
          sx={{
            position: 'absolute',
            bottom: '25px',
            left: '10px',
            color: 'white', // Puedes ajustar el color del texto según tus preferencias
            fontWeight: 'bold',
            zIndex: 10, // Asegura que el texto esté encima de la imagen
            background: 'rgba(0, 56, 28, 0.4)',
          }}
        >
          {extractNameAfterUnderscore(foto)}
        </Typography>
        <img
          src={foto}
          alt={name}
          key={foto}
          style={{
            width: 420,
            height: 290, // Establece la altura al 100% para ocupar todo el espacio de la tarjeta
            objectFit: 'scale-down',
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






