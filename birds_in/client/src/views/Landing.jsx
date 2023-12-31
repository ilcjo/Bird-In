import * as React from 'react';
import { Box, Button, Grid, Typography, useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux'
import { Boolean } from '../redux/slices/OpenClose';
import { Index } from '../components/SingUpTabs/Index';
import { LazyLoad } from '../components/utils/LazyLoad';


export const Landing = () => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const { open } = useSelector((state) => state.openCloseSlice)
  const { allCustom } = useSelector(state => state.customizesSlice)
  const convertTextWithBr = (text) => {
    if (!text) {
      return null;
    }
  
    // Dividir el texto por comas y agregar <br /> después de cada coma
    const segments = text.split('.').map((segment, index) => (
      <React.Fragment key={index}>
        {segment.trim()} {/* Eliminar espacios en blanco alrededor de cada segmento */}
        <br />
      </React.Fragment>
    ));
  
    return (
      <React.Fragment>
        {segments}
      </React.Fragment>
    );
  };
  const handleOpen = () => {
    dispatch(Boolean(true))
  };

  return (
    <React.Fragment>
      <Grid container component="main" sx={{ height: '100vh' }}>
     <LazyLoad imageUrl={allCustom.cover_login}>     
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
            {convertTextWithBr(allCustom.text_login)}
          </Typography>
          </LazyLoad>
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
            <img alt='logo' src={allCustom.logo} style={{
              width: '170px', // Establece el ancho fijo que desees
              height: 'auto', // Permite que la altura se ajuste automáticamente para mantener la proporción
            }} 
            loading="lazy"
            >
            </img>
          </Box>
          <Box sx={{
            // top: '500px',
            textAlign: 'justify-right',
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



