import * as React from 'react'
import { Box, Button, Divider, Grid, Link, Tooltip, Typography, useTheme, } from '@mui/material'
import { formatData } from '../../utils/formatDetail';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { sendParameterP } from '../../../redux/paisaje/actionsP/fetchAllLands';
import { copingFilters, isFromBird, isOneLand, isSaltar, saveFilters } from '../../../redux/paisaje/slicesP/LandscapeSlice';
import { saveFilters as saveAvesFilters } from '../../../redux/birds/slices/FilterSlice';
import { copingFilters as copingFiltersAves } from '../../../redux/birds/slices/FilterSlice';

export const HeaderAves = ({ imageUrl, bird, back }) => {
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
      dispatch(copingFiltersAves())
      dispatch(saveFilters(filtersPayload));
      dispatch(copingFilters());
      dispatch(isSaltar(true));
      dispatch(isFromBird(true))
      dispatch(isOneLand(resultLength === 1));
      navigate('/paisajes');
    } catch (error) {
      console.error('Error al registrar visita', error);
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
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        boxShadow: '0 20px 60px rgba(0,0,0,.45)',
        minHeight:'76vh'
        // backgroundColor: '#3A5A40',
        
      }}
    >
      {/* IMAGEN */}
      <Box
        sx={{
          flex: { xs: 'none', md: '0 0 75%' },
          height: { xs: 320, md: 'auto' },
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* INFO */}
      <Box
        sx={{
          flex: 1,
          p: { xs: 3, md: 5 },
          background: 'rgba(58, 90, 64, 0.88), 0.92)',
          backdropFilter: 'blur(12px)',
          color: 'white',
        }}
      >
        {bird.map((data, i) => (
          <Box key={i}>
            <Typography variant="h4" color="primary.light">
              {data.familia?.nombre} / {data.grupo?.nombre}
            </Typography>

            <Typography variant="overline" sx={{ opacity: .7 }}>
              Nombre en inglés
            </Typography>

            <Typography variant="h1" color="primary" sx={{ mb: 2 }}>
              {data.nombre_ingles}
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
              <Button size="small" variant="outlined" href={data.url_wiki} target="_blank">
                Wiki
              </Button>
              <Button size="small" variant="outlined" href={data.url_bird} target="_blank">
                eBird
              </Button>
            </Box>

            <Typography variant="subtitle1">Nombre científico</Typography>
            <Typography sx={{ fontStyle: 'italic', mb: 2 }}>
              {data.nombre_cientifico}
            </Typography>

            <Typography variant="subtitle1">Nombre común</Typography>
            <Typography sx={{ mb: 2 }}>
              {data.nombre_comun}
            </Typography>

            <Typography variant="subtitle1">País</Typography>
            {data.paises?.map((p, i) => (
              <Link
                key={i}
                onClick={e => handleClick(e, 'pais', p.nombre)}
                sx={{ display: 'inline-block', mr: 1, cursor: 'pointer' }}
              >
                {p.nombre}
              </Link>
            ))}

            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              Zonas
            </Typography>
            {data.zonasAves?.map((z, i) => (
              <Link
                key={i}
                onClick={e => handleClick(e, 'zona', z.nombre)}
                sx={{ display: 'inline-block', mr: 1, cursor: 'pointer' }}
              >
                {z.nombre}
              </Link>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  )
}