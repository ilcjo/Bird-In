import * as React from 'react';
import { Grid, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Link as MuiLink } from '@mui/material';
import { Link as ScrollLink, animateScroll as scroll } from 'react-scroll';
import imageBird from '../assets/images/DSC01585-106.jpg'


const sections = [
  {
    id: 'aves',
    ref: React.createRef(),
    imageUrl: imageBird,
    title: 'Aves',
    description: 'Galerías de imágenes de aves',
  },
  {
    id: 'animales',
    ref: React.createRef(),
    imageUrl: 'https://source.unsplash.com/random?animal',
    title: 'Animales',
    description: 'Galerías de imágenes de animales',
  },
  {
    id: 'peces',
    ref: React.createRef(),
    imageUrl: 'https://source.unsplash.com/random?fish',
    title: 'Peces',
    description: 'Galerías de imágenes de peces',
  },
  {
    id: 'flores',
    ref: React.createRef(),
    imageUrl: 'https://source.unsplash.com/random?flower',
    title: 'Flores',
    description: 'Galerías de imágenes de flores',
  },

  {
    id: 'paisajes',
    ref: React.createRef(),
    imageUrl: 'https://source.unsplash.com/random?landscape',
    title: 'Paisajes',
    description: 'Galerías de imágenes de paisajes',
  },

];

export const HomeMenu = () => {
  // Función para manejar el clic en el enlace de scroll suave
  const handleScrollTo = (sectionId) => {
    scroll.scrollTo(sectionId, {
      duration: 800,
      smooth: 'easeInOutQuart',
    });
  };

  React.useEffect(() => {
    // Función para manejar el desplazamiento del mouse
    const handleMouseScroll = (event) => {
      const delta = Math.sign(event.deltaY); // Verifica la dirección del desplazamiento
      if (delta > 0) {
        // Hacia abajo
        // Desplázate a la siguiente sección al hacer scroll hacia abajo
        const currentSectionIndex = sections.findIndex((section) => {
          return (
            section.ref &&
            section.ref.current &&
            section.ref.current.getBoundingClientRect().top >= 0 &&
            section.ref.current.getBoundingClientRect().bottom <= window.innerHeight
          );
        });
        if (currentSectionIndex !== -1 && currentSectionIndex < sections.length - 1) {
          const nextSectionIndex = currentSectionIndex + 1;
          handleScrollTo(sections[nextSectionIndex].id);
        }
      } else if (delta < 0) {
        // Hacia arriba
        // Desplázate a la sección anterior al hacer scroll hacia arriba
        const currentSectionIndex = sections.findIndex((section) => {
          return (
            section.ref &&
            section.ref.current &&
            section.ref.current.getBoundingClientRect().top >= 0 &&
            section.ref.current.getBoundingClientRect().bottom <= window.innerHeight
          );
        });
        if (currentSectionIndex !== -1 && currentSectionIndex > 0) {
          const prevSectionIndex = currentSectionIndex - 1;
          handleScrollTo(sections[prevSectionIndex].id);
        }
      }
    };
    // Agrega un oyente de eventos para el desplazamiento del mouse
    window.addEventListener('wheel', handleMouseScroll);

    // Limpia el oyente de eventos cuando el componente se desmonta
    return () => {
      window.removeEventListener('wheel', handleMouseScroll);
    };
  }, []); // Ejecuta esto solo una vez al montar el componente

  return (
    <div>
      {sections.map((section) => (
        <div
          id={section.id}
        key={section.id}
          style={{
            height: '100vh',
            backgroundImage: `url(${section.imageUrl})`,
            backgroundSize: 'cover',
          }}
        >
          <Grid
            container
            alignItems="center"
            justify="center"
            style={{
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
          >
            <Grid item xs={12} style={{ textAlign: 'center' }}>
              <Typography variant="h1" color="primary.main">
                {section.title}
              </Typography>
              <Typography variant="body1" color="primary.light">
                {section.description}
              </Typography>
              <MuiLink
                component={RouterLink}
                to={`/${section.id}`}
                color="primary.main"
              >
                Ir a la página
              </MuiLink>
              <br />
              {/* Enlace de scroll suave al hacer clic */}
              <ScrollLink
                to={section.id}
                smooth={true}
                offset={-50} // Ajusta el desplazamiento vertical
                duration={800} // Duración de la animación en milisegundos
              >
                Scroll Down
              </ScrollLink>
            </Grid>
          </Grid>
        </div>
      ))}
    </div>
  );
};