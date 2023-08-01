import { createTheme } from '@mui/material/styles';
import '@fontsource/crimson-pro';
import '@fontsource/arsenal';


const theme = createTheme({

  palette: {
    primary: {
      light: '#ccd6cc',
      main: '#00381c',
      dark: '#003400',
      contrastText: '#340015',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000',
    },
  },
  typography: {
    fontFamily: 'Arsenal',
    h1: {
      fontSize: '4rem',
      fontWeight: 500,
     

    },
    h2: {
      fontSize: '2rem',
      fontWeight: 300,

    },
    body1: {
      fontSize: '1.4rem', // Estilo de cuerpo del texto
      fontWeight: 100,
      fontFamily: 'Crimson Pro, sans-serif',
    },
  },


  background: '#ccd6cc', // Cambia "#00381c" por el color de fondo que desees

});


export default theme