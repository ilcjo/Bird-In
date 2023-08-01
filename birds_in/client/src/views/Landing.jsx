import * as React from 'react';
import { Grid, Paper, Typography, useTheme } from '@mui/material';


export const Landing = () => {
  const theme = useTheme()

  return (
    <React.Fragment>
      <Grid container  component="main" sx={{ height: '100vh' }}>
      <Grid
          item
          xs={12}
          sx={{
            width: '16%',
            height: '34%' ,
            display: 'flex',
            justifyContent: 'center', // Centrar horizontalmente
            alignItems: 'center', // Centrar verticalmente
            borderRadius: '50%', // Hacer el Grid redondo
            overflow: 'hidden', // Para que la imagen se ajuste al tamaño del Grid redondo
            backgroundColor: theme.palette.primary.main, // Color de fondo del Grid redondo
            position: 'absolute', // Posición absoluta para que se coloque encima de los otros Grids
            top: '50%', // Centrar verticalmente en la mitad de la pantalla
            left: '75%', // Centrar horizontalmente en la mitad de la pantalla
            transform: 'translate(-50%, -50%)', // Centrar exactamente en el centro
            zIndex: 1, // Elevar el nuevo Grid encima de los otros
            border: ' 8px solid #00381c' 
          }}
        >
          {/* Aquí puedes poner la URL de la imagen */}
          <img
            src="https://source.unsplash.com/random?people"
            alt="Ave"
            style={{ width: '100%', height: '100%', objectFit: 'cover',}}
          />
        </Grid>

        <Grid  item xs={false} sm={4} md={9}
          sx={{
            backgroundImage: 'url(https://source.unsplash.com/random?bird)',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}>
             <Typography variant="h1" color='primary.light'
             sx={{
              alignItems: 'center'
             }}
             >LAS AVES QUE PASARON POR MIS OJOS<br/> a</Typography>
            <Typography variant="body1" color="primary.light" 
            sx={{
              position: 'absolute', // Posiciona el segundo párrafo en la esquina inferior izquierda
              bottom: 0, // Coloca el segundo párrafo en la parte inferior del contenedor
              left: 0, // Coloca el segundo párrafo en la esquina izquierda del contenedor
              margin: '20px', // Ajusta los márgenes según tus necesidades
            }}>
              iconos nombre de la foto y lugar
              </Typography>
        </Grid>
       <Grid item xs={12} sm={8} md={3} component={Paper} elevation={6} square
       sx={{
        backgroundColor:theme.palette.primary.main,
        padding: '20px'
       }}>
          <Typography variant="body1" color='primary.light'>Bienvenidos<br/> a</Typography>
           
      
        </Grid>
      </Grid>
    </React.Fragment>
  );
};



