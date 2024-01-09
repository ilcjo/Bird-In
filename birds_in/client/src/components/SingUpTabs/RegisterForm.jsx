import * as React from 'react'
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  useTheme,
  InputAdornment,
  IconButton,
  Link as MuiLink,
  Backdrop,
  CircularProgress,
  Snackbar,
  SnackbarContent,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useDispatch, } from 'react-redux';
import { Boolean } from '../../redux/slices/OpenClose';
import { pendingEmail, registerData, verifyemail } from '../../redux/actions/userLoginRegister';


export const RegisterForm = ({ changeTab, close }) => {

  const theme = useTheme()
  const dispatch = useDispatch()
  const [debouncedEmail, setDebouncedEmail] = React.useState('');
  const debounceTimeoutRef = React.useRef(null);
  const [isCaptchaVerified, setIsCaptchaVerified] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false)
  const [error, setError] = React.useState('')
  const [errorName, setErrorName] = React.useState('')
  const [errorEmail, setErrorEmail] = React.useState('')
  const [successMessage, setSuccessMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [isFormSubmitted, setFormSubmitted] = React.useState(false);
  const [formData, setFormData] = React.useState({
    email: '',
    name: '',
    pais: '',
    pass: '',
  })
  const handleClose = () => {
    dispatch(Boolean(false));
    setFormData({
      name: '',
      email: '',
      pais: '',
      pass: '',
    });
  };

  const handleCaptchaVerification = (value) => {
    // value será null si el usuario no pasa la verificación, de lo contrario, contendrá el token
    if (value) {
      setIsCaptchaVerified(true);
    } else {
      setIsCaptchaVerified(false);
    }
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    // Aquí puedes realizar cualquier validación adicional para el nombre si es necesario
    setFormData({ ...formData, name: name });
    // Si el nombre está vacío, muestra un mensaje de error
    setErrorName(name.trim() === '' ? 'El nombre es obligatorio *' : '');
  };

  const validatePassword = (password) => {
    // Verificar que la contraseña tenga al menos 8 caracteres, una mayúscula, un dígito y un carácter especial
    const atLeast8Chars = /.{8,}/;
    const hasUpperCase = /[A-Z]/;
    const hasDigit = /\d/;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

    let error = '';

    if (!atLeast8Chars.test(password)) {
      error = 'La contraseña debe tener al menos 8 caracteres.';
    } else if (!hasUpperCase.test(password)) {
      error = 'La contraseña debe contener al menos una mayúscula.';
    } else if (!hasDigit.test(password)) {
      error = 'La contraseña debe contener al menos un número.';
    } else if (!hasSpecialChar.test(password)) {
      error = 'La contraseña debe contener al menos un carácter especial.';
    }

    setError(error);
  };

  const handlePasswordChange = (e) => {
    validatePassword(e.target.value);
  };


  const handleEmailChange = (e) => {
    const email = e.target.value;
    setFormData({ ...formData, email: email });
    // Validación del formato del correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidFormat = emailRegex.test(email);

    setErrorEmail(isValidFormat ? '' : 'El correo electrónico debe tener un formato válido')


    //   // Limpiar el temporizador existente
    //   if (debounceTimeoutRef.current) {
    //     clearTimeout(debounceTimeoutRef.current);
    //   }

    //   // Configurar un nuevo temporizador para realizar la verificación después de un retraso
    //   debounceTimeoutRef.current = setTimeout(() => {
    //     setDebouncedEmail(email);
    //     verifyEmailWithServer(email);
    //   }, 500); // Ajusta el tiempo de espera según sea necesario
    // };

    // const verifyEmailWithServer = async (email) => {
    //   try {
    //     // Realiza la verificación de correo electrónico en el servidor
    //     const response = await dispatch(verifyemail(email));
    //     // Verifica la propiedad isValidEmail en la respuesta
    //     const isValidEmail = response.isValidEmail;
    //     if (isValidEmail) {
    //       setErrorEmail('');
    //     } else {
    //       setErrorEmail('El correo electrónico no es válido');
    //     }
    //   } catch (error) {
    //     console.error(`Error al verificar el correo electrónico: ${error}`);
    //   }
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormSubmitted(true);

    setError('');
    setLoading(true);
    try {
      // Simula una solicitud asíncrona al backend para registrar al usuario
      await dispatch(registerData(formData));
      setOpenSnackbar(true)
      setSuccessMessage('Registro exitoso, esperando aprobación')
      await dispatch(pendingEmail(formData.email, formData.name))
      setFormData({
        name: '',
        email: '',
        pais: '',
        pass: '',
      });
      close()
    } catch (error) {
      alert(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkClicRk = (e) => {
    e.preventDefault();
    const num = 0;
    changeTab(num);
  };

  const isButtonDisabled = () => {

    // Deshabilita el botón si hay errores en la contraseña o en el correo electrónico
    return error || errorEmail || !formData.name || !formData.email || !formData.pass;
  };

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
    marginTop: '20px',
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
    <Box sx={{ padding: 0, m: 0 }} >
      <div>
        <Typography variant="h2" color='primary.light'
          sx={{
            marginLeft: '2px',
            fontSize: { xs: '1.4rem', sm: '1.8rem', md: '1.8rem', lg: '1.8rem', xl: '1.8rem' }
          }}>
          Crear Cuenta
        </Typography>
        <Typography variant="h5" color="primary.main"
          sx={{
            marginLeft: '5px',
            my: '10px',
            fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.3rem', lg: '1.3rem', xl: '1.4rem' },
          }}>
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
      <Grid container component={Box} sx={{ padding: 0, m: 0 }} >
        <form onSubmit={handleSubmit}  >
          <TextField
            label="Nombre Completo"
            name="name"
            value={formData.name}
            onChange={handleNameChange}
            error={errorName}
            helperText={errorName}
            FormHelperTextProps={{
              sx: {
                /* Agrega los estilos que desees para el texto del helper text */
                fontSize: '1rem',
                color: theme.palette.secondary.main,
                fontWeight: 'bold'
              },
            }}
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
            label="Correo Electrónico"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) => { handleEmailChange(e) }}
            margin="normal"
            fullWidth
            InputLabelProps={{
              sx: labelStyles, // Establece el estilo del label del input

            }}
            InputProps={{
              sx: inputStyles, // Establece el estilo del input
            }}
            error={errorEmail}
            helperText={errorEmail}
            FormHelperTextProps={{
              sx: {
                /* Agrega los estilos que desees para el texto del helper text */
                fontSize: '1rem',
                color: theme.palette.secondary.main,
                fontWeight: 'bold'
              },
            }}

          />
          <TextField
            label="Contraseña"
            name="pass"
            margin="normal"
            error={error !== ''}
            type={showPassword ? 'text' : 'password'}
            fullWidth
            sx={{ mt: 2 }}
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
            helperText={error}
            FormHelperTextProps={{
              sx: {
                /* Agrega los estilos que desees para el texto del helper text */
                fontSize: '1rem',
                color: theme.palette.secondary,
                fontWeight: 'bold'
              },
            }}
            value={formData.passFirst} // Vincula este campo al valor 'passFirst' en el estado
            onChange={(e) => {
              setFormData({ ...formData, pass: e.target.value });
              validatePassword(e.target.value);
            }}
          />
          <Typography variant="h5" color="primary.main"
            sx={{
              marginLeft: '8px',
              my: '10px',
              fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.3rem', lg: '1.3rem', xl: '1.4rem' },
            }}>
            La contraseña debe tener 8 caracteres, una Mayúscula, un número y un carácter especial
          </Typography>

        </form>
        <Grid container component={Box} sx={actionsStyles} size="medium">
          <Button
            variant="outlined"
            onClick={handleClose}
            color="primary"
            sx={{ padding: 1 }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            color="primary"
            disabled={isButtonDisabled()}
            sx={{ padding: 1 }}
          >
            Crear Cuenta
          </Button>
        </Grid>
      </Grid>
      <Backdrop open={loading} onClick={() => { }}
        style={{ zIndex: 1, color: '#fff' }}>
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
          open={openSnackbar}
          autoHideDuration={10000}
          onClose={() => setSuccessMessage('')}
        >
          <SnackbarContent
            message={successMessage}

          />
        </Snackbar>
      )}
    </Box>
  )
};
/* <TextField
label="Confirmar Contraseña"
name="pass"
value={formData.pass}
error={error !== ''}
helperText={error}
onChange={(e) => setFormData({ ...formData, pass: e.target.value })}
type={showPassword ? 'text' : 'password'}
margin="normal"
fullWidth
sx={{ mt: 2 }}
FormHelperTextProps={{
  sx: {
    /* Agrega los estilos que desees para el texto del helper text */
/* Por ejemplo, para agregar un margen izquierdo: */
//     fontSize: '1rem',
//     color: theme.palette.primary.light,

//   },
// }}
// InputLabelProps={{
//   sx: labelStyles, // Establece el estilo del label del input
// }}
// InputProps={{
//   sx: inputStyles, // Establece el estilo del input
//   endAdornment: (
//     <InputAdornment position="end">
//       <IconButton
//         edge="end"
//         onClick={() => setShowPassword(!showPassword)}
//         onMouseDown={(event) => event.preventDefault()}

//       >

//         {showPassword ? <VisibilityOff /> : <Visibility />}
//       </IconButton>
//     </InputAdornment>
//   ),
// }}
// /> */}
/* <TextField
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
// fontSize: '1rem',
// color: theme.palette.primary.light,
/* Agrega otros estilos que desees... */
// },
/* }}
>

  {CountryList().getData().map((country) => (
    <MenuItem key={country.label} value={country.label}>
      {country.label}
    </MenuItem>
  ))}
</TextField > */