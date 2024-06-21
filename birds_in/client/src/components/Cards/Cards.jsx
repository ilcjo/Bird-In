import * as React from 'react'
import { Card, CardActionArea, CardActions, CardMedia, Divider, IconButton, Typography } from '@mui/material'
import { useTheme } from '@emotion/react';
import { useDispatch } from 'react-redux';
import { sendParameter } from '../../redux/actions/fetchAllBirds';
import { Loading } from '../utils/Loading';

export const Cards = React.memo(({ foto, name, index }) => {

  const theme = useTheme()
  const dispatch = useDispatch()
  const [isGalleryOpen, setIsGalleryOpen] = React.useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
  const [showBackdrop, setShowBackdrop] = React.useState(false);
  const [loadingMessage, setLoadingMessage] = React.useState('Cargando..')
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
    setTimeout(() => {
      setShowBackdrop(false); // Desactivar el estado de carga después de 2 segundos
      setIsGalleryOpen(true);
    }, 2000);
  };

  return (
    <Card sx={{
      minWidth: { xs: 380, lg: 405 },
      maxWidth: { xs: 380, lg: 405 },
      minHeight: 330,
      maxHeight: 330,
      position: 'relative',
      borderRadius: '6px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      backgroundColor: '#103300',

    }}>
      <CardActionArea>
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
              }}
            />
            <div style={{
              position: 'absolute',
              bottom: 20,
              width: '100%',
              background: 'linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent)',
              padding: '30px'
            }}>
              <Divider sx={{ my: 2, borderColor: theme.palette.primary.main, width: '20%', height: '2px', borderBottomWidth: '3px', borderRadius: '10px', }} />
              <Typography
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
          <Typography variant="body2">Imagen no disponible</Typography>
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






