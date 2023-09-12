import * as React from 'react'
import { Box, Button, Grid, Link, Typography, useTheme } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import imagenBird from '../assets/images/DSC01585-106.jpg'
import imageDash from '../assets/images/IMG_1572-2048x1536.jpg'

const sections = [
  {
    id: 'aves',
    imageUrl: imagenBird,
    title: 'Aves',
    description: 'Imágenes de aves',
  },
  {
    id: 'animales',
    imageUrl: 'https://source.unsplash.com/random?animal',
    title: 'Animales',
    description: 'Giágenes de animales',
  },
  {
    id: 'peces',
    imageUrl: 'https://source.unsplash.com/random?fish',
    title: 'Peces',
    description: 'imágenes de peces',
  },
  {
    id: 'flores',
    imageUrl: 'https://source.unsplash.com/random?flower',
    title: 'Flora',
    description: 'imágenes de flora',
  },
  {
    id: 'paisajes',
    imageUrl: 'https://source.unsplash.com/random?landscape',
    title: 'Paisajes',
    description: 'imágenes de paisajes',
  },
  {
    id: 'Admin',
    imageUrl: imageDash,
    title: 'Admin',
    description: 'Dashboard de Admin',
  },

];

export const HomeMenu = () => {
  const theme = useTheme()
  const admin = localStorage.getItem('tipoCliente')
  const isAdmin = admin === 'admin'

  return (
    <Grid container spacing={1} sx={{ marginTop: '20px', justifyContent: 'center', alignItems: 'center' }}>
     {sections.map((section) => (
    // Verifica si no es el elemento "Admin" o si el usuario es administrador
    (isAdmin || section.id !== 'Admin') && (
      <Grid item xs={12} sm={6} md={1.7} key={section.id} sx={{ margin: '5px' }}>
        <Link component={RouterLink} to={`/${section.id}`} style={{ textDecoration: 'none' }}>
          <div style={{ position: 'relative', overflow: 'hidden' }}>
            <img
              src={section.imageUrl}
              alt={section.title}
              style={{
                width: '100%',
                height: '600px',
                objectFit: 'cover',
                borderRadius: "0 0 100px 100px",
              }}
            />
            <Box
              position="absolute"
              bottom="0"
              left="0"
              width='100%'
              height='200px'
              bgcolor='rgba(0, 61, 21, 0.5)'
              color="#fff"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="left"
              padding="10px"
              borderRadius="0 0 100px 100px"
              marginBottom="4px"
              sx={{
                '& .MuiButton-contained': {
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  marginTop: '15px',
                  borderRadius: '300px',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.light,
                    color: theme.palette.primary.dark,
                    textTransform: 'none',
                  }
                },
                '& .MuiButton-outlined': {
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  textTransform: 'none',
                }
              }}
            >
              <Typography variant="h1" color="primary.main">
                {section.title}
              </Typography>
              <Typography variant="h5" color="primary.light">
                {section.description}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                component={RouterLink}
                to={`/${section.id}`}
              >
                {section.id === 'Admin' && isAdmin ? 'Ir al dashboard' : 'Ir a la galeria'}
              </Button>
            </Box>
          </div>
        </Link>
      </Grid>
    )
  ))}
</Grid>
  )
}
