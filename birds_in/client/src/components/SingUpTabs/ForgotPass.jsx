import * as React from 'react'
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { recoverPass } from '../../redux/actions/userLoginRegister';
import { useDispatch } from 'react-redux';


export const ForgotPass = () => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const [formRecover, setFormRecover] = React.useState({
    email: ''
  })

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(recoverPass());
  }

  const labelStyles = {
    color: theme.palette.primary.main, // Color del texto del label
    marginTop: '-9px',
    fontSize: { xs: '1.5rem', sm: '1.8rem', md: '1.8rem', lg: '1.8rem', xl: '1.8rem' },
  };

  const inputStyles = {
    // Aquí puedes agregar los estilos que desees para los inputs
    color: theme.palette.primary.light,
    backgroundColor: 'rgba(204,214,204,0.17)',
    borderRadius: '9px',
    height: '50px',

    '& .MuiInputBase-input': {
      padding: '0px',
      paddingLeft: '10px',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'none',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main, // Color del borde en el hover
      backgroundColor: 'rgba(0,56,28,0.22) ',
    },
    '& .css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.MuiSelect-select': {
      // Agrega los estilos que desees para el Select
      height: '50px',
      // width: '180px' // Ejemplo: cambia el color del texto a azul
    },

  };

  const actionsStyles = {
    justifyContent: 'center', // Centrar el botón horizontalmente
    margin: '0px',
    marginTop: '40px',
    gap: '20px',
    fontWeight: 500,

    '& .MuiButton-contained': {
      fontSize: { xs: '1rem', sm: '1.3rem', md: '1.3rem', lg: '1.3rem', xl: '1.4rem' }, // Aumentar el tamaño del texto a 1.2 rem
      fontWeight: 'bold', // Hacer el texto negrita
      textTransform: 'none',
      '&:hover': {
        backgroundColor: theme.palette.primary.dark, // Cambia el color de fondo en hover
        color: theme.palette.primary.light, // Cambia el color del texto en hover
        textTransform: 'none',
      },
    },

    '& .MuiButton-outlined': {
      fontSize: { xs: '1.2rem', sm: '1.3rem', md: '1.3rem', lg: '1.3rem', xl: '1.4rem' }, // Aumentar el tamaño del texto a 1.2 rem
      fontWeight: 'bold', // Hacer el texto negrita
      textTransform: 'none',
    },
  };

  return (
    <Box sx={{ padding: 0, m: 0}}>
      <div>
        <Typography variant="h2" color='primary.light' 
        sx={{ 
          marginLeft: '2px', 
          mb: 2,
          fontSize: { xs: '1.4rem', sm: '1.8rem', md: '1.8rem', lg: '1.8rem', xl: '1.8rem' }, 
          }}>
          ¿Olvidaste tu contraseña?
        </Typography>
        <Typography variant="body1" color='primary.main' 
        sx={{ 
          marginLeft: '5px',
           mb: 2 ,
           fontSize: { xs: '1.2rem', sm: '1.3rem', md: '1.3rem', lg: '1.3rem', xl: '1.4rem' },
           }}>
          Ingresa tu correo, recibirás un correo electrónico con los pasos para recuperar tu cuenta.
        </Typography>
      </div>

      <form onSubmit={handleLogin} >
        <TextField
          label="E-mail"
          name="email"
          type="email"
          value={formRecover.email}
          onChange={(e) => {
            setFormRecover({ ...formRecover, email: e.target.value });
          }}
          margin="normal"
          fullWidth
          InputLabelProps={{
            sx: labelStyles, // Establece el estilo del label del input

          }}
          InputProps={{
            sx: inputStyles, // Establece el estilo del input
          }}

        />


      </form>
      <Grid container component={Box} sx={actionsStyles} size="medium">

        <Button variant="contained" 
        onClick={handleLogin} 
        color="primary"
        sx={{ padding: 1 }}
        >
          Recuperar Contraseña
        </Button>
      </Grid>

    </Box>
  )
}

