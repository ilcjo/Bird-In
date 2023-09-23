import * as React from 'react'
import { Backdrop, Button, Card, CardActions, CardMedia, CircularProgress, Typography, useTheme } from '@mui/material'
import { useDispatch } from 'react-redux';
import { idSelectedUpdate } from '../../redux/slices/createSlice';
import { getInfoForUpdate } from '../../redux/actions/createBirds';


export const CardsUpdate = ({ foto, name, ave, onClick, isEnable }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [loadingMessage, setLoadingMessage] = React.useState('Cargando...');
  const theme = useTheme();
  const dispatch = useDispatch();

  const handleCardClick = async () => {
    setIsLoading(true);
    dispatch(idSelectedUpdate(ave));

    try {
      // Simula una carga de información aquí (reemplaza con tu lógica real)
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Ejemplo: esperar 2 segundos

      // Obtén la información de la actualización
      dispatch(getInfoForUpdate(ave));
    } catch (error) {
      // Maneja errores si es necesario
      console.error('Error al cargar información:', error);
    } finally {
      setIsLoading(false);
      setLoadingMessage('Cargando...');
    }

    onClick();
  };

  return (
    <React.Fragment>
      <Card sx={{
        maxWidth: 'auto',
        minWidth: 415,
        minHeight: 280, // Establece una altura mínima para la tarjeta
        position: 'relative',
        borderRadius: '15px',
        display: 'flex', // Establece la tarjeta como un contenedor flexible
        flexDirection: 'column', // Alinea el contenido verticalmente
        justifyContent: 'space-between', // Centra verticalmente el contenido
      }}>
        <CardMedia
          component="img"
          height="194"
          // image={foto}
          alt={name}
          key={ave}
          sx={{ objectFit: 'cover' }}
        />
        <CardActions disableSpacing >
          <Typography>
            {name}
          </Typography>
          <Button onClick={handleCardClick}>Editar</Button>
        </CardActions>

      </Card>
      <Backdrop
        sx={{
          zIndex: theme => theme.zIndex.drawer + 1,
          color: '#fff',
        }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
        <Typography variant="h5" color="inherit" sx={{ ml: 2 }}>
          {loadingMessage}
        </Typography>
      </Backdrop>
    </React.Fragment>
  )

};
