import  React from 'react'
import { Box, Button, Grid, Typography } from '@mui/material'
import image from '../assets/images/DSC01570-105.jpg'
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearToken } from '../redux/slices/Auth';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


export const Header = () => {
  const usuarioNombre = localStorage.getItem("usuarioNombre");
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const onLogoutClick = () => {
    localStorage.clear();
    dispatch(clearToken())
    
    navigate('/')
  };

  const returnMenuClick = () => {
    navigate('/menu')
  };

  return (
    <Grid container component={Box} sx={{
      height: '40vh',
      width: '100%',
      position: 'relative',
      backgroundColor: 'rgba(255, 255, 255, 0)', // Fondo semitransparente para mejorar la legibilidad
    }}>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(rgba(137, 138, 108, 0), rgba(0, 61, 21, 100))',
          opacity: 0.9,
        }}
      />
      <img
        src={image}
        alt="Ave"
        style={{ width: '100vw', height: '100%', objectFit: 'cover' }}
      />

      {/* Columna izquierda */}
      <Grid
        item
        xs={6} // Controla el ancho de la columna izquierda
        sx={{
          position: 'absolute',
          top: '50%',
          left: '20%', // Ajusta la posición izquierda
          transform: 'translate(-50%, -50%)',
          padding: '10px',
          borderRadius: '4px',
        }}
      >
        <Typography
          variant="body1"
          color="primary.light"
          sx={{
            marginTop: '20px', // Espacio entre el título y el párrafo
            width: '400px', // Ajusta el ancho del texto
          }}
        >
          Esta es una página sobre ornitología, mi pasión por las aves.
        </Typography>
          <Typography variant="h1" color="primary">
            Bienvenido, {usuarioNombre}
          </Typography>
      </Grid>

      {/* Columna derecha */}
      <Grid item xs={6} // Controla el ancho de la columna derecha
        sx={{
          position: 'absolute',
          top: '80%',
          right: '10%', // Ajusta la posición derecha
          transform: 'translate(50%, -50%)',
        }}
      >
         <Button
          sx={{
            fontSize: '1rem',
            fontWeight: 'bold',
          }}
          color="primary"
          size="large"
          onClick={returnMenuClick}
          startIcon={<ArrowBackIcon />}
        >
          volver
        </Button>
        <Button
          sx={{
            fontSize: '1rem',
            fontWeight: 'bold',
          }}
          color="primary"
          size="large"
          onClick={onLogoutClick}
          endIcon={<LogoutIcon />}
        >
          Cerrar Sesión
        </Button>
       
      </Grid>
    </Grid>
  )
}