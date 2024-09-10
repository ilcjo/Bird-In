import * as React from 'react'
import { Card, CardActionArea, CardActions, CardMedia, Divider, Typography } from '@mui/material'
import { useTheme } from '@emotion/react';
import { useDispatch } from 'react-redux';
import { Loading } from '../../utils/Loading';
import { sendParameter } from '../../../redux/insectos/actions/filterAction';

export const CardsInsecto = React.memo(({ foto, name, index }) => {
  // console.log(foto)
  const theme = useTheme()
  const dispatch = useDispatch()
  const [isGalleryOpen, setIsGalleryOpen] = React.useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
  const [showBackdrop, setShowBackdrop] = React.useState(false);
  const [loadingMessage, setLoadingMessage] = React.useState('Cargando..')
  const destacadaImage = foto.find((img) => img.destacada);
  // console.log(destacadaImage)
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
    // Guardar la información del ave seleccionada en localStorage
    localStorage.setItem('selectedRegistro', JSON.stringify(selectOption));
    setTimeout(() => {
      setShowBackdrop(false); // Desactivar el estado de carga después de 2 segundos
      setIsGalleryOpen(true);
    }, 2000);
  };

  return (
    <Card sx={{
      minWidth: { xs: 380, lg: 430 },
      maxWidth: { xs: 380, lg: 430 },
      minHeight: 330,
      maxHeight: 330,
      position: 'relative',
      borderRadius: '6px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      backgroundColor: '#103300',
      transition: 'transform 0.3s ease-out', // Transición para el efecto de agrandamiento del título y divider
      '&:hover': {
        transform: 'scale(1.02)', // Escala aumentada al hacer hover
      },
      '&:hover .divider': {
        width: '50%',
        transition: 'transform 0.3s ease-out', // Ancho del divider al hacer hover
      },
      '&:hover .title': {
        fontSize: '2rem', // Tamaño de fuente más grande al hacer hover
        color: 'white'
      },

    }}>
      <CardActionArea sx={{ position: 'relative', }}>
        {destacadaImage && destacadaImage.url ? (
          <div style={{ position: 'relative' }}>
            <CardMedia
              component="img"
              height="350"
              width='400'
              image={destacadaImage.url}
              alt={name}
              key={index}
              onClick={handleDetailClick}
              sx={{
                objectFit: 'cover', objectPosition: 'center center ',
                background: 'linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent)',
                transition: 'opacity 0.3s ease-in-out',
                '&:hover': {
                  opacity: 0.8, // Opacidad reducida al hacer hover
                },
              }}
              onContextMenu={(e) => e.preventDefault()} // Deshabilita el clic derecho
              onDragStart={(e) => e.preventDefault()} // Evita arrastrar la imagen
            />
            <div style={{
              position: 'absolute',
              bottom: 20,
              width: '100%',
              background: 'linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent)',
              padding: '30px',
              transition: 'transform 0.3s ease-out', // Transición para la posición del divider y título
            }}>
              <Divider className="divider" sx={{ my: 2, borderColor: theme.palette.primary.main, width: '20%', height: '2px', borderBottomWidth: '3px', borderRadius: '10px', }} />
              <Typography
                className="title"
                variant='h2'
                color='primary'
                onClick={handleDetailClick}
                style={{ cursor: 'pointer' }}
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                }}
              >
                {name}
              </Typography>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Typography variant='body2' color='primary' sx={{ mb: 4 }}>
              Sin imágenes ó sin portada seleccionada
            </Typography>
            <Typography
              className="title"
              variant='h2'
              color='primary'
              onClick={handleDetailClick}
              style={{ cursor: 'pointer' }}
              sx={{ color: 'white', fontWeight: 'bold' }}
            >
              {name}
            </Typography>
          </div>
        )}
      </CardActionArea>
      <CardActions disableSpacing>
      </CardActions>
      <Loading
        message={loadingMessage}
        open={showBackdrop}
      />
    </Card>
  );
});






