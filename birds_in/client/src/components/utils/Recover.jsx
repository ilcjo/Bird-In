import React, { useEffect, useState } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';

import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loading } from './Loading';
import axios from 'axios';
import { changePassToken } from '../../redux/actions/userLoginRegister';

export const Recover = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { allCustom } = useSelector(state => state.customizesSlice);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loadingMessage, setLoadingMessage] = useState('Cargando...');
  const [showBackdrop, setShowBackdrop] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  console.log(token)
  const [formData, setFormData] = useState({
    passFirst: '',
    passSecond: '',
  });
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenExpired, setTokenExpired] = useState(false); // Nuevo estado para verificar si el token ha expirado
  const location = useLocation();
  const navigate = useNavigate()

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tokenUrl = searchParams.get('token');
    setToken(tokenUrl);
    const verifyToken = async () => {
      if (tokenUrl) {
        try {
          const response = await axios.get(`verificar?token=${tokenUrl}`);
          const data = response.data;
          if (data.message === 'Token válido') {
            setTokenValid(true);
            setToken(tokenUrl);
          } else {
            setErrorMessage(data.message);
          }
        } catch (error) {
          setTokenExpired(true)
          setErrorMessage('Error al verificar el token');
          setTokenValid(false)
        } finally {
          setShowBackdrop(false);
        }
      } else {
        setErrorMessage('Token no proporcionado');
        setShowBackdrop(false);
      }
    };

    setShowBackdrop(true);
    verifyToken();
  }, [location.search]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setShowBackdrop(true);

    try {
      if (formData.passFirst !== formData.passSecond) {
        setError('Las contraseñas no coinciden.');
        setShowBackdrop(false);
        return;
      }

      // Lógica para enviar la nueva contraseña al backend
      await dispatch(changePassToken(formData.passFirst, token));
      setOpenSnackbar(true);
      setSuccessMessage('Cambio de contraseña exitoso.');

      setFormData({
        passFirst: '',
        passSecond: '',
      }); setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      alert(`Error: ${error}`);
    } finally {
      setShowBackdrop(false);
    }
  };

  const validatePassword = (password) => {
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

  if (tokenExpired) {
    return (

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'auto',
          padding: '20px',
          backgroundColor: 'rgba(32,60,18, 0.2)',
          backdropFilter: 'blur(8px)',
          borderRadius: '20px',
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

        <Typography variant="h5" color="primary.light" align="center">
          El token que a solicitado ha expirado o es inválido. Por favor, solicite un nuevo enlace.
        </Typography>
      </Box>
    );
  }

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
            Restablecer
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