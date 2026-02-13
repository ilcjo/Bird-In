import * as React from 'react';
import {
  Box,
  Button,
  Grid,
  Typography,
  useTheme,
  Stack,
  Paper,
  Tooltip
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Link, useNavigate } from 'react-router-dom';
import PetsIcon from '@mui/icons-material/Pets';
import EmojiNatureIcon from '@mui/icons-material/EmojiNature'; 
import WhatshotIcon from '@mui/icons-material/Whatshot'; 
import { saveFilters as saveReptilFilters } from '../../../redux/reptiles/slices/FilterSlice';
import { saveFilters as saveAvesFilters } from '../../../redux/birds/slices/FilterSlice';
import { saveFilters as saveMamiferosFilters } from '../../../redux/mamiferos/slices/FilterSlice';
import { sendParameter as sendParameterAves, sendParameterSalto } from '../../../redux/birds/actions/filterAction';
import { sendParameter as sendParameterReptiles, sendParameterSaltoRept } from '../../../redux/reptiles/actions/filterAction';
import { sendParameter as sendParameterMamiferos, sendParameterSaltoM } from '../../../redux/mamiferos/actions/filterAction';
import { copingFilters as copingFiltersAves } from '../../../redux/birds/slices/FilterSlice';
import { copingFilters as copingFiltersReptiles } from '../../../redux/reptiles/slices/FilterSlice';
import { copingFilters as copingFiltersMamiferos } from '../../../redux/mamiferos/slices/FilterSlice';
import { useDispatch, useSelector } from 'react-redux';
import { cargando, isOneBird, isSaltarBird } from '../../../redux/birds/slices/InfoSlice';
import { isOneR, isSaltarRept } from '../../../redux/reptiles/slices/InfoSlice';
import { isOneR as isOneMa, isSaltarMa } from '../../../redux/mamiferos/slices/InfoSlice';
import { copingFilters, isFromMam, isOneLand, saveFilters } from '../../../redux/paisaje/slicesP/LandscapeSlice';
import { sendParameterP } from '../../../redux/paisaje/actionsP/fetchAllLands';

export const HeaderLand = ({ imageUrl, register, back }) => {
  // console.log(register,'esto llego')
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const  {saltar } = useSelector(state => state.landscapeSlice)
  const infoBirds = useSelector(state => state.birdSlice.infoBirds);
  const infoMamiferos = useSelector(state => state.dataSlice.info);
  const infoRept = useSelector(state => state.dataReptil.info);
  
  const buildPayload = (tipo, selectOption) => {
    const base = {
      grupo: [],
      familia: [],
      pais: selectOption.pais || [],
      cientifico: [],
      ingles: [],
      zona: selectOption.zona || [],
    };
  
    // Agregar 'orden' solo para mamíferos o reptiles
    if (tipo === 'mamiferos' || tipo === 'reptiles') {
      return {
        ...base,
        orden: []
      };
    }
  
    return base;
  };
  

  React.useEffect(() => {
    const fetchFilteredData = async () => {
      if (!register || !register[0]) return;

      const pais = register[0]?.paise?.id_pais || '';
      const zona = register[0]?.zona?.id_zona || '';

      let selectOption = {};

    if (zona) {
      selectOption = { zona: [{ id: zona }] };
    } else if (pais) {
      selectOption = { pais: [{ id: pais }] };
    }
    console.log(selectOption);
      try {
        await Promise.all([
          dispatch(sendParameterSalto(selectOption)),
          dispatch(sendParameterSaltoM(selectOption)),
          dispatch(sendParameterSaltoRept(selectOption)),
          dispatch(isSaltarBird(false)),
          dispatch(isSaltarMa(false)),
          dispatch(isSaltarRept(false))
        ]);

      } catch (error) {
        console.error("Error during filtering:", error);
      // } finally {
       
      }
    };

    fetchFilteredData();
  }, [register]);

  const handleClickB = async (e, nombreSeleccionado) => {
    e.preventDefault();
  
    // Obtener los datos de pais y zona desde register
    const pais = register[0]?.paise?.id_pais || '';
    const zona = register[0]?.zona?.id_zona || '';
    
    if (!pais || !zona) {
      console.warn('Faltan datos de pais o zona');
      return;
    }
  
    // Obtener el nombre_ingles del elemento seleccionado (nombreSeleccionado)
    const selectedItem = infoBirds.find(item => item.nombre_ingles === nombreSeleccionado) 
         
    if (!selectedItem) {
      console.warn('Elemento no encontrado en las listas');
      return;
    }
  
    // Construir el payload
    const selectOption = {
      pais: [{ id: pais, nombre: register[0]?.paise?.nombre }],
      zona: [{ id: zona, nombre: register[0]?.zona?.nombre }],
      ingles: [{ nombre: selectedItem.nombre_ingles,}]
    };
  
    try {
      // Llamar a sendParameter con el selectOption adecuado
      dispatch(isSaltarBird(true));
      const resultLength = await dispatch(sendParameterAves(selectOption));
      dispatch(isOneBird(resultLength === 1));
  
      // Guardar el filtro utilizando saveFilters
      const filtersPayload = {
        pais: selectOption.pais,
        zona: selectOption.zona,
        ingles: selectOption.ingles,
        grupo:[],
        familia:[],
        cientifico:[]
      };
  
      dispatch(saveAvesFilters(filtersPayload));
      dispatch(copingFiltersAves());
      navigate('/aves');
    } catch (error) {
      console.error('Error durante la búsqueda o guardado de filtros:', error);
    }
  };
  
  const handleClickM = async (e, nombreSeleccionado) => {
    e.preventDefault();
  
    // Obtener los datos de pais y zona desde register
    const pais = register[0]?.paise?.id_pais || '';
    const zona = register[0]?.zona?.id_zona || '';
    
    if (!pais || !zona) {
      console.warn('Faltan datos de pais o zona');
      return;
    }
  
    // Obtener el nombre_ingles del elemento seleccionado (nombreSeleccionado)
    const selectedItem = 
                         infoMamiferos.find(item => item.nombre_ingles === nombreSeleccionado)
    
    if (!selectedItem) {
      console.warn('Elemento no encontrado en las listas');
      return;
    }
  
    // Construir el payload
    const selectOption = {
      pais: [{ id: pais, nombre: register[0]?.paise?.nombre }],
      zona: [{ id: zona, nombre: register[0]?.zona?.nombre }],
      ingles: [{ nombre: selectedItem.nombre_ingles,}]
    };
  
    try {
      // Llamar a sendParameter con el selectOption adecuado
      dispatch(isSaltarMa(true));
      const resultLength = await dispatch(sendParameterMamiferos(selectOption));
      dispatch(isOneMa(resultLength === 1));
  
      // Guardar el filtro utilizando saveFilters
      const filtersPayload = {
        pais: selectOption.pais,
        zona: selectOption.zona,
        ingles: selectOption.ingles,
        grupo:[],
        familia:[],
        cientifico:[],
        orden: []
      };
  
      dispatch(saveMamiferosFilters(filtersPayload));
      dispatch(copingFiltersMamiferos());
      navigate('/mamiferos');
    } catch (error) {
      console.error('Error durante la búsqueda o guardado de filtros:', error);
    }
  };
  
  const handleClickR = async (e, nombreSeleccionado) => {
    e.preventDefault();
  
    // Obtener los datos de pais y zona desde register
    const pais = register[0]?.paise?.id_pais || '';
    const zona = register[0]?.zona?.id_zona || '';
    
    if (!pais || !zona) {
      console.warn('Faltan datos de pais o zona');
      return;
    }
  
    // Obtener el nombre_ingles del elemento seleccionado (nombreSeleccionado)
    const selectedItem = 
                         infoRept.find(item => item.nombre_ingles === nombreSeleccionado)
    
    if (!selectedItem) {
      console.warn('Elemento no encontrado en las listas');
      return;
    }
  
    // Construir el payload
    const selectOption = {
      pais: [{ id: pais, nombre: register[0]?.paise?.nombre }],
      zona: [{ id: zona, nombre: register[0]?.zona?.nombre }],
      ingles: [{ nombre: selectedItem.nombre_ingles,}]
    };
  
    try {
      // Llamar a sendParameter con el selectOption adecuado
      dispatch(isSaltarRept(true));
      const resultLength = await dispatch(sendParameterReptiles(selectOption));
      dispatch(isOneR(resultLength === 1));
  
      // Guardar el filtro utilizando saveFilters
      const filtersPayload = {
        pais: selectOption.pais,
        zona: selectOption.zona,
        ingles: selectOption.ingles,
        grupo:[],
        familia:[],
        cientifico:[],
        orden: []
      };
      dispatch(saveReptilFilters(filtersPayload));
      dispatch(copingFiltersReptiles());
      navigate('/reptiles');
    } catch (error) {
      console.error('Error durante la búsqueda o guardado de filtros:', error);
    }
  };
  
return (
  <Box
  sx={{
    maxWidth: '1450px',
    mx: 'auto',
    width: '100%',
    borderRadius: '28px',
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(0,0,0,.45)',
  }}
>
  {/* HERO IMAGE */}
  <Box
    sx={{
      width: '100%',
      height: { xs: 320, md: 500 },
      backgroundImage: `url(${imageUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',

      '&::after': {
        content: '""',
        position: 'absolute',
        inset: 0,
        background:
          'linear-gradient(to bottom, rgba(0, 0, 0, 0.06), rgba(16, 51, 0, 0.3))',
      },
    }}
  />

  {/* PANEL INFO */}
  <Box
    sx={{
      width: '100%',
      background: 'rgba(16, 51, 0, 0.9)',
      backdropFilter: 'blur(12px)',
      p: { xs: 3, md: 2 },
      color: 'white',
    }}
  >
      {register.map((data, index) => (
        <Box key={index} maxWidth="1200px" mx="auto">

          {/* TITULOS PRINCIPALES */}
          <Grid container spacing={1} alignItems="flex-start">
            <Grid item xs={12} md={5}>
              <Typography variant="subtitle1" sx={{ opacity: 0.7 }}>
                País
              </Typography>
              <Typography
                variant="h1"
                color="primary"
                sx={{
                }}
              >
                {data.paise?.nombre || 'N/A'}
              </Typography>
            </Grid>

            <Grid item xs={12} md={5}>
              <Typography variant="subtitle1" sx={{ opacity: 0.7 }}>
                Zona
              </Typography>
              <Typography
                variant="h1"
                color="primary"
                sx={{
                 
                }}
              >
                {data.zona?.nombre || 'N/A'}
              </Typography>
            </Grid>

            <Grid item xs={12} md={2}>
              <Typography variant="subtitle1" sx={{ opacity: 0.7 }}>
                Info
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                }}
              >
                <Button
                size="small"
                  variant="outlined"
                  // sx={{ textTransform: 'none' }}
                  href={data.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Wiki
                </Button>

                <Button
                 size="small"
                  variant="outlined"
                  startIcon={<LocationOnIcon />}
                  // sx={{ textTransform: 'none' }}
                  href={data.map}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Maps
                </Button>
              </Box>
            </Grid>
          </Grid>

          {/* BIODIVERSIDAD */}
          <Box mt={0}>
            {(infoBirds?.length ||
              infoMamiferos?.length ||
              infoRept?.length) > 0 && (
              <Typography
                variant="h4"
                sx={{ mb: 3 }}
                color="primary.light"
              >
                Biodiversidad
              </Typography>
            )}

            {/* AVES */}
            {infoBirds?.length > 0 && (
              <>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Aves
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 2,
                    mb: 3,
                  }}
                >
                  {infoBirds.map((ave, index) => (
                    <Link
                      key={index}
                      to=""
                      onClick={(e) =>
                        handleClickB(e, ave.nombre_ingles, 'aves')
                      }
                      style={{
                        textDecoration: 'underline',
                        color: theme.palette.primary.main,
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.color =
                          theme.palette.primary.light)
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.color =
                          theme.palette.primary.main)
                      }
                    >
                      {ave.nombre_ingles}
                    </Link>
                  ))}
                </Box>
              </>
            )}

            {/* MAMIFEROS */}
            {infoMamiferos?.length > 0 && (
              <>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Mamíferos
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 2,
                    mb: 3,
                  }}
                >
                  {infoMamiferos.map((mamifero, index) => (
                    <Link
                      key={index}
                      to=""
                      onClick={(e) =>
                        handleClickM(e, mamifero.nombre_ingles)
                      }
                      style={{
                        textDecoration: 'underline',
                        color: theme.palette.primary.main,
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.color =
                          theme.palette.primary.light)
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.color =
                          theme.palette.primary.main)
                      }
                    >
                      {mamifero.nombre_ingles}
                    </Link>
                  ))}
                </Box>
              </>
            )}

            {/* REPTILES */}
            {infoRept?.length > 0 && (
              <>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Reptiles
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 2,
                  }}
                >
                  {infoRept.map((reptil, index) => (
                    <Link
                      key={index}
                      to=""
                      onClick={(e) =>
                        handleClickR(
                          e,
                          reptil.nombre_ingles,
                          'reptil'
                        )
                      }
                      style={{
                        textDecoration: 'underline',
                        color: theme.palette.primary.main,
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.color =
                          theme.palette.primary.light)
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.color =
                          theme.palette.primary.main)
                      }
                    >
                      {reptil.nombre_ingles}
                    </Link>
                  ))}
                </Box>
              </>
            )}
          </Box>
        </Box>
      ))}
    </Box>
  </Box>
);

};

// import * as React from 'react';
// import { Box, Button, Divider, Grid, Typography, useTheme } from '@mui/material';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// export const HeaderLand = ({ imageUrl, register, back }) => {
//   const theme = useTheme();
//   return (
//     <Box
//       component="div"
//       sx={{
//         width: '100%',
//       }}
//     >
//       {/* Caja de la Imagen */}
//       <Box
//         component="div"
//         sx={{
//           width: '100%',
//           height: '80vh', // Ajusta la altura según sea necesario
//           backgroundImage: `url(${imageUrl})`,
//           backgroundSize: 'cover',
//           backgroundPosition: 'center',
//           pointerEvents: 'none',
//         }}
//       />

//       {/* Caja de Títulos y Botones debajo de la imagen */}
//       <Box
//         component="div"
//         sx={{
//           width: '100%',
//           backgroundColor: 'rgba(16, 51, 0, 0.9)',
//           backdropFilter: 'blur(10px)',
//           padding: 2,
//           zIndex: 2,
//           borderRadius: '0px 0px 0px 0px',
//         }}
//       >
//         {register.map((data, index) => (
//           <React.Fragment key={index}>
//             <Grid container spacing={1}>
//               <Grid item xs={3}>
//                 <Typography variant="h4" color='white'>
//                   PAÍS:
                 

              
//                   </Typography>
//                   <Typography variant='h1' color='primary' sx={{ mb: 0 }}>
//                     {data.paise.nombre || 'N/A'}
//                   </Typography>
//               </Grid>

//               <Grid item xs={4}>
//                 <Typography variant="h4" color='white'>
//                   ZONA:
//                   <Typography variant='h1' color='primary'>
//                     {data.zona.nombre || 'N/A'}
//                   </Typography>
//                 </Typography>

//               </Grid>
//               <Grid item xs={4}>
//               <Button
//                   sx={{
//                     mt: 1,
//                     fontSize: '0.8rem',
//                     alignSelf: 'center',
//                     textTransform: 'none',
//                     padding: '1px 1px',
//                   }}
//                   variant="outlined"
//                   href={data.url}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   Wiki
//                 </Button>
              
//               </Grid>
//               <Grid>
//               <Button
//                   sx={{
//                     mt: 1,
//                     fontSize: '0.8rem',
//                     ml: 2,
//                     alignSelf: 'center',
//                     textTransform: 'none',
//                     padding: '1px 1px',
//                   }}
//                   variant="outlined"
//                   href={data.map}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   >
//                   Maps
//                 </Button>
//               </Grid>
            
//             </Grid>
//           </React.Fragment>
//         ))}
//       </Box>
//     </Box>
//   );
// };
