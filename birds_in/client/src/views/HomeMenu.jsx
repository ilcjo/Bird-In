import * as React from 'react';
import { Box, Button, Typography, IconButton, Divider, useTheme, useMediaQuery, Tooltip } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import { CopyRight } from '../components/CopyRight';
import { isFromBird, isFromMam, isSaltar, isSFromRept } from '../redux/paisaje/slicesP/LandscapeSlice';
import { isSaltarBird } from '../redux/birds/slices/InfoSlice';
import { isSaltarMa } from '../redux/mamiferos/slices/InfoSlice';
import { isSaltarRept } from '../redux/reptiles/slices/InfoSlice';
import fondo from '../assets/images/fondo.png';


const sections = [
  { id: 'aves', title: 'Aves', description: 'Fotografías de aves' },
  { id: 'mamiferos', title: 'Mamiferos', description: 'Fotografías de Mamiferos' },
  { id: 'reptiles', title: 'Reptiles y Anfibios', description: 'Fotografías de Reptiles' },
  { id: 'paisajes', title: 'Paisajes', description: 'Fotografías de paisajes' },
  { id: 'peces', title: 'Peces', description: 'Fotografías de peces' },
  { id: 'insectos', title: 'Insectos', description: 'Fotografías de Insectos' },
];

export const HomeMenu = () => {
  const theme = useTheme();
  const dispatch = useDispatch()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [showSobreMi, setShowSobreMi] = React.useState(true);
  const { allCustom } = useSelector((state) => state.customizesSlice);
  const admin = localStorage.getItem('tipoCliente');
  const isAdmin = admin === 'admin';
  React.useEffect(() => {
    dispatch(isSaltarBird(false)),
      dispatch(isSaltar(false)),
      dispatch(isSaltarMa(false)),
      dispatch(isFromBird(false)),
      dispatch(isFromMam(false)),
      dispatch(isSFromRept(false)),
      dispatch(isSaltarRept(false))

  }, []);
  // Access image URLs
  const images = {
    aves: allCustom.cover_birds,
    mamiferos: allCustom.cover_animals,
    reptiles: allCustom.cover_reptile,
    paisajes: allCustom.cover_land,
    peces: allCustom.cover_fish,
    insectos: allCustom.cover_insect,
    SobreMi: allCustom.cover_about,
  };

  return (
    <Box
      sx={{
        minHeight: '110vh',
        width: '100%',
        paddingTop: '90px',
        position: 'relative',
        backgroundImage: `url(${fondo})`,
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
      }}
    >

      {/* Overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(11, 53, 15, 0.45)',
          backdropFilter: 'blur(0px)',
          zIndex: 1,
          
        }}
      >

        {/* GRID */}
        <Box
          sx={{
            padding: { xs: '16px', md: '32px', lg: '80px 50px 50px 50px' },
            minHeight: '10vh',
            display: 'grid',
            gridTemplateColumns: isMobile
              ? 'repeat(1, 1fr)'
              : showSobreMi
                ? 'repeat(4, 1fr)'
                : 'repeat(3, 1fr)',
            gridTemplateRows: 'repeat(2, 1fr)',
            gap: { xs: '16px', md: '15px' },
            transition: 'grid-template-columns 0.5s ease-in-out',

            position: 'relative',
            zIndex: 2,
          }}
        >

          {sections.map((section) => (
            <Box
              key={section.id}
              //       sx={{
              //         position: 'relative',
              //         overflow: 'hidden',
              //         transition: 'transform 0.5s ease-in-out',
              //        '&:hover img': {
              //   transform: 'scale(1.1)', // Aumenta el tamaño de la imagen en hover
              // },
              //         height: '50vh',
              //         display: 'flex',
              //         // flexDirection: 'column',
              //         // justifyContent: 'flex-end', // Align content at the bottom
              //         gridColumn: isMobile ? 'auto' : (section.id === 'SobreMi' && !showSobreMi ? 'auto' : 'auto'),
              //         gridRow: isMobile ? 'auto' : (section.id === 'SobreMi' && !showSobreMi ? 'auto' : 'auto'),
              //       }}
              sx={{
                position: 'relative',
                overflow: 'hidden',
                height: '40vh',
                display: 'flex',

                borderRadius: '10px',
                background: 'rgba(0,0,0,0.25)',
                backdropFilter: 'blur(6px)',

                boxShadow: `
    0 0 0 1px rgba(255,255,255,0.15),
    0 20px 40px rgba(0,0,0,0.45)
  `,

                transition: 'transform 0.35s ease',
                '&:hover': {
                  transform: 'scale(1.015)',
                },

                '&:hover img': {
                  opacity: 0.8,
                },
              }}

            >
              <RouterLink to={`/${section.id}`} style={{
                display: 'block', 
                width: '100%',    
                height: '100%',
              }}>
                <img
                  src={images[section.id]}
                  alt={section.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none', transition: 'transform 0.5s ease-in-out', }}
                />
              </RouterLink>
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  background: 'linear-gradient(to top, rgba(1, 26, 4, 0.8),transparent)',
  transition: 'opacity 0.35s ease-in-out',
                  // background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent)',
                  color: '#fff',
                  // borderRadius: '0px 0px 10px 0px',
                  // '&:hover .title-text': { color: theme.palette.primary.main }, // Cambia color del texto en hover
                  // '&:hover .divider-line': { transform: 'translateX(10px)' },
                }}
              >
                <RouterLink to={`/${section.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>

                  <Typography variant="h2" color="white"
                    className="title-text"
                    sx={{

                      mb: '-5px',
                      ml: 2,
                      transition: 'color 0.3s ease-in-out', // Transición para el color
                    }}>

                    {section.title}
                  </Typography>
                  <Divider
                    className="divider-line"
                    sx={{
                      ml: 2, my: 1, borderColor: 'rgba(234, 240, 234, 0.4)', borderWidth: '1.3px', borderRadius: '2px', width: '50%',
                      transition: 'transform 0.3s ease-in-out', // Agregamos transición
                      transformOrigin: 'left', // Punto de origen del movimiento
                    }} />
                </RouterLink>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between', // Distribute space between title and buttons
                    alignItems: 'center', // Center content vertically
                    px: 2,
                    pb: 2,
                  }}
                >
                  <Box sx={{ display: 'flex', marginLeft: 'auto' }}>
                    {isAdmin && section.id !== 'SobreMi' && (
                      <Button
                        endIcon={<ArrowForwardIcon />}
                        variant="outlined"
                        color="secondary"
                        component={RouterLink}
                        sx={{ fontSize: { xs: '1rem' } }}
                        to={`/panel${section.id}`}
                      >
                        Editar
                      </Button>
                    )}
                    {/* <Button
                  variant="contained"
                  color="primary"
                  sx={{borderRadius: '0px 0px 10px 0px'}}
                  component={RouterLink}
                  to={`/${section.id}`}
                >
                  {section.id === 'SobreMi' ? 'Leer' : 'Galería'}
                </Button> */}
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}

          {/* Panel "Sobre Mi" */}
          {isMobile || showSobreMi ? (
            <Box
              sx={{
                gridColumn: isMobile ? 'auto' : (showSobreMi ? '4 / span 1' : 'auto'),
                gridRow: isMobile ? 'auto' : (showSobreMi ? '1 / span 2' : 'auto'),
                position: 'relative',
                overflow: 'hidden',
                height: '100%',
                borderRadius: '10px',
                transition: 'transform 1s ease-in-out',
                filter: 'grayscale(50%)', // Estado inicial en blanco y negro
                '&:hover': {
                  filter: 'grayscale(0%)',  // Recupera los colores en hover
                },
              }}
            >
              <img
                src={images['SobreMi']}
                alt="Sobre Mi"
                style={{
                  width: '100%', height: '100%', objectFit: 'cover',
                  transition: 'transform 0.5s ease-in-out, '
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  padding: '20px',
                  height: '30%',
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'linear-gradient(to top, rgba(1, 26, 4, 0.8), transparent)',
                }}
              >
                <Typography variant="h2" color="white"
                  className="title-text"
                  sx={{


                    transition: 'color 0.3s ease',
                  }}>
                  Sobre Mi
                </Typography>
                <Divider
                  className="divider-line"
                  sx={{
                    my: 1, borderColor: theme.palette.secondary.main, borderWidth: '1.3px', borderRadius: '2px', width: '50%', transition: 'transform 0.3s ease-in-out', // Agregamos transición
                    transformOrigin: 'start',
                  }} />
                <Typography variant="body1" color="secondary"
                  sx={{ pr: 5 }}
                >Observador paciente y amante de la vida silvestre</Typography>
                <Box mt={2} sx={{ display: 'flex', justifyContent: 'start' }}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    component={RouterLink}
                    to="/SobreMi"
                    sx={{ top: { xs: '-25px', md: '20px' }, left: { xs: '150px', md: '0px' } }}
                  >
                    Leer
                  </Button>
                </Box>
              </Box>
            </Box>

          ) : null}
        </Box>
        <CopyRight.Photo />
      </Box>
    </Box>
  );
};
