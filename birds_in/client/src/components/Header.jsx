import React from 'react'
import { Box, Grid, Typography } from '@mui/material'
import image from '../assets/images/sreenivas-zqtZKhfDaYE-unsplash.jpg'

export const Header = () => {
  return (
    <Grid container component={Box} sx={{
      height: '40vh',
      width: '100%',
      position: 'relative',
      backgroundColor: 'rgba(255, 255, 255, 0.8)', // Fondo semitransparente para mejorar la legibilidad
    }}>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(rgba(137, 138, 108, 0), rgba(0, 61, 21, 100))',
          opacity: 0.6,
        }}
      />
      <img
        src={image}
        alt="Ave"
        style={{ width: '100vw', height: '100%', objectFit: 'cover', }}
      />
      <Typography variant='h1' color="primary.main" sx={{
        position: 'absolute',
        top: '50%', // Centra verticalmente el título
        left: '20%', // Centra horizontalmente el título
        transform: 'translate(-50%, -50%)', // Ajusta la posición centrada
        padding: '10px', // Añade un poco de espacio alrededor del título
        borderRadius: '4px', // Agrega bordes redondeados al fondo del título

      }}>
        Bienvenido Usuario
      </Typography>
      <Typography variant='body1' color="primary.light" sx={{
        position: 'absolute',
        top: '65%', // Centra verticalmente el título
        left: '20%', // Centra horizontalmente el título
        transform: 'translate(-34%, -36%)', // Ajusta la posición centrada
        padding: '10px', // Añade un poco de espacio alrededor del título
        borderRadius: '4px', // Agrega bordes redondeados al fondo del título
        width: '500px',
      }}>
        Esta es una pagina sobre ornimologia, mi pasion por las vaes
        bienvenidos a este mi mundo
      </Typography>


    </Grid>
  )
}
