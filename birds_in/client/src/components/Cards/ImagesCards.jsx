import * as React from 'react'
import { Card, CardActionArea, CardContent, Grid, Typography } from '@mui/material'
import { CarruselGallery } from '../Gallery/CarruselGallery';

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
        borderRadius: '6px',
        width: { xs: 360, md: 390 }, minWidth: { xs: 360, md: 390 }, margin: 0,
        flexDirection: 'column',
        overflow: 'hidden', // Oculta cualquier contenido que se desborde

      }}
    >

      <CardActionArea
        sx={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', }}
        onClick={() => handleImageClick(foto)}>
        <img
          src={foto}
          alt={name}
          key={foto}
          loading="lazy"
          style={{
            width: { xs: 360, md: 'auto' },
            height: 290, // Establece la altura al 100% para ocupar todo el espacio de la tarjeta
            objectFit: 'scale-down',
            // borderRadius: '15px',
          }}
        />
      </CardActionArea>
      <CardContent sx={{ height: 'auto', }}>
        <Grid container alignItems="center" spacing={1}>
          <Grid item xs={9}>
            <Typography
              variant="h6"
              color='primary.light'
            >
              {extractNameAfterUnderscore(foto)}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
      <CarruselGallery
        isOpen={isGalleryOpen}
        images={arrayImages}
        selectedIndex={selectedImageIndex}
        onClose={() => setIsGalleryOpen(false)}
      />

    </Card>
  );
};






