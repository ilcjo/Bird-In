
import { createTheme } from '@mui/material/styles';
import '@fontsource/crimson-pro'



const theme = createTheme({

    palette: {
        primary: {
          main: '#00381c', // Color primario
        },
        secondary: {
          main: '#335d33', // Color secundario
        },
    },
      typography: {
        fontFamily: 'Crimson Pro, sans-serif',
        h1: {
          fontSize: '2.5rem',
          fontWeight: 100,
          color: '#00381c'
        },
        // Agrega más estilos tipográficos aquí si lo deseas
      },
      background: {
        default: '#00381c', // Cambia "#00381c" por el color de fondo que desees
      },
    });


export default theme