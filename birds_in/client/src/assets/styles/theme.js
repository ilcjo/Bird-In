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
    custome: {
      light: '#ccd6cc',
      main: '#004E37',
      dark: '#A3A3A3',
      contrastText: '#ccd6cc',
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
    MuiTextField: {
      styleOverrides: {
        root: {

          // backgroundColor: 'rgba(204,214,204,0.17)',
          borderRadius: '9px',
          height: '60px',
          '& .MuiInputLabel-root': {
            color: '#C1C700', // Color del tITULO del label cuando está habilitado
          },
          '& .MuiInputBase-input': {
            padding: '0px',
            paddingLeft: '10px',
            height: '50px',
            // backgroundColor: 'rgba(204,214,204,0.17)',
            borderRadius: '9px',
            borderColor: 'none',
            color: '#ccd6cc',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'none',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#C1C700 !important',
            backgroundColor: 'rgba(0,56,28,0.22)',
            height: '55px',
          },
          '& .css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.MuiSelect-select': {
            // Agrega los estilos que desees para el Select
            height: '50px',

          },
        },
      },
      defaultProps: {
        InputLabelProps: {
          sx: {
            color: 'primary.main',
            marginTop: '-9px',

          },
        },
        InputProps: {
          sx: {
            color: '#ccd6cc',
            backgroundColor: 'rgba(204,214,204,0.17)',
            borderRadius: '9px',
            height: '50px',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          margin: '0px',
          marginTop: '40px',
          gap: '20px',
          fontWeight: 500,
        },
        contained: {
          fontSize: '1.3rem', // Aumentar el tamaño del texto a 1.2 rem
          fontWeight: 'bold', // Hacer el texto negrita
          textTransform: 'none',
          borderRadius: '50px',
          '&:hover': {
            backgroundColor: 'primary.dark', // Cambia el color de fondo en hover
            color: '#ccd6cc', // Cambia el color del texto en hover
            textTransform: 'none',
          },
        },
        outlined: {
          fontSize: '1.3rem', // Aumentar el tamaño del texto a 1.2 rem
          fontWeight: 'bold', // Hacer el texto negrita
          textTransform: 'none',
          borderRadius: '50px',
        },
      },
    },
  },
  MuiAutocomplete: {
    styleOverrides: {
      root: {
        '& .MuiInputBase-root-MuiOutlinedInput-root': {
          height: '50px ', // Establece la altura deseada para el input del Autocomplete
        },
      },
    },
  },

  global: {
    body: {

      margin: 0, // Establece el margen del cuerpo a 0
      padding: 0,


    },
  },


});


export default theme