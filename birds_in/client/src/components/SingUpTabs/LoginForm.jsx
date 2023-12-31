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
    <Box sx={{ margin: '10px' }}>
      <div>
        <Typography variant="h2" color='primary.light' sx={{ marginLeft: '2px', }}>
          Acceder a tu cuenta
        </Typography>
        <Typography variant="h5" color="primary.main" sx={{ marginLeft: '8px', my: '10px' }}>
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
      <Grid container component={Box}  >
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
                /* Agrega los estilos que desees para el texto del helper text */
                /* Por ejemplo, para agregar un margen izquierdo: */
                fontSize: '1rem',
                color: theme.palette.primary.light,
                /* Agrega otros estilos que desees... */
              },
            }}
          />
          <Typography variant="h5">
            <ReCAPTCHA
              sitekey="6Lfj8zIpAAAAAJ5nQr549h4ERFR5xFTazyofxzJ2"
              onChange={handleCaptchaVerification}
            />
            <MuiLink onClick={handlePassLinkClicRk}
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  color: theme.palette.primary.main
                },
                marginLeft: '8px',
                marginTop: '10px'
              }} style={{ color: theme.palette.primary.main }}>
              Olvidó su contraseña?
            </MuiLink>


          </Typography>

        </form>
        <Grid container component={Box} sx={actionsStyles} size="medium">
          <Button variant="outlined" onClick={handleClose} color="primary">
            Cancelar
          </Button>

          <LoadingButton
            onClick={handleLogin}
            endIcon={<SendIcon />}
            loading={loading}
            loadingPosition="end"
            variant="contained"
            disabled={!loginData.email && !loginData.password}
          >
            <span>Iniciar Sesión</span>
          </LoadingButton>
          <Button
            onClick={handleClose}
            variant="outlined"
            color='secondary'
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

