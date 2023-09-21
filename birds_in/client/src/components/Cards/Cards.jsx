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
      maxheigth: 'auto',
      minheigth: 399,
      position: 'relative',
      borderRadius: '15px'
      // background: 'linear-gradient(rgba(137, 138, 108, 0), rgba(0, 61, 21, 0.5))',
    }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="194"
          image={foto[selectedImageIndex].url}
          alt={name}
          key={index}
          onClick={() => handleImageClick(selectedImageIndex)}
          sx={{ objectFit: 'cover', }}
        />
      </CardActionArea>
      <CardActions disableSpacing >
        <Typography>
          {name}
        </Typography>

      </CardActions>
      <CarruselGallery
        isOpen={isGalleryOpen}
        images={foto}
        selectedIndex={selectedImageIndex}
        onClose={() => setIsGalleryOpen(false)} />
    </Card >

  )
}
