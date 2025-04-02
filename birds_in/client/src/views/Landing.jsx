import * as React from 'react';
import { Box, Button, Grid, Typography, useTheme, Fade, Slide } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Index } from '../components/SingUpTabs/Index';
import { Boolean } from '../redux/settings/slices/OpenClose';
import { CopyRight } from '../components/CopyRight';

export const Landing = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { open } = useSelector((state) => state.openCloseSlice);
  const { allCustom } = useSelector((state) => state.customizesSlice);

  const [showBackground, setShowBackground] = React.useState(false);
  const [showLogin, setShowLogin] = React.useState(false);
  const [showLogo, setShowLogo] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => setShowBackground(true), 300);  // Retraso de 300ms para que el fondo aparezca
    setTimeout(() => setShowLogin(true), 1200);      // Retraso de 1.2s para que baje el login
    setTimeout(() => setShowLogo(true), 2000);       // Retraso de 2s para que aparezca el logo
  }, []);

  const handleOpen = () => {
    dispatch(Boolean(true));
  };

  return (
    <React.Fragment>
      <Grid container component="main" sx={{ height: '100vh', position: 'relative', margin: 0, padding: 0 }}>

        {/* Fondo con fade-in */}
        <Fade in={showBackground} timeout={1500}>
          <Grid item xs={12} sx={{ position: 'absolute', width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden' }}>
            <img
              src={allCustom.background_login}
              alt="background"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
            />
          </Grid>
        </Fade>

        {/* Contenedor del Login con slide-down */}
        <Slide direction="down" in={showLogin} timeout={1000}>
          <Grid item xs={12} sm={12} md={4} lg={3} component={Box}
            sx={{
              margin: 0,
              backgroundColor: 'rgba(0, 56, 28, 0.3)',
              backdropFilter: 'blur(10px)',
              padding: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
              zIndex: 1,
              height: { lg: '90vh', },
              left: { xs: '0%', sm: '40%', md: '72%', lg: '72%', xl: '72%' },
              borderRadius: '0px 0px 10px 10px',
            }}
          >

            {/* Contenedor del Logo con fade-in */}
            <Fade in={showLogo} timeout={1000}>
              <Box sx={{
                position: 'absolute',
                top: '20%',
                right: '10%',
                transform: 'translate(-50%, -50%)',
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                zIndex: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: theme.palette.primary.dark,
              }}>
                <img alt='logo' src={allCustom.logo} style={{ width: '120px', height: 'auto' }} loading="lazy" />
              </Box>
            </Fade>

            {/* Texto */}
            <Box sx={{ textAlign: 'left', position: 'relative', zIndex: 2, px: 5, top: '36%', mb: 5 }}>
              <Typography variant="h1" color='primary.main' sx={{ mb: 2 }}>Moisés Sterimberg</Typography>
              <Typography variant="body1" color='primary.light'>
                Imágenes cautivadoras que capturan la belleza y la majestuosidad de estas especies únicas.
              </Typography>
              <Typography variant="h5" sx={{ color: '#fff', fontWeight: 'bold', mt: 2 }}>
                Fotografías por Moises Sterimberg
              </Typography>
            </Box>

            <Button variant="contained" onClick={handleOpen} size="medium" sx={{ mt: { xs: '85%', lg: '65%' }, mb: 4 }}>
              Iniciar sesión
            </Button>
            <CopyRight.Website />
            <Index open={open} />
          </Grid>
        </Slide>
      </Grid>
    </React.Fragment>
  );
};
