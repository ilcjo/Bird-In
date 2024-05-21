import * as React from 'react'
import { Box, Button, Grid, Typography, useTheme } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { useSelector } from 'react-redux';

const sections = [
  {
    id: 'aves',
    title: 'Aves',
    description: 'Fotografías de aves',
  },
  {
    id: 'animales',
    title: 'Animales',
    description: 'Fotografías de animales',
  },
  {
    id: 'peces',
    title: 'Peces',
    description: 'Fotografías de peces',
  },
  {
    id: 'paisajes',
    title: 'Paisajes',
    description: 'Fotografías de paisajes',
  },
  {
    id: 'flores',
    title: 'Flores',
    description: 'Fotografías de Flores',
  },
  {
    id: 'SobreMi',
    title: 'Sobre Mi',
    description: 'Leer sobre mi',
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

  const renderPanelButton = (sectionId) => {
    if (isAdmin && sectionId !== 'SobreMi') {
      return (
        <Button
          variant="outlined"
          color="primary"
          //   sx={{
          //     fontSize: '1.3rem', padding: '5px 10px', fontWeight: 'bold',  textTransform: 'none',
          //     backgroundColor: theme.palette.primary.dark, mt: 0,
          //     color: theme.palette.primary.light,
          //     // marginTop: '10px',
          //     '&:hover': {
          //         backgroundColor: theme.palette.primary.dark, // Cambia el color de fondo en hover
          //         color: theme.palette.primary.light, // Cambia el color del texto en hover
          //         textTransform: 'none',
          //     },
          // }}
          component={RouterLink}
          to={`/panel${sectionId}`}
        >
          Editar
        </Button>
      );
    }
    return null;
  };

  // Accede a las propiedades específicas de allCustom para obtener las URL de las imágenes
  const images = {
    aves: allCustom.cover_birds,
    animales: allCustom.cover_animals,
    peces: allCustom.cover_fish,
    flores: allCustom.cover_flowers,
    paisajes: allCustom.cover_land,
    SobreMi: allCustom.cover_about,
    panelAdministrador: allCustom.covert_admin,
  };

  return (
    <div>
      <Grid container spacing={0.5} sx={{ height: '100vh', justifyContent: 'center', alignItems: 'stretch', backgroundColor: '#86ac8e' }}>
        {sections.map((section, index) => (
          (isAdmin || section.id !== 'panelAdministrador') && (
            <Grid item xs={12} sm={6} md={2} key={section.id} sx={{ margin: '0px', mt: 0 }}>
              <Box
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
                  width: '100%',
                  height: '99%',
                  // mt: 1
                }}
              >
                <img
                  src={images[section.id]}
                  alt={section.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '0px  0px 100px 100px'
                  }}
                  onClick={() => handleSectionClick(section.id)}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    background: 'linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent)',
                    color: '#fff',
                    // padding: '10px',
                    borderRadius: ' 0px 0px 100px 100px',

                  }}
                >
                  <Typography variant="h1" color="primary.main" sx={{ marginBottom: '6px', textAlign: 'center', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)', }}>
                    {section.title}
                  </Typography>
                  <Typography variant="h4" color="primary.light" sx={{ textAlign: 'center' }}>
                    {section.description}
                  </Typography>
                  <Box mt={2} sx={{ display: 'flex', justifyContent: 'center', mb: 7 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      component={RouterLink}
                      to={`/${section.id}`}
                      sx={{ marginRight: '10px' }}
                    >
                      {section.id === 'SobreMi' ? 'Leer' : 'Galería'}
                    </Button>
                    {(section.id !== 'SobreMi' && section.id !== 'panelAdministrador') && (
                      renderPanelButton(section.id)
                    )}
                  </Box>
                </Box>
              </Box>
            </Grid>
          )
        ))}
      </Grid>
    </div>
  );
};