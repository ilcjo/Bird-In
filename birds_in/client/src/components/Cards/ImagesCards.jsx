import * as React from 'react';
import { Card, CardActionArea, CardContent, Grid, Typography } from '@mui/material';
import { CarruselGallery } from '../Gallery/CarruselGallery';

export const ImagesCards = ({ foto, name, arrayImages }) => {
  const [isGalleryOpen, setIsGalleryOpen] = React.useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = React.useState('');
  const [isHorizontal, setIsHorizontal] = React.useState(false);

  const handleImageClick = (url) => {
    setSelectedImageIndex(url);
    setIsGalleryOpen(true);
  };

  const extractNameAfterUnderscore = (url) => {
    const firstUnderscoreIndex = url.indexOf('_');
    if (firstUnderscoreIndex !== -1 && firstUnderscoreIndex !== url.length - 1) {
      return url.substring(firstUnderscoreIndex + 1);
    } else {
      return url;
    }
  };

  // Determine if the image is horizontal or vertical
  React.useEffect(() => {
    const img = new Image();
    img.src = foto;
    img.onload = () => {
      setIsHorizontal(img.width > img.height);
    };
  }, [foto]);

  return (
    <Card
      sx={{
        borderRadius: '6px',
        width: { xs: '100%', sm: 480, md: 480, lg: 480},
        minWidth: { xs: '100%', sm: 480, md: 480, lg: 480 },
        margin: 0,
        flexDirection: 'column',
        overflow: 'hidden',
        m: 0.5
      }}
    >
      <CardActionArea
        sx={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onClick={() => handleImageClick(foto)}
      >
        <img
          src={foto}
          alt={name}
          key={foto}
          loading="lazy"
          style={{
            height: 290,
            width: '100%',
            objectFit: isHorizontal ? 'cover' : 'scale-down',
          }}
          onContextMenu={(e) => e.preventDefault()} // Disable right-click
          onDragStart={(e) => e.preventDefault()}   // Prevent drag
        />
      </CardActionArea>
      <CardContent sx={{ height: 'auto' }}>
        <Grid container alignItems="center" spacing={1}>
          <Grid item xs={9}>
            <Typography variant="h6" color="primary.light">
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
