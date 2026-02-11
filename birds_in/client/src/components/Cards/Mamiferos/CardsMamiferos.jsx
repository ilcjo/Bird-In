import * as React from 'react';
import { Box, Button, Card, CardActionArea, CardActions, CardMedia, Divider, Typography } from '@mui/material';
import { useTheme } from '@emotion/react';
import { useDispatch } from 'react-redux';
import { Loading } from '../../utils/Loading';
import { sendParameter } from '../../../redux/mamiferos/actions/filterAction';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
export const CardsMamiferos = React.memo(({ foto, name, index }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [isGalleryOpen, setIsGalleryOpen] = React.useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
  const [showBackdrop, setShowBackdrop] = React.useState(false);
  const [loadingMessage, setLoadingMessage] = React.useState('Cargando..');
  const destacadaImage = foto.find((img) => img.destacada);

  const memoizedDispatch = React.useCallback(
    (selectOption) => {
      dispatch(sendParameter(selectOption));
    },
    [dispatch]
  );

  const openGallery = () => {
    setIsGalleryOpen(true);
  };

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
    openGallery(true);
  };

  const handleDetailClick = () => {
    setShowBackdrop(true);
    const selectOption = { ingles: [{ nombre: name }] };
    memoizedDispatch(selectOption);
    localStorage.setItem('selectedRegistro', JSON.stringify(selectOption));
    setTimeout(() => {
      setShowBackdrop(false);
      setIsGalleryOpen(true);
    }, 2000);
  };

  return (
    <Card
      sx={{
        minWidth: { xs: 340, lg: 470 },
        maxWidth: { xs: 340, lg: 470 },
        minHeight: 330,
        maxHeight: 330,
        position: 'relative',
        borderRadius: '6px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#103300',
        transition: 'transform 0.3s ease-out',
        '&:hover': {
          // transform: 'scale(1.02)',
        },
        '&:hover .divider': {
          width: '50%',
          transition: 'transform 0.3s ease-out',
        },
        '&:hover .title': {
          fontSize: '2rem',
          color: 'white'
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          '&:hover img': {
            opacity: 0.8,
          },
        }}
      >
        {/* <CardActionArea sx={{ position: 'relative' }}> */}
        {destacadaImage && destacadaImage.url ? (
          <div style={{ position: 'relative' }}>
            <CardMedia
              component="img"
              height="350"
              width="400"
              image={destacadaImage.url}
              alt={name}
              key={index}
              // onClick={handleDetailClick}
              sx={{
                objectFit: 'cover',
                objectPosition: 'center center',
                background: 'linear-gradient(to top, rgba(11, 53, 15, 0.45), transparent)',
                transition: 'opacity 0.3s ease-in-out',
                '&:hover': {
                  opacity: 0.8,
                },
              }}
              onContextMenu={(e) => e.preventDefault()} // Deshabilita el clic derecho
              onDragStart={(e) => e.preventDefault()} // Evita arrastrar la imagen
            />
            <div
              style={{
                position: 'absolute',
                bottom: 20,
                width: '100%',
                background: 'linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent)',
                padding: '35px',
                transition: 'transform 0.3s ease-out',
              }}
            >

              <Typography
                className="title"
                variant="h2"
                color="primary"
                // onClick={handleDetailClick}
                // style={{ cursor: 'pointer' }}
                sx={{ color: 'white', mb: 2 }}
              >
                {name}
              </Typography>
              <Button
                sx={{
                  position: 'absolute',
                  right: 80,
                  bottom: 24,
                  borderColor: 'rgba(255,255,255,0.6)',
                  color: '',
                  fontWeight: 'bold',
                  backdropFilter: 'blur(4px)',
                  '&:hover': {
                    backgroundColor: 'rgba(33, 31, 31, 0.15)',
                    borderColor: 'white',
                  },
                }}
                onClick={handleDetailClick}
                color='secondary'
                variant="outlined"
                endIcon={<ArrowForwardIcon />}>
                Ver Ficha
              </Button>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Typography variant="body2" color="primary" sx={{ mb: 4 }}>
              Sin imágenes ó sin portada seleccionada
            </Typography>
            <Typography
              className="title"
              variant="h2"
              color="primary"
              // onClick={handleDetailClick}
              // style={{ cursor: 'pointer' }}
              sx={{ color: 'white', fontWeight: 'bold' }}
            >
              {name}
            </Typography>
          </div>
        )}
     </Box>
      <CardActions disableSpacing></CardActions>
      <Loading message={loadingMessage} open={showBackdrop} />
    </Card>
  );
});

