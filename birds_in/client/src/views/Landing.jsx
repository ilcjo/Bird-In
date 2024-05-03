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
      <Grid container component="main" sx={{ height: '100vh', position: 'relative' }}>
        <Grid item xs={12} sm={6} md={7} lg={9}
          sx={{
            backgroundImage: `url(${allCustom.cover_login})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: { xs: '300px', sm: 'auto', md: 'auto', lg: 'auto', xl: 'auto' }
          }}>
          <Typography variant="body2" color="black"
            sx={{
              position: 'absolute',
              bottom: { xs: '88vh', sm: '87vh', md: '82vh', lg: '82vh', xl: '82vh' },
              right: { xs: '1%', sm: '50%', md: '43%', lg: '30%', xl: '30%' },
              margin: '20px',
              fontSize: { xs: '0.8rem', sm: '1rem', md: '1.2rem', lg: '1.3rem', xl: '1.4rem' },
            }}>
            {convertTextWithBr(allCustom.text_login)}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6} md={5} lg={3} component={Box} elevation={6}
          sx={{
            backgroundColor: theme.palette.primary.dark,
            padding: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            zIndex: 1, // Para que esté sobre el círculo
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
            backgroundColor: theme.palette.primary.dark,
            zIndex: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '-2px -2px 30px 0px #004E37, 10px 10px 50px 0px rgba(174, 174, 172, 0.4) inset', // Drop shadow
            '&::after': {
              content: '""',
              position: 'absolute',
              top: '4px',
              right: '4px',
              bottom: '4px',
              left: '4px',
              borderRadius: '50%',
              boxShadow: '-10px -10px 10px 0px rgba(174, 174, 192, 0.10), 2px 8px 15px 0px #004E37 inset', // Inner shadow
            },
          }}>
            {/* Logo */}
            <img alt='logo' src={allCustom.logo} style={{
              width: '120px',
              height: 'auto',
            }}
              loading="lazy"
            />
          </Box>
          {/* Texto */}
          <Box sx={{
            textAlign: 'left',
            position: 'relative',
            zIndex: 2,
            px: 5,
            top: '36%'
          }}>
            <Typography
              variant="h2"
              color='primary.main'
              sx={{ mb: 3 }}
            >
              Moises Sterimberg
            </Typography>
            <Typography variant="body1" color='primary.light'>
              Imágenes cautivadoras que capturan la belleza y la majestuosidad de estas especies únicas.
            </Typography>
            <Typography variant="body1"
              sx={{
                color: '#fff', fontWeight: 'bold', my: 2, fontFamily: 'Arsenal',
                fontSize: { xs: '0.8rem', sm: '1rem', md: '1rem', lg: '1rem', xl: '1rem' },
              }}>
              Fotografías por Moises Sterimberg
            </Typography>
          </Box>

          <Button variant="contained" onClick={handleOpen} size="medium"
            sx={{ mt: { xs: '45%', sm: '85%', md: '76%', lg: '76%', xl: '76%' } }}>
            Iniciar sesión</Button>
          <Index open={open} />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};



