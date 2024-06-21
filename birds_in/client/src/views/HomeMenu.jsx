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
                  height: { xs: '600px', md: '99%' }, // Altura fija para XS y altura automática para MD y superiores
                  minHeight: {
                    xs: '600px' // Altura mínima para XS
                  },
                  borderRadius: { xs: 0, md: '0px 0px 100px 100px' }
                }}
              >
                <img
                  src={images[section.id]}
                  alt={section.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: { xs: 0, md: '0px 0px 100px 100px' }
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
                    borderRadius: { xs: 0, md: '0px 0px 100px 100px' },
                  }}
                >
                  <Typography variant="h1" color="primary.main" sx={{ marginBottom: '6px', textAlign: 'center', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)' }}>
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