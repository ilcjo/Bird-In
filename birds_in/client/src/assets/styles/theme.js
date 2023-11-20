import { alpha, createTheme } from '@mui/material/styles';
import '@fontsource/crimson-pro';
import '@fontsource/arsenal';



const theme = createTheme({

  palette: {
    primary: {
      light: '#ccd6cc',
      main: '#C1C700',
      dark: '#004E37',
      contrastText: '#004E37',
    },
    secondary: {
      light: alpha('#CCD6CC', 0.17),
      main: '#f44336',
      dark: '#004E4E',
      contrastText: '#000',
    },
  },
  typography: {
    fontFamily: 'Arsenal',
    h1: {
      fontSize: '2.6rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '1.8rem',
      fontWeight: 600,
      my: 1,
    },
    h3: {
      fontSize: '0.5rem',
      fontWeight: 400,
    },
    h4: {
      fontSize: '1rem',
      fontWeight: 600,
      marginLeft: '6px'
    },
    h5: {
      fontSize: '1.3rem',
      fontWeight: 600,
      
    },
    body1: {
      fontSize: '1.7rem',
      fontWeight: 100,
      fontFamily: 'Crimson Pro, sans-serif',
      lineHeight: 1.2,
    },
    body2: {
      fontSize: '1 .5rem',
      fontWeight: 200,
      fontFamily: 'Crimson Pro, sans-serif',
      lineHeight: 1.2,
    },
  },
  components: {
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(0, 56, 28, 0.1)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          padding: '20px',       
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          alignItems: 'center',
          backgroundColor: 'rgba(0, 56, 28, 0.1)', // Establece el fondo transparente deseado
          backdropFilter: 'blur(90px)', // Efecto de desenfoque de fondo
          WebkitBackdropFilter: 'blur(90px)', // Efecto de desenfoque de fondo para navegadores basados en Webkit
        },
      },
    },
 
    // MuiButton: {
    //   styleOverrides: {
    //     root: {
    //       // Estilo para el botón cuando no está en hover
    //       backgroundColor: theme.palette.primary.main,
    //       color: theme.palette.common.white,
    //       '&:hover': {
    //         // Estilo para el botón cuando se hace hover
    //         backgroundColor: theme.palette.primary.dark,
    //       },
    //     },
    //     contained: {
    //       // Estilo para el botón variant="contained" cuando no está en hover
    //       boxShadow: 'none',
    //       '&:hover': {
    //         // Estilo para el botón variant="contained" cuando se hace hover
    //         boxShadow: 'none',
    //       },
    //     },
    //   },
    // },
  },
  
  global: {
    body: {
      margin: 0, // Establece el margen del cuerpo a 0
      padding: 0,
    
    },
  },


});


export default theme