import * as React from 'react'
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  useTheme,
  MenuItem,
  InputAdornment,
  IconButton,
  Link as MuiLink,
} from '@mui/material';

import CountryList from 'react-select-country-list';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { emailUser, nameUser, paisUser, passwordUser, resetForm } from '../../redux/slices/Register'
import { Boolean } from '../../redux/slices/OpenClose';
import { Link } from 'react-router-dom';

export const RegisterForm = () => {

  const theme = useTheme()
  const dispatch = useDispatch()
  const [showPassword, setShowPassword] = React.useState('')
  const { name, email, pais, pass } = useSelector((state) => state.registerSlice)

  const handleClose = () => {
    dispatch(Boolean(false))
    dispatch(resetForm())
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('DAtos del formulario', name, email, pais, pass)
    handleClose()
    dispatch(resetForm())
  };

  const labelStyles = {
    color: theme.palette.primary.main, // Color del texto del label
    marginTop: '-9px',
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
    marginTop: '20px',
    gap: '20px',
    fontWeight: 500,
    
    '& .MuiButton-contained': {
      fontSize: '1rem', // Aumentar el tamaño del texto a 1.2 rem
      fontWeight:'bold', // Hacer el texto negrita
      textTransform: 'none',
      '&:hover': {
        backgroundColor: theme.palette.primary.dark, // Cambia el color de fondo en hover
        color: theme.palette.primary.light, // Cambia el color del texto en hover
        textTransform: 'none',
      },  
    },

    '& .MuiButton-outlined': {
      fontSize: '1rem', // Aumentar el tamaño del texto a 1.2 rem
      fontWeight: 'bold', // Hacer el texto negrita
      textTransform: 'none',
    },
  };

  return (
    <Box sx={{ margin:'10px'}}>
      <div>
        <Typography variant="h2" color='primary.light' sx={{ marginLeft: '2px', }}>
          Crear Cuenta
        </Typography>
        <Typography variant="body2" color="primary.main" sx={{  marginLeft: '8px', my:'10px' }}>
          Ya eres miembro ?
          <MuiLink component={Link} to="/home" color="primary.light" variant='h4' underline="none" >
            LOGIN
          </MuiLink>
        </Typography>
      </div>
      <Grid container component={Box}  >
        <form onSubmit={handleSubmit} >
          <TextField
            label="Nombre Completo"
            name="name"
            value={name}
            onChange={(e) => dispatch(nameUser(e.target.value))}
            helperText=" "
            fullWidth
            margin="normal"
            InputLabelProps={{
              sx: labelStyles, // Establece el estilo del label del input
            }}
            InputProps={{
              sx: inputStyles, // Establece el estilo del input
            }}
          />

          <TextField
            label="E-mail"
            name="email"
            type="email"
            value={email}
            onChange={(e) => dispatch(emailUser(e.target.value))}
            margin="normal"
            fullWidth
            InputLabelProps={{
              sx: labelStyles, // Establece el estilo del label del input

            }}
            InputProps={{
              sx: inputStyles, // Establece el estilo del input
            }}
            helperText=" Ejemplo: nombre@mail.com"
            FormHelperTextProps={{
              sx: {
                /* Agrega los estilos que desees para el texto del helper text */
                /* Por ejemplo, para agregar un margen izquierdo: */
                fontSize: '1rem',
                color: theme.palette.primary.light,
                /* Agrega otros estilos que desees... */
              },
            }}
          />

          <TextField
            label="Pais (opcional)"
            name="pais"
            value={pais}
            onChange={(e) => dispatch(paisUser(e.target.value))}
            fullWidth
            select
            margin="normal"
            helperText="Seleccione su Pais de Origen"
            InputLabelProps={{
              sx: labelStyles, // Establece el estilo del label del input
            }}
            InputProps={{
              sx: inputStyles, // Establece el estilo del input
            }}
            FormHelperTextProps={{
              sx: {
                /* Agrega los estilos que desees para el texto del helper text */
                /* Por ejemplo, para agregar un margen izquierdo: */
                fontSize: '1rem',
                color: theme.palette.primary.light,
                /* Agrega otros estilos que desees... */
              },
            }}
          >

            {CountryList().getData().map((country) => (
              <MenuItem key={country.label} value={country.label}>
                {country.label}
              </MenuItem>
            ))}
          </TextField >

          <TextField
            label="Password"
            name="passFirst"
            margin="normal"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            InputLabelProps={{
              sx: labelStyles, // Establece el estilo del label del input
            }}
            InputProps={{
              sx: inputStyles,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    onClick={() => setShowPassword(!showPassword)}
                    onMouseDown={(event) => event.preventDefault()}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}

            helperText="Al menos 6 caracteres y una mayuscula"
            FormHelperTextProps={{
              sx: {
                /* Agrega los estilos que desees para el texto del helper text */
                /* Por ejemplo, para agregar un margen izquierdo: */
                fontSize: '1rem',
                color: theme.palette.primary.light,
                /* Agrega otros estilos que desees... */
              },
            }}
          />
          <TextField
            label="Confirmar Password"
            name="pass"
            value={pass}
            onChange={(e) => dispatch(passwordUser(e.target.value))}
            type={showPassword ? 'text' : 'password'}
            margin="normal"
            fullWidth
            InputLabelProps={{
              sx: labelStyles, // Establece el estilo del label del input
            }}
            InputProps={{
              sx: inputStyles, // Establece el estilo del input
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    onClick={() => setShowPassword(!showPassword)}
                    onMouseDown={(event) => event.preventDefault()}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </form>
        <Grid container component={Box} sx={actionsStyles} size="medium">


          <Button variant="outlined" onClick={handleClose} color="primary">
            Cancelar
          </Button>


          <Button variant="contained" onClick={handleSubmit} color="primary">
            Crear Cuenta
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
}

