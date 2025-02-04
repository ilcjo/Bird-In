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
  Stack,

} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import ReCAPTCHA from 'react-google-recaptcha';
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
//icons
import { Visibility, VisibilityOff } from '@mui/icons-material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import LoginIcon from '@mui/icons-material/Login';
//redux
import { loginFailure, loginRequest } from '../../redux/settings/slices/Auth';
import { Boolean } from '../../redux/settings/slices/OpenClose';
import { loginUser } from '../../redux/settings/actions/userLoginRegister';

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

  const handleRegisterLinkClick = (e) => {
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

  return (
    <Box sx={{ margin: '0px' }}>
      <div>
        <Typography variant="h2" color='primary.light' sx={{ mb: 1.5, mt: 2 }}>
          Acceder a tu cuenta
        </Typography>
        <Typography variant="h5" color="primary.main" sx={{ marginLeft: '0px', my: '10px' }}>
          Aun no eres miembro ?
          <MuiLink onClick={handleRegisterLinkClick} color="primary.light" underline="none"
            sx={{
              cursor: 'pointer',
              '&:hover': {
                color: theme.palette.primary.main
              },
              marginLeft: '7px'
            }}>
            Registrarse
          </MuiLink>
        </Typography>
      </div>
      <Grid container component={Box}  >
        <Grid container justifyContent="center" alignItems="center">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <form onSubmit={handleLogin} >
              <TextField
                label="E-mail"
                name="email"
                type="email"
                color='primary'
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                error={errorText !== ''}
                helperText={errorText}
                margin="normal"
                fullWidth
                FormHelperTextProps={{
                  sx: {
                    fontSize: '1rem',
                    color: theme.palette.primary.light,
                    fontWeight: 'bold'
                  },
                }}
              />

              <TextField
                label="Password"
                name="password"
                margin="normal"
                color='primary'
                type={showPassword ? 'text' : 'password'}
                fullWidth
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                error={errorTextPass !== ''}
                helperText={errorTextPass}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin(e)}
                InputProps={{
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
                    fontWeight: 'bold'
                  },
                }}
                sx={{
                  // fontSize: '1rem', // Tamaño de texto interno
                  // input: { fontSize: '1rem', height: '60px' }, // Tamaño del texto de entrada
                  // minHeight: '60px', // Altura mínima para igualar el tamaño predeterminado de MUI
                  // width: { xs: '100%', md: '520px' }
                }}
              />
              <Typography variant="h5" sx={{ mb: 5, mt: 2 }}>
                {/* <ReCAPTCHA
              sitekey="6Lfj8zIpAAAAAJ5nQr549h4ERFR5xFTazyofxzJ2"
              onChange={handleCaptchaVerification}
            /> */}
                <MuiLink onClick={handlePassLinkClicRk}
                  color="primary.light" underline="none"
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      color: theme.palette.primary.main
                    },
                    // marginLeft: '5px'

                  }} >
                  Olvidó su contraseña?
                </MuiLink>
              </Typography>

            </form>
          </Box>
        </Grid>
        <Stack spacing={1} direction="row" justifyContent="center"
          alignItems="center"
          sx={{
            margin: 'auto', // Centrar horizontalmente el Stack
            width: 'fit-content', // Ajustar el ancho al contenido

          }}
        >
          <Button variant="outlined" onClick={handleClose} color="error" sx={{ fontSize: { xs: '1rem' } }}
            startIcon={<CloseIcon />}
          >
            Cerrar
          </Button>
          <LoadingButton
            onClick={handleLogin}
            endIcon={<LoginIcon />}
            loading={loading}
            loadingPosition="end"
            disabled={!loginData.email && !loginData.password}
            variant='contained'
          >
            <span>Entrar</span>
          </LoadingButton>
          {/* <Button
            sx={{ fontSize: { xs: '1rem' } }}
            onClick={handleClose}
            variant="outlined"
            color='error'
            startIcon={<CloseIcon />}>Cerrar</Button> */}
        </Stack>
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

