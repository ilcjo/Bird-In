import * as React from 'react'
import { Box, Button, Divider, Grid, Tooltip, Typography, useTheme, } from '@mui/material'
import { formatData } from '../../utils/formatDetail';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { sendParameterP } from '../../../redux/paisaje/actionsP/fetchAllLands';
import { copingFilters, isOneLand, isSaltar, isSFromRept, saveFilters } from '../../../redux/paisaje/slicesP/LandscapeSlice';
import { copingFilters as copingFilterRept } from '../../../redux/reptiles/slices/FilterSlice';

export const HeaderR = ({ imageUrl, registro, back }) => {
  const { paises = [], zonas = [] } = useSelector(state => state.landscapeSlice.optionsP)
  const theme = useTheme()
  const navigate = useNavigate();
  const dispatch = useDispatch()

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
      dispatch(copingFilterRept())
      dispatch(saveFilters(filtersPayload));
      dispatch(copingFilters());
      dispatch(isSaltar(true));
      dispatch(isSFromRept(true))
      dispatch(isOneLand(resultLength === 1));
      navigate('/paisajes');
    } catch (error) {
      console.error('Error al registrar visita', error);
    }
  };
  // console.log('q',registro)
 
    return (
    <Box
      sx={{
        maxWidth: '1450px',
        mx: 'auto',
        width: '100%',
        borderRadius: '28px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        boxShadow: '0 20px 60px rgba(0,0,0,.45)',
        minHeight: '76vh',
      }}
    >
      {/* Imagen */}
      <Box
        sx={{
          flex: { xs: 'none', md: '0 0 75%' },
          height: { xs: 320, md: 'auto' },
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Contenido */}
      <Box
        sx={{
          flex: 1,
          p: { xs: 3, md: 5 },
          background: 'rgba(16, 51, 0, 0.9)',
          backdropFilter: 'blur(12px)',
          color: 'white',
        }}
      >
        {registro?.map(data => (
          <Box key={data.id || data.nombre_cientifico}>
            <Typography variant="h4" color="primary.light">
              {data.familias_reptile?.nombre || 'N/A'} /{' '}
              {data.grupos_reptile?.nombre || 'N/A'}
            </Typography>

            <Typography variant="overline" sx={{ opacity: 0.7 }}>
              Nombre en inglés
            </Typography>

            <Typography variant="h1" color="primary" sx={{ mb: 2 }}>
              {data.nombre_ingles || 'N/A'}
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
              {data.url_wiki && (
                <Button
                  size="small"
                  variant="outlined"
                  href={data.url_wiki}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Wiki
                </Button>
              )}
            </Box>

            <Typography variant="subtitle1">Nombre científico</Typography>
            <Typography sx={{ mb: 2, fontStyle: 'italic' }}>
              {data.nombre_cientifico || 'N/A'}
            </Typography>

            <Typography variant="subtitle1">Nombre común</Typography>
            <Typography sx={{ mb: 2 }}>
              {data.nombre_comun || 'N/A'}
            </Typography>

            <Typography variant="subtitle1">País</Typography>
            {data.paises?.length ? (
              data.paises.map((p, i) => (
                <Link
                  key={i}
                  onClick={e => handleClick(e, 'pais', p.nombre)}
                  sx={{
                    display: 'inline-block',
                    mr: 1,
                    cursor: 'pointer',
                    color: theme.palette.primary.main,
                  }}
                >
                  {p.nombre}
                </Link>
              ))
            ) : (
              <Typography sx={{ opacity: 0.6 }}>N/A</Typography>
            )}

            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              Zonas
            </Typography>
            {data.zonasReptiles?.length ? (
              data.zonasReptiles.map((z, i) => (
                <Link
                  key={i}
                  onClick={e => handleClick(e, 'zona', z.nombre)}
                  sx={{
                    display: 'inline-block',
                    mr: 1,
                    cursor: 'pointer',
                    color: theme.palette.primary.main,
                  }}
                >
                  {z.nombre}
                </Link>
              ))
            ) : (
              <Typography sx={{ opacity: 0.6 }}>N/A</Typography>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  )
}