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
  Backdrop,
  CircularProgress,
  Snackbar,
  SnackbarContent,
} from '@mui/material';
import CountryList from 'react-select-country-list';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useDispatch, } from 'react-redux';
import { Boolean } from '../../redux/slices/OpenClose';
import { registerData } from '../../redux/actions/userLoginRegister';

export const RegisterForm = ({ changeTab }) => {

  const theme = useTheme()
  const dispatch = useDispatch()
  const [showPassword, setShowPassword] = React.useState(false)
  const [error, setError] = React.useState('')
  const [successMessage, setSuccessMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const [formData, setFormData] = React.useState({
    email: '',
    name: '',
    pais: '',
    pass: '',
    passFirst: '',
  })


  const handleClose = () => {
    dispatch(Boolean(false));
    setFormData({
      name: '',
      email: '',
      pais: '',
      pass: '',
      passFirst: '',
    });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.pass !== formData.passFirst) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setError('');
    setLoading(true);
    try {
      // Simula una solicitud asíncrona al backend para registrar al usuario
      // Reemplaza esto con tu lógica real de registro de usuario
      await dispatch(registerData(formData));
      setSuccessMessage('Se ha enviado la solicitud de aprobación. Recibirás instrucciones por correo electrónico.');
      handleClose();
  } catch (error) {
      console.error('Error al crear el usuario:', error.response?.data.error || error.response?.data.message);
  
      // Verificar si la respuesta contiene un campo 'error'
      const errorMessage = error.response?.data.error || error.response?.data.message;
  
      if (errorMessage) {
          // Mostrar un mensaje de error al usuario solo si hay un mensaje de error
          alert(`Error: ${errorMessage}`);
      } else {
          // Aquí puedes manejar el caso de éxito, si lo necesitas
          console.log('Usuario creado exitosamente');
      }
  } finally {
      setLoading(false);
  }
  };


  const handleLinkClicRk = (e) => {
    e.preventDefault();
    const num = 0;
    changeTab(num);
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
      fontSize: '1.3rem', // Aumentar el tamaño del texto a 1.2 rem
      fontWeight: 'bold', // Hacer el texto negrita
      textTransform: 'none',
      '&:hover': {
        backgroundColor: theme.palette.primary.dark, // Cambia el color de fondo en hover
        color: theme.palette.primary.light, // Cambia el color del texto en hover
        textTransform: 'none',
      },
    },

    '& .MuiButton-outlined': {
      fontSize: '1.3rem', // Aumentar el tamaño del texto a 1.2 rem
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
        <Typography variant="h5" color="primary.main" sx={{ marginLeft: '8px', my: '10px' }}>
          Ya eres miembro ?
          <MuiLink onClick={handleLinkClicRk} color="primary.light" underline="none" sx={{
            cursor: 'pointer',
            '&:hover': {
              color: theme.palette.primary.main
            },
            marginLeft: '5px'
          }}>
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
            label="País"
            name="pais"
            value={formData.pais}
            onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
            fullWidth
            select
            margin="normal"
            helperText="Seleccione País de Origen"
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
            helperText={`Al menos 6 caracteres y una mayúscula${formData.passFirst && error ? `\n${error}` : ''}`}
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
      <Backdrop open={loading} onClick={() => { }} style={{ zIndex: 1, color: '#fff' }}>
        <>
          <CircularProgress color="inherit" />
          <Typography variant="h5" color="inherit" sx={{ ml: 2 }}>
            Cargando...
          </Typography>
        </>
      </Backdrop>
      {/* Snackbar para mostrar el éxito */}
      {successMessage && (
        <Snackbar
          open={true}
          autoHideDuration={10000}
          onClose={() => setSuccessMessage('')}
        >
          <SnackbarContent
            message={successMessage}
            style={{ backgroundColor: '#43a047' }}
          />
        </Snackbar>
      )}
    </Box>
  )
};

