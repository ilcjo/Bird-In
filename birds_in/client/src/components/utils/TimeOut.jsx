import {
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Snackbar,
  SnackbarContent,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Loading } from './Loading';

export const TimeOut = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { allCustom } = useSelector(state => state.customizesSlice);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [successMessage, setSuccessMessage] = React.useState('');
  const [loadingMessage, setLoadingMessage] = React.useState('Cargando...');
  const [showBackdrop, setShowBackdrop] = React.useState(false);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState('');
  const [formData, setFormData] = React.useState({
    passFirst: '',
    passSecond: '',
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setShowBackdrop(true);

    try {
      // Validar que las contraseñas coincidan
      if (formData.passFirst !== formData.passSecond) {
        setError('Las contraseñas no coinciden.');
        setShowBackdrop(false);
        return;
      }

      // Realizar aquí la lógica para enviar las contraseñas al backend
      await dispatch(pendingEmail(formData.email, formData.passFirst))
      setOpenSnackbar(true);
      setSuccessMessage('Cambio de contraseña exitoso.');

      // Limpiar el formulario después de un cambio exitoso
      setFormData({
        passFirst: '',
        passSecond: '',
      });

    } catch (error) {
      alert(`Error: ${error}`);
    } finally {
      setShowBackdrop(false);
    }
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

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: 'rgba(0, 56, 28, 0.3)', // Fondo semi-transparente
        backdropFilter: 'blur(10px)', // Efecto de desenfoque de fondo
        padding: '20px',
      }}
    >
      <img
        src={allCustom.logo}
        alt="Logo"
        style={{
          width: '130px',
          height: 'auto',
          marginBottom: '20px',
          borderRadius: '50%',
          backgroundColor: '#103300',
        }}
        loading="lazy"
      />

      <Grid container spacing={2} sx={{ width: '100%', maxWidth: '500px' }}>
        <Grid item xs={12}>
          <Typography variant='h2' color='primary' sx={{ textAlign: 'center' }}>
            Ingrese la Nueva Contraseña
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Contraseña"
            name="passFirst"
            margin="normal"
            error={error !== ''}
            type={showPassword ? 'text' : 'password'}
            fullWidth
            InputProps={{
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
                fontSize: '1rem',
                color: theme.palette.error.main,
                fontWeight: 'bold'
              },
            }}
            value={formData.passFirst}
            onChange={(e) => {
              setFormData({ ...formData, passFirst: e.target.value });
              validatePassword(e.target.value);
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Confirmar Contraseña"
            name="passSecond"
            margin="normal"
            error={error !== ''}
            type={showPassword ? 'text' : 'password'}
            fullWidth
            InputProps={{
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
                fontSize: '1rem',
                color: theme.palette.error.main,
                fontWeight: 'bold'
              },
            }}
            value={formData.passSecond}
            onChange={(e) => {
              setFormData({ ...formData, passSecond: e.target.value });
              validatePassword(e.target.value);
            }}
          />
        </Grid>

        <Grid item xs={12} sx={{ textAlign: 'center', marginTop: '20px' }}>
          <Typography variant="body1" sx={{ color: theme.palette.primary.light }}>
            La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial.
          </Typography>
        </Grid>

        <Grid item xs={12} sx={{ textAlign: 'center', marginTop: '20px' }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
          >
            Verificar
          </Button>
        </Grid>
      </Grid>

      <Loading
        message={loadingMessage}
        open={showBackdrop}
      />

      {successMessage && (
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setSuccessMessage('')}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <SnackbarContent
            message={successMessage}
          />
        </Snackbar>
      )}
    </Box>
  );
};
