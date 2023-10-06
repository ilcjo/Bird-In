import * as React from 'react'
import { Box, Button, Grid, Link, Typography, useTheme } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { MenuBar } from '../components/Menus/MenuBar'
import { useSelector } from 'react-redux'


const sections = [
  {
    id: 'aves',
    title: 'Aves',
    description: 'Galería de aves',
  },
  {
    id: 'animales',
    title: 'Animales',
    description: 'Galería de animales',
  },
  {
    id: 'peces',
    title: 'Peces',
    description: 'Galería de peces',
  },
  {
    id: 'flores',
    title: 'Flora',
    description: 'Galería de flora',
  },
  {
    id: 'paisajes',
    title: 'Paisajes',
    description: 'Galería de paisajes',
  },
  {
    id: 'SobreMi',
    title: 'Sobre Mi',
    description: 'Leer sobre mi',
  },
  {
    id: 'panelAdministrador',
    title: 'Admin',
    description: 'Dashboard ',
  },
];

export const HomeMenu = () => {
  const theme = useTheme()
  const admin = localStorage.getItem('tipoCliente')
  const isAdmin = admin === 'admin'
  const { allCustom } = useSelector(state => state.customizesSlice)


  // Accede a las propiedades específicas de allCustom para obtener las URL de las imágenes
  const images = {
    aves: allCustom.cover_birds,
    animales: allCustom.cover_animals,
    peces: allCustom.cover_fish,
    flores: allCustom.cover_flowers,
    paisajes: allCustom.cover_land,
    SobreMi: allCustom.cover_about,
    panelAdministrador: allCustom.covert_admin, // Corregir el nombre de la propiedad
  };

  return (
    <div>
      <MenuBar ShowFilterButton={false} ShowBackButton={false} />
      <Grid container spacing={1} sx={{ justifyContent: 'center', alignItems: 'center' }}>
        {sections.map((section, index) => (
          // Verifica si no es el elemento "Admin" o si el usuario es un administrador
          (isAdmin || section.id !== 'panelAdministrador') && (
            <Grid item xs={12} sm={6} md={1.6} key={section.id} sx={{ margin: '5px', mt: 0 }}>
              <div style={{ position: 'relative', overflow: 'hidden' }}>
                <Link component={RouterLink} to={`/${section.id}`} style={{ textDecoration: 'none' }}>
                  <img
                    src={images[section.id]} // Usa la URL de la imagen específica de allCustom
                    alt={section.title}
                    style={{
                      width: '100%',
                      height: '580px',
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
                      {section.id === 'SobreMi'
                        ? 'Leer' // Cambia el texto para el panel "Sobre Mi"
                        : section.id === 'panelAdministrador' && isAdmin
                          ? 'Ir al panel' // Cambia el texto para el panel de administrador cuando el usuario es un administrador
                          : 'Ir galería' // Texto predeterminado para otros paneles
                      }
                    </Button>
                  </Box>
                </Link>
              </div>
            </Grid>
          )
        ))}
      </Grid>
    </div>
  );
}