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
  const [selectedSection, setSelectedSection] = React.useState(null);

  const handleSectionClick = sectionId => {
    setSelectedSection(sectionId); // Al hacer clic en una sección, guarda la sección en el estado
    localStorage.setItem('panel', sectionId); // Guarda la sección seleccionada en el localStorage
  };
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
      <MenuBar ShowFilterButton={false} ShowBackButton={false} showAdmin={false} />
      <Grid container spacing={0.5} sx={{ justifyContent: 'center', alignItems: 'center', }}>
        {sections.map((section, index) => (
          // Verifica si no es el elemento "Admin" o si el usuario es un administrador
          (isAdmin || section.id !== 'panelAdministrador') && (
            <Grid item xxs={12} xs={12} sm={6} md={6} lg={2} key={section.id}
              sx={{
                margin: { xs: '0px', sm: '0px', md: '0px', lg: '0px', xl: '0px' },
                mt: { xs: '0px', sm: '0px', md: '0px', lg: '0px', xl: '0px' },
              }}>
              <div style={{ position: 'relative', overflow: 'hidden' }}>
                <Link
                  component={RouterLink}
                  to={`/${section.id}`}
                  style={{ textDecoration: 'none' }}
                  onClick={() => handleSectionClick(section.id)}
                >
                  <img
                    src={images[section.id]} // Usa la URL de la imagen específica de allCustom
                    alt={section.title}
                    style={{
                      width: '100%',
                      height: '615px',
                      objectFit: 'cover',
                      borderRadius: "0 0 120px 120px",
                      
                    }}
                  />
                  <Box
                    position="absolute"
                    bottom="0"
                    left="0"
                    width='100%'
                    height='200px'
                    bgcolor='rgba(0, 61, 21, 0.3)'
                    color="#fff"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    textAlign="center"
                    padding="10px"
                    borderRadius="0 0 120px 120px"
                    marginBottom="9px"
                    sx={{
                      '& .MuiButton-contained': {
                        fontSize: { xs: '1rem', sm: '1.3rem', md: '1.3rem', lg: '1.3rem', xl: '1.4rem' },
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
                    <Typography variant="h1" color="primary.main" sx={{
                      fontSize: { xs: '2.5rem', sm: '2rem', md: '2rem', lg: '2.5rem', xl: '2.6rem' },
                      marginBottom: '5px',
                      textAlign: 'center'
                    }}>
                      {section.title}
                    </Typography>
                    <Typography variant="h5" color="primary.light"
                      sx={{
                        fontSize: { xs: '1.3rem', sm: '1.3rem', md: '1.2rem', lg: '1.3rem', xl: '1.4rem' },
                        marginBottom: { xs: '5px', sm: '5px', md: '0px', lg: '5px', xl: '5px' },
                        textAlign: 'center'
                      }}>
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
};