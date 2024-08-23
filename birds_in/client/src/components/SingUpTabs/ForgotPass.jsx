import * as React from 'react'
import {
  Alert,
  Box,
  Button,
  Grid,
  Snackbar,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { useDispatch } from 'react-redux';
//components
import { Loading } from '../utils/Loading';
//redux
import { recoverPass } from '../../redux/settings/actions/userLoginRegister';


export const ForgotPass = () => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const [showBackdrop, setShowBackdrop] = React.useState(false);
  const [loadingMessage, setLoadingMessage] = React.useState('Cargando...');
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState(null);
  const [snackBarMessage, setSnackBarMessage] = React.useState('El ave se a creado correctamente.');
  const [formRecover, setFormRecover] = React.useState({
    email: ''
  })

  const handlePass = async (e) => {
    e.preventDefault();
    setShowBackdrop(true);
    setLoadingMessage('Enviando...');
    try {
      await dispatch(recoverPass(formRecover.email));
      setShowBackdrop(false);
      setOpenSnackbar(true);
      setSnackBarMessage('Correo enviado.')

    } catch (error) {
      console.log('este es el error:', String(error))
      setErrorMessage(`Ocurrió un error: ${error}`);
      setErrorSnackbarOpen(true);
      setShowBackdrop(false);
    }
  }

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };
  return (
    <React.Fragment>
      <Box sx={{ margin: '10px' }}>
        <div>
          <Typography variant="h2" color='primary.light' sx={{ marginLeft: '2px', mb: 2 }}>
            ¿Olvidaste tu contraseña?
          </Typography>
          <Typography variant="body1" color='primary.main' sx={{ marginLeft: '2px', mb: 2 }}>
            Ingresa tu correo y recibirás un correo electrónico con los pasos para recuperar tu cuenta.
          </Typography>
        </div>

        <form onSubmit={handlePass} >
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
          />
        </form>
        <Grid container component={Box} justifyContent="center" size="medium">
          <Button variant="contained" onClick={handlePass} color="primary">
            Recuperar Contraseña
          </Button>
        </Grid>
        <Loading
          message={loadingMessage}
          open={showBackdrop}
        />
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000} // Duración en milisegundos (ajusta según tus preferencias)
        onClose={handleCloseSnackbar}
        message={snackBarMessage}
      >
      </Snackbar>
      {/* Snackbar for error message */}
      <Snackbar
        open={errorSnackbarOpen}
        autoHideDuration={5000} // Adjust the duration as needed
        onClose={() => setErrorSnackbarOpen(false)}
      >
        <Alert
          elevation={6}
          variant="filled"
          severity="error"
          onClose={() => setErrorSnackbarOpen(false)}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </React.Fragment>
  )
}

