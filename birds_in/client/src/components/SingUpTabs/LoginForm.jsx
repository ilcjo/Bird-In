import * as React from 'react'
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  useTheme,
  Link as MuiLink,
  InputAdornment,
  IconButton,
  Snackbar,
  SnackbarContent,

} from '@mui/material';
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { loginUser } from '../../redux/actions/userLoginRegister';
import { Boolean } from '../../redux/slices/OpenClose';
import SendIcon from '@mui/icons-material/Send';
import LoadingButton from '@mui/lab/LoadingButton';
import { loginFailure, loginRequest } from '../../redux/slices/Auth';
import CloseIcon from '@mui/icons-material/Close';
import ReCAPTCHA from 'react-google-recaptcha';

export const LoginForm = ({ changeTab }) => {

  const theme = useTheme()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loginData, setLoginData] = React.useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = React.useState('')
  const [errorTextPass, setErrorTextPass] = React.useState('');
  const [errorText, setErrorText] = React.useState('');
  const { loading } = useSelector((state) => state.authSlice);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [isCaptchaVerified, setIsCaptchaVerified] = React.useState(false);
  const [approvedMessage, setApprovedMessage] = React.useState('')
  const handleClose = () => {
    dispatch(Boolean(false))
  };

  const handleegisterLinkClicRk = (e) => {
    e.preventDefault();
    const numOne = 1
    changeTab(numOne);
  };

  const handlePassLinkClicRk = (e) => {
    e.preventDefault();
    const num = 2
    changeTab(num);
  };

  const handleCaptchaVerification = (value) => {
    // value será null si el usuario no pasa la verificación, de lo contrario, contendrá el token
    if (value) {
      setIsCaptchaVerified(true);
    } else {
      setIsCaptchaVerified(false);
    }
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    // if (!isCaptchaVerified) {
    //   alert('Por favor, completa la verificación CAPTCHA.');
    //   return;
    // }
    if (loginData.email && loginData.password) {
      try {
        dispatch(loginRequest())
        await dispatch(loginUser(loginData));
        navigate('/menu');
        dispatch(Boolean(false))
      } catch (error) {
        dispatch(loginFailure(null))
        console.error('Error al iniciar sesión:', error);
        if (error.response) {
          console.error('Error de respuesta del servidor:', error.response.data);
          if (error.response.data.message === 'Contraseña incorrecta') {
            setErrorTextPass(error.response.data.message); // Establece el mensaje de error de contraseña
            setErrorText(''); // Limpia el mensaje de error de correo si existe
          } else if (error.response.data.message === 'Usuario no registrado') {
            setErrorText(error.response.data.message); // Establece el mensaje de error de correo
            setErrorTextPass(''); // Limpia el mensaje de error de contraseña si existe
          } else if (error.response.data.message === 'Usuario no aprobado') {
            setOpenSnackbar(true)
            setApprovedMessage('Este usuario no ha sido aprobado. Recibirás una notificación por correo electrónico cuando seas aprobado. ')
            setErrorTextPass('')
          } else {
            console.error('Error desconocido:', error.response.data.message);
          }
        } else if (error.request) {
          console.error('Error de red al realizar la solicitud:', error.request);
        } else {
          console.error('Error al enviar la solicitud:', error.message);
        }
      }
    }
  };

  const labelStyles = {
    color: theme.palette.primary.main, // Color del texto del label
    marginTop: '-9px',
    fontSize: { xs: '1.5rem', sm: '1.8rem', md: '1.8rem', lg: '1.8rem', xl: '1.8rem' },
  };

  const inputStyles = {
    // Aquí  estilos que desees para los inputs
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
      // width: '180px'
    },
  };

  const actionsStyles = {
    justifyContent: 'center', // Centrar el botón horizontalmente
    margin: '0px',
    marginTop: '20px',
    gap: '20px',
    fontWeight: 500,

    '& .MuiButton-contained': {
      fontSize: { xs: '1rem', sm: '1.2rem', md: '1.2rem', lg: '1.2rem', xl: '1.2rem' }, // Aumentar el tamaño del texto a 1.2 rem
      fontWeight: 'bold', // Hacer el texto negrita
      textTransform: 'none',
      '&:hover': {
        backgroundColor: theme.palette.primary.dark, // Cambia el color de fondo en hover
        color: theme.palette.primary.light, // Cambia el color del texto en hover
        textTransform: 'none',
      },
    },
    '& .MuiButton-outlined': {
      fontSize: { xs: '1rem', sm: '1.2rem', md: '1.2rem', lg: '1.2rem', xl: '1.2rem' }, // Aumentar el tamaño del texto a 1.2 rem
      fontWeight: 'bold', // Hacer el texto negrita
      textTransform: 'none',
    },
  };

  return (
    <Box sx={{ padding: 0, m: 0 }}>
      <div>
        <Typography variant="h2" color='primary.light'
          sx={{
            marginLeft: '2px',
            fontSize: { xs: '1.4rem', sm: '1.8rem', md: '1.8rem', lg: '1.8rem', xl: '1.8rem' }
          }}>
          Acceder a tu cuenta
        </Typography>
        <Typography variant="h5" color="primary.main"
          sx={{
            marginLeft: '5px',
            my: '10px',
            fontSize: { xs: '1.1rem', sm: '1.2rem', md: '1.2rem', lg: '1.2rem', xl: '1.3rem' },
          }}>
          Aun no eres miembro ?
          <MuiLink onClick={handleegisterLinkClicRk} color="primary.light" underline="none"
            sx={{
              cursor: 'pointer',
              '&:hover': {
                color: theme.palette.primary.main
              },
              marginLeft: '5px'
            }}>
            Registrarse
          </MuiLink>
        </Typography>
      </div>
      <Grid container component={Box} sx={{ padding: 0, m: 0 }} >
        <form onSubmit={handleLogin} >

          <TextField
            label="E-mail"
            name="email"
            type="email"
            value={loginData.email}
            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
            error={errorText !== ''}
            helperText={errorText}
            margin="normal"
            fullWidth
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
                fontWeight: 'bold'
                /* Agrega otros estilos que desees... */
              },
            }}
          />

          <TextField
            label="Password"
            name="password"
            margin="normal"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            value={loginData.password}
            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            error={errorTextPass !== ''}
            helperText={errorTextPass}
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

                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}

            FormHelperTextProps={{
              sx: {
                fontSize: '1rem',
                color: theme.palette.primary.light,

              },
            }}
          />
          <Typography variant="h5" sx={{ mb: 2 }} >

            <MuiLink onClick={handlePassLinkClicRk}
              sx={{
                cursor: 'pointer',
                fontSize: { xs: '1rem', sm: '1.2rem', md: '1.2rem', lg: '1.2rem', xl: '1.2rem' },
                '&:hover': {
                  color: theme.palette.primary.main
                },
                marginLeft: '8px',
                marginTop: '10px'
              }} style={{ color: theme.palette.primary.main }}>
              Olvidó su contraseña?
            </MuiLink>

          </Typography>
          <ReCAPTCHA
            sitekey="6Lfj8zIpAAAAAJ5nQr549h4ERFR5xFTazyofxzJ2"
            onChange={handleCaptchaVerification}
          />
        </form>
        <Grid container component={Box} sx={actionsStyles} size="medium" >
          <Button variant="outlined" onClick={handleClose} color="primary" sx={{ padding: 1 }}>
            Cancelar
          </Button>

          <LoadingButton
            onClick={handleLogin}
            endIcon={<SendIcon />}
            loading={loading}
            loadingPosition="end"
            variant="contained"
            disabled={!loginData.email && !loginData.password}
            sx={{ padding: 1 }}
          >
            <span>Iniciar Sesión</span>
          </LoadingButton>
          <Button
            onClick={handleClose}
            variant="outlined"
            color='secondary'
            sx={{ padding: 1 }}
            startIcon={<CloseIcon />}>Cerrar</Button>

        </Grid>
      </Grid>
      {approvedMessage && (
        <Snackbar
          open={openSnackbar}
          autoHideDuration={10000}
          onClose={() => setApprovedMessage('')}
        >
          <SnackbarContent
            message={approvedMessage}
          />
        </Snackbar>
      )}
    </Box>
  )
}

