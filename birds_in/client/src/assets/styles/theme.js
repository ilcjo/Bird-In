import { createTheme } from '@mui/material/styles';
import '@fontsource/crimson-pro';
import '@fontsource/arsenal';


const theme = createTheme({

  palette: {
    primary: {
      light: '#ccd6cc',
      main: '#C1C700',
      dark: '#00381C',
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
      fontSize: '2.6rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 300,
      my: 1,
    },
    h3: {
      fontSize: '1rem',
      fontWeight: 400,
    },
    h4: {
      fontSize: '1 rem',
      fontWeight: 600,
      marginLeft: '6px'
    },
    body1: {
      fontSize: '1.3rem',
      fontWeight: 100,
      fontFamily: 'Crimson Pro, sans-serif',
      lineHeight: 1.2,
    },
  },
  components: {
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(0, 56, 28, 0.1)',
          backdropFilter: 'blur(90px)',
          WebkitBackdropFilter: 'blur(90px)',
          padding: '20px',       
        },
      },
    },
  },
 
        
   
  background: '#ccd6cc', // Cambia "#00381c" por el color de fondo que desees

});


export default theme