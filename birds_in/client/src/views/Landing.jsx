import * as React from 'react';
import { Box, Button, Grid, Typography, useTheme } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useDispatch, useSelector } from 'react-redux'
import { Boolean } from '../redux/slices/OpenClose';
import { Index } from '../components/SingUpTabs/Index';
import cover from '../assets/images/DSC07270.jpg'
import logo from '../assets/images/Logo.png'


export const Landing = () => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const { open } = useSelector((state) => state.openCloseSlice)


  const handleOpen = () => {
    dispatch(Boolean(true))
  };

  return (
    <React.Fragment>
      <Grid container component="main" sx={{ height: '100vh' }}>

        <Grid item xs={false} sm={3} md={8.5}
          sx={{
            backgroundImage: `url(${cover})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.40)', // Agregar sombra
          }}>
          <Typography variant="body2" color="black"
            sx={{
              position: 'absolute', // Posiciona el segundo párrafo en la esquina inferior izquierda
              bottom: 0, // Coloca el segundo párrafo en la parte inferior del contenedor
              right: 460, // Coloca el segundo párrafo en la esquina izquierda del contenedor
              margin: '20px', // Ajusta los márgenes según tus necesidades
              bottom: '82vh',
              fontSize: '1.4rem',
              // backgroundColor: 'rgba(255, 255, 255, 0.5)',
            }}>
            Fiery-billed Aracari
            <br></br>
            Pteroglossus frantzii
            <br></br>
            Boquete, Panamá
          </Typography>
        </Grid>
        <Grid item xs={12} sm={9} md={3.5} component={Box} elevation={6}
          sx={{
            backgroundColor: theme.palette.primary.dark,
            padding: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center', // Centra verticalmente
            justifyContent: 'center', // Centra horizontalmente
            // Altura mínima de la ventana gráfica
          }}>
            <img alt='logo' src={logo} style={{
              width: '170px', // Establece el ancho fijo que desees
              height: 'auto', // Permite que la altura se ajuste automáticamente para mantener la proporción
            }} >
            </img>
          </Box>
          <Box sx={{
            // top: '500px',
            textAlign: 'justify',
            width: '80%',
            mt: 11
          }}>
            <Typography variant="h2" color='primary.main' >
              Moises Sterimberg
            </Typography>
            <Typography variant="body1" color='primary.light'>
              Imágenes cautivadoras que capturan la belleza y la majestuosidad de estas especies únicas.
            </Typography>
            <Typography variant="body1" sx={{ color: '#fff', fontWeight: 'bold', my: 2, fontFamily: 'Arsenal', fontSize: '1rem', }}>
              Fotografías por Moises Sterimberg
            </Typography>
          </Box>
          <Box sx={{
            '& .MuiButton-contained': {
              fontSize: '1.3rem',
              fontWeight: 'bold',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: theme.palette.primary.light,
                color: theme.palette.primary.dark,
                textTransform: 'none',
              }
            },
            '& .MuiButton-outlined': {
              fontSize: '1.3rem',
              fontWeight: 'bold',
              textTransform: 'none',
            }
          }}>
            <Button variant="contained" onClick={handleOpen} size="medium" sx={{ my: 5 }}>Iniciar sesión</Button>
          </Box>
          <Index
            open={open} />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};



