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
import { useDispatch, } from 'react-redux';
import { Boolean } from '../../redux/slices/OpenClose';
import { Link } from 'react-router-dom';
import { registerData } from '../../redux/actions/userLoginRegister';

export const RegisterForm = () => {

  const theme = useTheme()
  const dispatch = useDispatch()
  const [showPassword, setShowPassword] = React.useState(false)
  const [error, setError] = React.useState('')
  const [formData, setFormData] = React.useState({
    email: '',
    name: '',
    pais: '',
    pass: '',
    passFirst: '',
  })

  console.log(formData)
  const handleClose = () => {
    dispatch(Boolean(false))
    setFormData({
      name: '',
      email: '',
      pais: '',
      pass: '',
      passFirst: '',
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (formData.pass === formData.passFirst) {
      setError('');
      dispatch(registerData(formData))
      handleClose()
    } else {
      setError('Las contraseñas no coinciden')
    }
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
      fontWeight: 'bold', // Hacer el texto negrita
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
    <Box sx={{ margin: '10px' }} >
      <div>
        <Typography variant="h2" color='primary.light' sx={{ marginLeft: '2px', }}>
          Crear Cuenta
        </Typography>
        <Typography variant="body1" color="primary.main" sx={{ marginLeft: '8px', my: '10px' }}>
          Ya eres miembro ?
          <MuiLink component={Link} to="/home" color="primary.light" underline="none" sx={{ marginLeft: '5px' }}>
            Log In
          </MuiLink>
        </Typography>
      </div>
      <Grid container component={Box}  >
        <form onSubmit={handleSubmit}  >
          <TextField
            label="Nombre Completo"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
            value={formData.pais}
            onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
            fullWidth
            select
            margin="normal"
            helperText="Seleccione Pais de Origen"
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
            label="Confirmar Password"
            name="passFirst"
            margin="normal"
            error={error !== ''}
            type={showPassword ? 'text' : 'password'}
            fullWidth
            InputLabelProps={{
              sx: labelStyles,
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
            helperText={`Al menos 6 caracteres y una mayúscula${error ? `\n${error}` : ''}`}
            FormHelperTextProps={{
              sx: {
                fontSize: '1rem',
                color: theme.palette.primary.light,
              },
            }}
            value={formData.passFirst} // Vincula este campo al valor 'passFirst' en el estado
            onChange={(e) => {
              setFormData({ ...formData, passFirst: e.target.value });
            }}
          />
          <TextField
            label="Confirmar Password"
            name="pass"
            value={formData.pass}
            error={error !== ''}
            helperText={error}
            onChange={(e) => setFormData({ ...formData, pass: e.target.value })}
            type={showPassword ? 'text' : 'password'}
            margin="normal"
            fullWidth
            FormHelperTextProps={{
              sx: {
                /* Agrega los estilos que desees para el texto del helper text */
                /* Por ejemplo, para agregar un margen izquierdo: */
                fontSize: '1rem',
                color: theme.palette.primary.light,
                /* Agrega otros estilos que desees... */
              },
            }}
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

