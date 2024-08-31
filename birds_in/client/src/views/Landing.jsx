
import * as React from 'react';
import { Box, Button, Grid, Typography, useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux'
import { Index } from '../components/SingUpTabs/Index';
import { LazyLoad } from '../components/utils/LazyLoad';
import { Boolean } from '../redux/settings/slices/OpenClose';


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
      <Grid container component="main" sx={{ height: '100vh', position: 'relative', margin: 0, padding: 0  }}>
        {/* Contenedor de la imagen de fondo */}
        <Grid item xs={12} sx={{ position: 'absolute', width: '100%', height: '100%', margin: 0, padding: 0 }}>
          <img src={allCustom.background_login} alt="background" style={{ width: '100%', height: '100%', objectFit: 'cover',  backgroundPosition: 'right', margin: 'OPX' }} />
        </Grid>

        {/* Contenedor del contenido */}
        <Grid item xs={12} sm={6} md={5} lg={3} component={Box} elevation={6}
          sx={{
            margin: 0,
            backgroundColor: 'rgba(0, 56, 28, 0.3)',
            backdropFilter: 'blur(10px)',
            padding: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            zIndex: 1, // Para que esté sobre el círculo
            height: { xs: '100vh', sm: '100vh', md: '90vh', lg: '90vh', xl: '90vh' }, // Para que ocupe toda la altura
            left: { xs: '0%', sm: '40%', md: '72%', lg: '72%', xl: '72%' },
            borderRadius: '0px 0px 10px 10px'
            
          }}>

          {/* Contenedor para el círculo */}
          <Box sx={{
            position: 'absolute',
            top: '20%',
            right: { xs: '20%', sm: '10%', md: '10%', lg: '10%', xl: '10%' },
            transform: 'translate(-50%, -50%)',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            zIndex: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.palette.primary.dark,
            // backdropFilter: 'blur(10px)',
          }}>
            {/* Logo */}
            <img alt='logo' src={allCustom.logo} style={{ width: '120px', height: 'auto' }} loading="lazy" />
          </Box>

          {/* Texto */}
          <Box sx={{
            textAlign: 'left',
            position: 'relative',
            zIndex: 2,
            px: 5,
            top: '36%',
          }}>
            <Typography variant="h2" color='primary.main' sx={{ mb: 3 }}>Moisés Sterimberg</Typography>
            <Typography variant="body1" color='primary.light'>Imágenes cautivadoras que capturan la belleza y la majestuosidad de estas especies únicas.</Typography>
            <Typography variant="body1" sx={{ color: '#fff', fontWeight: 'bold', my: 2, fontFamily: 'Arsenal', fontSize: { xs: '0.8rem', sm: '1rem', md: '1rem', lg: '1rem', xl: '1rem' } }}>Fotografías por Moises Sterimberg</Typography>
          </Box>

          <Button variant="contained" onClick={handleOpen} size="medium" sx={{ mt: { xs: '80%', sm: '90%', md: '73%', lg: '70%', xl: '70%' } }}>Iniciar sesión</Button>
          <Index open={open} />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};



