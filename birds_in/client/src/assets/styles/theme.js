import { alpha, createTheme } from '@mui/material/styles';
import '@fontsource/crimson-pro';
import '@fontsource/arsenal';

const theme = createTheme({

  palette: {
    primary: {
      light: '#ccd6cc',
      main: '#C1C700',
      dark: '#103300',
      // dark: '#004E37',
      contrastText: '#004E37',
    },
    secondary: {
      light: '#C1C700',
      main: '#103300',
      // main: '#004E37', //verde
      dark: '#A3A3A3',
      contrastText: '#ccd6cc',
    },
    custom: {
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
          borderRadius: '9px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          alignItems: 'center',
          backgroundColor: 'rgba(16, 51, 0, 0.1)', // Establece el fondo transparente deseado
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
          // height: '70px',
          '& .MuiInputLabel-root': {
            // height: '70px',
            color: '#C1C700', // Color del tITULO del label cuando está habilitado
          },
          '& .MuiInputBase-input': {
            padding: '0px',
            paddingLeft: '10px',
            // height: '70px',
            // backgroundColor: 'rgba(0,56,28,0.22)',
            borderRadius: '9px',
            borderColor: 'transparent',
            color: '#ccd6cc',
          },

          '& .MuiOutlinedInput-notchedOutline': {
            // backgroundColor: 'rgba(0,56,28,0.22)',
            backgroundColor: 'rgba(204,214,204,0.17)',
            borderColor: 'transparent',
            // height: '70px',
            padding: '0px',
            borderRadius: '9px',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#C1C700 !important',
            backgroundColor: 'transparent',
            borderRadius: '9px',
            // height: '70px',
          },
          '& .css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.MuiSelect-select': {
            // Agrega los estilos que desees para el Select
            // height: '70px',

          },
        },
      },
      defaultProps: {
        InputLabelProps: {
          sx: {
            color: 'primary.main',
            marginTop: '-10px',
          },
        },
        InputProps: {
          sx: {
            color: '#ccd6cc',
            // backgroundColor: 'rgba(204,214,204,0.17)',
            borderRadius: '9px',
            // height: '70px',

          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          margin: '0px',
          marginTop: '0px',
          gap: '0px',
          fontWeight: 500,
        },
        contained: {
          fontSize: '1.2rem', // Aumentar el tamaño del texto a 1.2 rem
          fontWeight: 'bold', // Hacer el texto negrita
          textTransform: 'none',
          borderRadius: '5px',
          '&:hover': {
            backgroundColor: 'transparent', // Cambia el color de fondo en hover
            color: '#ccd6cc', // Cambia el color del texto en hover
            textTransform: 'none',
          },
        },
        outlined: {
          fontSize: '1.2rem', // Aumentar el tamaño del texto a 1.2 rem
          fontWeight: 'bold', // Hacer el texto negrita
          textTransform: 'none',
          borderRadius: '5px',
          '&:hover': {
            backgroundColor: 'transparent', // Cambia el color de fondo en hover
            color: '#ccd6cc', // Cambia el color del texto en hover
            textTransform: 'none',
          },
        },
      },
    },
  },
  MuiAutocomplete: {
    styleOverrides: {
      root: {
        '&.MuiAutocomplete-hasPopupIcon.MuiAutocomplete-hasClearIcon.css-clttge-MuiAutocomplete-root .MuiOutlinedInput-root': {
          // height: '50px',
          '& .MuiInputBase-input': {
            // height: '50px',
            // padding: '0px 10px',
            display: 'flex',
            alignItems: 'center',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'transparent',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#C1C700',
          },
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