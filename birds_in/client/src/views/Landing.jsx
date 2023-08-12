import * as React from 'react';
import { Box, Button, Grid, Typography, useTheme } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useDispatch, useSelector } from 'react-redux'
import { Boolean } from '../redux/slices/OpenClose';
import { Index } from '../components/SingUpTabs/Index';


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
        <Grid
          item
          xs={12}
          sx={{
            width: '209px',
            height: '198px',
            display: 'flex',
            justifyContent: 'center', // Centrar horizontalmente
            alignItems: 'center', // Centrar verticalmente
            borderRadius: '50%', // Hacer el Grid redondo
            overflow: 'hidden', // Para que la imagen se ajuste al tamaño del Grid redondo
            backgroundColor: theme.palette.primary.dark, // Color de fondo del Grid redondo
            position: 'absolute', // Posición absoluta para que se coloque encima de los otros Grids
            top: '38%', // Centrar verticalmente en la mitad de la pantalla
            left: '67%', // Centrar horizontalmente en la mitad de la pantalla
            transform: 'translate(-50%, -50%)', // Centrar exactamente en el centro
            zIndex: 1, // Elevar el nuevo Grid encima de los otros 
          }}
        >
          {/* Aquí puedes poner la URL de la imagen */}
          <img
            src="https://source.unsplash.com/random?people"
            alt="Ave"
            style={{ width: '100%', height: '100%', objectFit: 'cover', }}
          />
        </Grid>

        <Grid item xs={false} sm={4} md={8}
          sx={{
            backgroundImage: 'url(https://source.unsplash.com/random?bird)',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.40)', // Agregar sombra
          }}>

          <Typography variant="body1" color="primary.light"
            sx={{
              position: 'absolute', // Posiciona el segundo párrafo en la esquina inferior izquierda
              bottom: 0, // Coloca el segundo párrafo en la parte inferior del contenedor
              right: 530, // Coloca el segundo párrafo en la esquina izquierda del contenedor
              margin: '20px', // Ajusta los márgenes según tus necesidade
            }}>
            <LocationOnIcon /> Nombre del lugar
          </Typography>
          <Typography variant="body1" color="primary.light"
            sx={{
              position: 'absolute', // Posiciona el segundo párrafo en la esquina inferior izquierda
              bottom: 0, // Coloca el segundo párrafo en la parte inferior del contenedor
              right: 530, // Coloca el segundo párrafo en la esquina izquierda del contenedor
              margin: '20px', // Ajusta los márgenes según tus necesidades
              bottom: '30px'
            }}>
            Nombre del lugar
          </Typography>
        </Grid>
        <Grid item xs={12} sm={8} md={4} component={Box} elevation={6}
          sx={{
            backgroundColor: theme.palette.primary.dark,
            padding: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
          <Box sx={{
            display: 'flex',
            textAlign: 'left',
            width: '70%',
          }}>
            <Typography variant="h1" color='primary.main'
              sx={{
                textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
              }}>
              LAS AVES QUE PASARON POR MIS OJOS
            </Typography>
          </Box>
          <Box sx={{
            top: '500px',
            textAlign: 'left',
            width: '80%',
            mt: 20
          }}>
            <Typography variant="h2" color='primary.main' sx={{ my: 1 }}>
              Bienvenidos
            </Typography>
            <Typography variant="body1" color='primary.light'>
              Imágenes cautivadoras que capturan la belleza y la majestuosidad de estas especies únicas.
            </Typography>
            <Typography variant="body1" sx={{ color: '#fff', fontWeight: 'bold', my: 2, fontFamily: 'Arsenal', fontSize: '1rem', }}>
              Fotografias por Moises Sterimberg
            </Typography>
          </Box>
          <Box sx={{
            '& .MuiButton-contained': {
              fontSize: '1rem',
              fontWeight: 'bold',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: theme.palette.primary.light,
                color: theme.palette.primary.dark,
                textTransform: 'none',
              }
            },
            '& .MuiButton-outlined': {
              fontSize: '1rem',
              fontWeight: 'bold',
              textTransform: 'none',
            }
          }}>
            <Button variant="contained" onClick={handleOpen} size="medium" sx={{ my: 5}}>Comenzar</Button>
          </Box>
          <Index
            open={open} />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};



