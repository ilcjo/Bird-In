import * as React from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button, Divider, Grid, Tooltip, Typography, useTheme, } from '@mui/material'
import { formatData } from '../../utils/formatDetail';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { sendParameterP } from '../../../redux/paisaje/actionsP/fetchAllLands';
import { copingFilters, isFromMam, isOneLand, isSaltar, saveFilters } from '../../../redux/paisaje/slicesP/LandscapeSlice';
import { copingFilters as copingFiltersMam } from '../../../redux/mamiferos/slices/FilterSlice';

export const Header = ({ imageUrl, registro, back }) => {
  const { paises = [], zonas = [] } = useSelector(state => state.landscapeSlice.optionsP)
  const theme = useTheme()
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClick = async (e, tipo, nombre) => {
    e.preventDefault();

    const optionList = tipo === 'pais' ? paises : zonas;
    const selectedItem = optionList.find(item => item.nombre === nombre);

    if (!selectedItem) {
      console.warn('No se encontró el item en las opciones');
      return;
    }

    const selectedOption = tipo === 'pais'
      ? { pais: [selectedItem] }
      : { zona: [selectedItem] };

    try {
      const resultLength = await dispatch(sendParameterP(selectedOption));

      // Armar el payload para saveFilters
      const filtersPayload = {
        pais: tipo === 'pais' ? [selectedItem] : [],
        zona: tipo === 'zona' ? [selectedItem] : [],
      };

      dispatch(copingFiltersMam());
      dispatch(saveFilters(filtersPayload));
      dispatch(copingFilters());
      dispatch(isSaltar(true));
      dispatch(isFromMam(true))
      dispatch(isOneLand(resultLength === 1));
      navigate('/paisajes');
    } catch (error) {
      console.error('Error al registrar visita', error);
    }
  };
  // console.log('q',registro)
  return (
    <Box
      component="div"
      // sx={{
      //   position: 'relative',
      //   width: '100%',
      //   minHeight:'800px',
      //   height: { xs: 'auto', md: '90vh' },
      //   display: 'flex',
      //   flexDirection: { xs: 'column', md: 'row' },
      //   background: '#86ac8e'
      // }}
      sx={{
        position: 'relative',
        width: '100%',
        height: { xs: 'auto', md: '90vh' },
        overflow: 'hidden',
        borderRadius: '0px',
        background: '#86ac8e',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        background: '#86ac8e'
      }}
    >
      <Box
        component="div"
        sx={{
          width: { xs: '100%', md: '75%', lg: '75%' },
          height: { xs: '500px', md: '100%' },
          minWidth: '500px',
          backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
          backgroundColor: imageUrl ? 'transparent' : theme.palette.grey[300],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          boxShadow: 3,
          borderRadius: '0px 0px 0px 0px',
          pointerEvents: 'none'
        }}
      />
      <Box
        component="div"
        sx={{
          width: { xs: 'auto', md: '25%' },
          height: { xs: 'auto', md: 'auto' },
          backgroundColor: 'rgba(16, 51, 0, 0.9)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          padding: 5,
          borderRadius: '0px 0px 0px 0px',
        }}
      >
        {registro.map((data, index) => (
          <React.Fragment key={index}>
            <Grid container spacing={1} sx={{ mt: { xs: 0, md: 4 }, }}>
              {/* <Grid item xs={12}>
                <Typography variant='h5' color='white' sx={{ mb: 1, mt: -2 }}>
                  ORDEN {data.order_mamifero?.nombre || 'N/A'} - {data.order_mamifero?.nombre_comun || 'N/A'}
                </Typography>
              </Grid> */}
              <Grid item xs={12}>
                <Typography variant='h4' color='primary.light' sx={{ mb: 1, mt: -2 }}>
                  {data.familias_mamifero?.nombre || 'N/A'} / {data.grupos_mamifero?.nombre || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} >
                <Typography variant="h5" color='white' >
                  NOMBRE EN INGLÉS
                </Typography>
                <Typography variant='h1' color='primary' >
                  {data.nombre_ingles || 'N/A'}
                </Typography>
                {/* <Divider sx={{ my: 2, borderColor: theme.palette.primary.main, width: '30%', height: '2px', borderBottomWidth: '3px', borderRadius: '10px', }} /> */}
                <Button
                  sx={{
                    mt: 1.5,
                    fontSize: '0.8rem',
                    alignSelf: 'center',
                    textTransform: 'none',
                    padding: '1px 1px',
                  }}
                  variant="outlined"
                  href={data.url_wiki}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Wiki
                </Button>
              </Grid>
              {/* <Box sx={{
              // backgroundColor: 'rgba(16, 51, 0, 0.5)',
              // backdropFilter: 'blur(10px)',
              p: 2,
              borderRadius: '10px',
            }} > */}
              {/* <Grid container spacing={1}> */}
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="h5" color='white' sx={{ mb: 1 }} >
                  NOMBRE CIENTÍFICO
                  <Typography variant='body1' color='primary.light' sx={{ mb: 0.5, fontStyle: 'italic'  }}>
                    {data.nombre_cientifico || 'N/A'}
                  </Typography>
                </Typography>
                <Typography variant="h5" color='white' sx={{ mb: 0 }}>
                  NOMBRE COMÚN
                  <Typography variant='body2' color='primary.light'>
                    {data.nombre_comun || 'N/A'}
                  </Typography>
                </Typography>
              </Grid>

              {/* <Grid item xs={12}>
                <Typography variant="h5" color='white' sx={{ mb: 1 }}>
                  PAÍS:
                  <Typography variant='body1' color='primary.light' sx={{ mb: 0 }}>
                    {formatData(data.paises) || 'N/A'}
                  </Typography>
                </Typography>
                <Typography variant="h5" color="white" sx={{ mb: 1 }}>
                  ZONAS:
                  <Typography variant="body1" color="primary.light" sx={{ mb: 0 }}>
                    {formatData(data.zonasMamiferos) || 'N/A'}
                  </Typography>
                </Typography>
              </Grid> */}
              <Grid item xs={12}>
                <Typography variant="h5" color="white" sx={{ mb: 1 }}>
                  PAÍS
                  <Box component="div" sx={{ display: 'inline', ml: 1 }}>
                    {data.paises?.length > 0 ? data.paises.map((pais, i) => {
                      const nombre = pais.nombre;
                      const esLink = paises.some(p => p.nombre === nombre);
                      const isLast = i === data.paises.length - 1;

                      return (
                        <React.Fragment key={i}>
                          {esLink ? (
                            <Tooltip title="Ver Galería" arrow>
                              <Link
                                onClick={(e) => handleClick(e, 'pais', nombre)}
                                // to={'/paisajes'}
                                style={{
                                  textDecoration: 'underline',
                                  color: theme.palette.primary.main,
                                  cursor: 'pointer',
                                }}
                                onMouseEnter={e => (e.target.style.color = theme.palette.primary.light)}
                                onMouseLeave={e => (e.target.style.color =  theme.palette.primary.main)}
                              >
                                {nombre}
                              </Link>
                            </Tooltip>
                          ) : (
                            <Typography component="span" sx={{ display: 'inline', color: 'primary.light' }}>
                              {nombre}
                            </Typography>
                          )}
                          {!isLast && ' , '}
                        </React.Fragment>
                      );
                    }) : (
                      <Typography variant="body1" color="primary.light">N/A</Typography>
                    )}
                  </Box>
                </Typography>

                <Typography variant="h5" color="white" sx={{ mb: 1 }}>
                  ZONAS
                  <Box component="div" sx={{ display: 'inline', ml: 1 }}>
                    {data.zonasMamiferos?.length > 0 ? data.zonasMamiferos.map((zona, i) => {
                      const nombre = zona.nombre;
                      const esLink = zonas.some(z => z.nombre === nombre);
                      const isLast = i === data.zonasMamiferos.length - 1;

                      return (
                        <React.Fragment key={i}>
                          {esLink ? (
                            <Tooltip title="Ver Galería" arrow>
                              <Link
                                onClick={(e) => handleClick(e, 'zona', nombre)}
                                // to={'/paisajes'}
                                style={{
                                  textDecoration: 'underline',
                                  color:  theme.palette.primary.main,
                                  cursor: 'pointer',
                                }}
                                onMouseEnter={e => (e.target.style.color = theme.palette.primary.light)}
                                onMouseLeave={e => (e.target.style.color =  theme.palette.primary.main)}
                              >
                                {nombre}
                              </Link>
                            </Tooltip>
                          ) : (
                            <Typography component="span" sx={{ display: 'inline', color: 'primary.light' }}>
                              {nombre}
                            </Typography>
                          )}
                          {!isLast && ', '}
                        </React.Fragment>
                      );
                    }) : (
                      <Typography variant="body1" color="primary.light">N/A</Typography>
                    )}
                  </Box>
                </Typography>

              </Grid>
            </Grid>
          </React.Fragment>
        ))}
        <Box
          sx={{
            position: 'absolute',
            bottom: { xs: 555, md: 0 },
            right: { xs: '0%', md: '100%' },
          }}
        >
          {/* <Button
            color='primary'
            variant="contained"
            onClick={back}
            startIcon={<ArrowBackIcon />}
            sx={{ borderRadius: '0px 0px 10px 0px' }}
          >
            Regresar
          </Button> */}
        </Box>
      </Box >
    </Box >
  )
};