import * as React from 'react';
import { Box, Button, Typography, IconButton, Divider, useTheme, useMediaQuery } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const sections = [
  { id: 'aves', title: 'Aves', description: 'Fotografías de aves' },
  { id: 'mamiferos', title: 'Mamiferos', description: 'Fotografías de Mamiferos' },
  { id: 'reptiles', title: 'Reptiles', description: 'Fotografías de Reptiles' },
  { id: 'insectos', title: 'Insectos', description: 'Fotografías de Insectos' },
  { id: 'peces', title: 'Peces', description: 'Fotografías de peces' },
  { id: 'paisajes', title: 'Paisajes', description: 'Fotografías de paisajes' },
];

export const HomeMenu = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [showSobreMi, setShowSobreMi] = React.useState(false);
  const { allCustom } = useSelector((state) => state.customizesSlice);
  const admin = localStorage.getItem('tipoCliente');
  const isAdmin = admin === 'admin';

  // Access image URLs
  const images = {
    aves: allCustom.cover_birds,
    mamiferos: allCustom.cover_animals,
    reptiles: allCustom.cover_reptile,
    insectos: allCustom.cover_insect,
    peces: allCustom.cover_fish,
    paisajes: allCustom.cover_land,
    SobreMi: allCustom.cover_about,
  };

  return (
    <Box
      sx={{
        backgroundColor: '#103300',
        padding: '0px',
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(1, 1fr)' : (showSobreMi ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)'),
        gridTemplateRows: 'repeat(2, 1fr)',
        gap: '1px',
        transition: 'grid-template-columns 0.5s ease-in-out',
      }}
    >
      {sections.map((section) => (
        <Box
          key={section.id}
          sx={{
            position: 'relative',
            overflow: 'hidden',
            transition: 'transform 0.5s ease-in-out',
            '&:hover': { transform: 'scale(1)' },
            height: '49vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end', // Align content at the bottom
            gridColumn: isMobile ? 'auto' : (section.id === 'SobreMi' && !showSobreMi ? 'auto' : 'auto'),
            gridRow: isMobile ? 'auto' : (section.id === 'SobreMi' && !showSobreMi ? 'auto' : 'auto'),
          }}
        >
          <img
            src={images[section.id]}
            alt={section.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0px 0px 5px' }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent)',
              color: '#fff',
            }}
          >
            <Typography variant="h2" color="primary.main" sx={{ mb: '-5px', ml: 2 }}>
              <Divider sx={{ my: 1, borderColor: theme.palette.primary.main, borderWidth: '1.3px', borderRadius: '2px', width: '15%' }} />
              {section.title}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between', // Distribute space between title and buttons
                alignItems: 'center', // Center content vertically
              }}
            >
              <Box sx={{ display: 'flex', gap: '10px', marginLeft: 'auto' }}>
                {isAdmin && section.id !== 'SobreMi' && (
                  <Button
                    variant="outlined"
                    color="primary"
                    component={RouterLink}
                    to={`/panel${section.id}`}
                  >
                    Editar
                  </Button>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  component={RouterLink}
                  to={`/${section.id}`}
                >
                  {section.id === 'SobreMi' ? 'Leer' : 'Galería'}
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      ))}

      {/* Flecha para mostrar/cerrar "Sobre Mi" */}
      {!isMobile && (
        <IconButton
          sx={{
            position: 'absolute',
            top: '50%',
            right: showSobreMi ? '25%' : 0, // Changes position if tab is open
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
            },
            zIndex: 2, // Ensure the arrow is above the images
          }}
          onClick={() => setShowSobreMi(!showSobreMi)} // Toggle between showing and hiding the tab
        >
          {showSobreMi ? (
            <ArrowBackIcon sx={{ color: '#fff', fontSize: '2rem' }} />
          ) : (
            <ArrowForwardIcon sx={{ color: '#fff', fontSize: '2rem' }} />
          )}
        </IconButton>
      )}

      {/* Panel "Sobre Mi" */}
      {isMobile || showSobreMi ? (
        <Box
          sx={{
            gridColumn: isMobile ? 'auto' : (showSobreMi ? '4 / span 1' : 'auto'),
            gridRow: isMobile ? 'auto' : (showSobreMi ? '1 / span 2' : 'auto'),
            position: 'relative',
            overflow: 'hidden',
            height: '100%',
          }}
        >
          <img
            src={images['SobreMi']}
            alt="Sobre Mi"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              padding: '20px',
              background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent)',
              color: '#fff',
            }}
          >
            <Typography variant="h4" color="primary.main">
              Sobre Mi
            </Typography>
            <Box mt={2} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                component={RouterLink}
                to="/SobreMi"
              >
                Leer
              </Button>
            </Box>
          </Box>
        </Box>
      ) : null}
    </Box>
  );
};

// import * as React from 'react';
// import { Box, Button, Typography, useTheme } from '@mui/material';
// import { Link as RouterLink } from 'react-router-dom';
// import { useSelector } from 'react-redux';

// const sections = [
//   { id: 'aves', title: 'Aves', description: 'Fotografías de aves' },
//   { id: 'mamiferos', title: 'Mamiferos', description: 'Fotografías de Mamiferos' },
//   { id: 'reptiles', title: 'Reptiles', description: 'Fotografías de Reptiles' },
//   { id: 'insectos', title: 'Insectos', description: 'Fotografías de Insectos' },
//   { id: 'peces', title: 'Peces', description: 'Fotografías de peces' },
//   { id: 'paisajes', title: 'Paisajes', description: 'Fotografías de paisajes' },
//   { id: 'SobreMi', title: 'Sobre Mi', description: 'Leer sobre mi' },
// ];

// export const HomeMenu = () => {
//   const theme = useTheme();
//   const admin = localStorage.getItem('tipoCliente');
//   const isAdmin = admin === 'admin';
//   const { allCustom } = useSelector((state) => state.customizesSlice);

//   // Access image URLs
//   const images = {
//     aves: allCustom.cover_birds,
//     mamiferos: allCustom.cover_animals,
//     reptiles: allCustom.cover_reptile,
//     insectos: allCustom.cover_insect,
//     peces: allCustom.cover_fish,
//     paisajes: allCustom.cover_land,
//     SobreMi: allCustom.cover_about,
//   };

//   return (
//     <Box
//       sx={{
//         backgroundColor: '#103300',
//         padding: '0px',
//         minHeight: '100vh',
//         maxHeight: '',
//         display: 'grid',
//         gridTemplateColumns: 'repeat(3, 1fr) 1fr',
//         gridTemplateRows: 'repeat(2, 1fr)',
//         gap: '3px',
//       }}
//     >
//       {sections.slice(0, 6).map((section) => (
//         <Box
//           key={section.id}
//           sx={{
//             position: 'relative',
//             // borderRadius: '500px',
//             overflow: 'hidden',
//             transition: 'transform 0.5s ease-in-out',
//             '&:hover': { transform: 'scale(1)' },
//             height: '49vh',
//           }}
//         >
//           <img
//             src={images[section.id]}
//             alt={section.title}
//             style={{ width: '100%', height: '100%', objectFit: 'cover' }}
//           />
//           <Box
//             sx={{
//               position: 'absolute',
//               bottom: 0,
//               left: 0,
//               width: '100%',
//               padding: '20px',
//               background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent)',
//               color: '#fff',
//             }}
//           >
            
//             {/* <Typography variant="body2" color="primary.light">
//               {section.description}
//             </Typography> */}
//             <Box mt={0} sx={{ display: 'flex', justifyContent: 'center' }}>
//             <Typography variant="h2" color="primary.main">
//               {section.title}
//             </Typography>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 component={RouterLink}
//                 to={`/${section.id}`}
//                 sx={{ marginRight: '10px' }}
//               >
//                 {section.id === 'SobreMi' ? 'Leer' : 'Galería'}
//               </Button>
//               {isAdmin && section.id !== 'SobreMi' && (
//                 <Button
//                   variant="outlined"
//                   color="primary"
//                   component={RouterLink}
//                   to={`/panel${section.id}`}
//                 >
//                   Editar
//                 </Button>
//               )}
//             </Box>
//           </Box>
//         </Box>
//       ))}

//       <Box
//         sx={{
//           gridColumn: '4 / span 1',
//           gridRow: '1 / span 2',
//           position: 'relative',
//           borderRadius: '0px',
//           overflow: 'hidden',
//           transition: 'transform 0.5s ease-in-out',
//           '&:hover': { transform: 'scale(1)' },
//           height: '100%',

//         }}
//       >
//         <img
//           src={images['SobreMi']}
//           alt="Sobre Mi"
//           style={{ width: '100%', height: '100%', objectFit: 'cover' }}
//         />
//         <Box
//           sx={{
//             position: 'absolute',
//             bottom: 0,
//             left: 0,
//             width: '100%',
//             padding: '20px',
//             background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent)',
//             color: '#fff',
//           }}
//         >
//           <Typography variant="h5" color="primary.main">
//             Sobre Mi
//           </Typography>
//           <Typography variant="body2" color="primary.light">
//             Leer sobre mi
//           </Typography>
//           <Box mt={2} sx={{ display: 'flex', justifyContent: 'center' }}>
//             <Button
//               variant="contained"
//               color="primary"
//               component={RouterLink}
//               to="/SobreMi"
//             >
//               Leer
//             </Button>
//           </Box>
//         </Box>
//       </Box>
//     </Box>
//   );
// };




// import * as React from 'react';
// import { Box, Button, Divider, Grid, Typography, useTheme } from '@mui/material';
// import { Link as RouterLink } from 'react-router-dom';
// import { useSelector } from 'react-redux';

// const sections = [
//   {
//     id: 'aves',
//     title: 'Aves',
//     description: 'Fotografías de aves',
//   },
//   {
//     id: 'animales',
//     title: 'Animales',
//     description: 'Fotografías de animales',
//   },
//   {
//     id: 'peces',
//     title: 'Peces',
//     description: 'Fotografías de peces',
//   },
//   {
//     id: 'paisajes',
//     title: 'Paisajes',
//     description: 'Fotografías de paisajes',
//   },
//   {
//     id: 'flores',
//     title: 'Flores',
//     description: 'Fotografías de Flores',
//   },
//   {
//     id: 'SobreMi',
//     title: 'Sobre Mi',
//     description: 'Leer sobre mi',
//   },
// ];

// export const HomeMenu = () => {
//   const theme = useTheme();
//   const admin = localStorage.getItem('tipoCliente');
//   const isAdmin = admin === 'admin';
//   const { allCustom } = useSelector((state) => state.customizesSlice);
//   const [selectedSection, setSelectedSection] = React.useState(null);
//   const [hoveredSection, setHoveredSection] = React.useState(null);

//   const handleSectionClick = (sectionId) => {
//     setSelectedSection(sectionId); // Al hacer clic en una sección, guarda la sección en el estado
//     localStorage.setItem('panel', sectionId); // Guarda la sección seleccionada en el localStorage
//   };

//   const renderPanelButton = (sectionId) => {
//     if (isAdmin && sectionId !== 'SobreMi') {
//       return (
//         <Button
//           variant="outlined"
//           color="primary"
//           component={RouterLink}
//           to={`/panel${sectionId}`}
//         >
//           Editar
//         </Button>
//       );
//     }
//     return null;
//   };

//   // Accede a las propiedades específicas de allCustom para obtener las URL de las imágenes
//   const images = {
//     aves: allCustom.cover_birds,
//     animales: allCustom.cover_animals,
//     peces: allCustom.cover_fish,
//     flores: allCustom.cover_flowers,
//     paisajes: allCustom.cover_land,
//     SobreMi: allCustom.cover_about,
//     panelAdministrador: allCustom.covert_admin,
//   };

//   return (
//     <div>

//       <Grid container spacing={0} sx={{ height: '100vh', justifyContent: 'center', alignItems: 'stretch', backgroundColor: '#103300', overflow: { lg: 'hidden' }, }}>
//         {sections.map((section, index) => (
//           (isAdmin || section.id !== 'panelAdministrador') && (
//             <Grid item xs={12} sm={6} md={2} key={section.id}
//               sx={{
//                 margin: '0px',
//                 mt: 0,
//                 transition: 'filter 0.5s ease-in-out',
//                 filter: 'none',
//               }}
//             >
//               <Box
//                 sx={{
//                   position: 'relative',
//                   width: '100%',
//                   height: { xs: '600px', md: '100%' }, // Altura fija para XS y altura automática para MD y superiores
//                   minHeight: { xs: '600px' }, // Altura mínima para XS
//                   borderRadius: { xs: 0, md: '0px 0px 0px 0px' },
//                   transition: 'transform 0.5s ease-in-out, border-radius 0.3s ease-in-out',
//                   zIndex: 1, // Asegura que el elemento tenga un zIndex base
//                   transform: 'scale(1)',
//                   animation: `fadeIn 1s ease-out ${index * 0.5}s both`,
//                   '&:hover': {
//                     borderRadius: '0px 0px 50px 50px',
//                     transform: 'scale(1.06)',
//                     zIndex: 10,
//                   },
//                   '&:hover::before': {
//                     content: '""',
//                     position: 'absolute',
//                     top: 0,
//                     left: 0,
//                     width: '100%',
//                     height: '100%',
//                     backgroundColor: 'rgba(255, 255, 255, 0.05)', // Establece el fondo transparente deseado
//                     zIndex: 2, // Asegura que el blur esté encima
//                     transition: 'filter 0.3s ease-in-out',
//                   },
//                   '&:hover .title': {
//                     fontSize: '2.8rem', // Tamaño de fuente más grande al hacer hover
//                     color: 'white'
//                   },
//                   '&:hover .divider': {
//                     width: '50%', // Ancho del divider al hacer hover
//                   },
//                 }}
//               >
//                 <img
//                   src={images[section.id]}
//                   alt={section.title}
//                   style={{
//                     width: '100%',
//                     height: '100%',
//                     objectFit: 'cover',
//                     borderRadius: { xs: 0, md: '0px 0px 100px 100px' },
//                     maxWidth: '100%',
//                     maxHeight: '100%',
//                   }}
//                   onClick={() => handleSectionClick(section.id)}
//                 />
//                 <Box
//                   sx={{
//                     position: 'absolute',
//                     bottom: 0,
//                     left: 0,
//                     width: '100%',
//                     background: 'linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent)',
//                     color: '#fff',
//                     borderRadius: { xs: 0, md: '0px 0px 0px 0px' },
//                     transition: 'transform 0.3s ease-in-out, border-radius 0.3s ease-in-out',
//                     zIndex: 3,
//                     '&:hover': {
//                       borderRadius: '0px 0px 50px 50px',
//                     },
//                   }}
//                 >
//                   <Typography className="title" variant="h1" color="primary.main" sx={{ marginBottom: '3px', textAlign: 'center', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)' }} >
//                     {section.title}
//                   </Typography>
//                   <Divider className="divider" sx={{ my: 2, borderColor: theme.palette.primary.main, width: '20%', height: '2px', borderBottomWidth: '3px', borderRadius: '10px', margin: 'auto' }} />
//                   <Typography variant="h4" color="primary.light" sx={{ textAlign: 'center', mt: 2 }}>
//                     {section.description}
//                   </Typography>
//                   <Box mt={2} sx={{ display: 'flex', justifyContent: 'center', mb: 7, }}>
//                     <Button
//                       variant="contained"
//                       color="primary"
//                       component={RouterLink}
//                       to={`/${section.id}`}
//                       sx={{ marginRight: '10px' }}
//                     >
//                       {section.id === 'SobreMi' ? 'Leer' : 'Galería'}
//                     </Button>
//                     {(section.id !== 'SobreMi' && section.id !== 'panelAdministrador') && (
//                       renderPanelButton(section.id)
//                     )}
//                   </Box>
//                 </Box>
//               </Box>
//             </Grid>
//           )
//         ))}
//       </Grid>
//       <style>
//         {`
//     @keyframes fadeIn {
//       from {
//         opacity: 0;
//       }
//       to {
//         opacity: 1;
//       }
//     }
//   `}
//       </style>
//     </div >
//   );
// };
