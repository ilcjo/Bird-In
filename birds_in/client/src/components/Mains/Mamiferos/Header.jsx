import * as React from 'react'
import { Box, Button, Link, Typography, useTheme } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { sendParameterP } from '../../../redux/paisaje/actionsP/fetchAllLands'
import {
  copingFilters,
  isFromMam,
  isOneLand,
  isSaltar,
  saveFilters
} from '../../../redux/paisaje/slicesP/LandscapeSlice'
import { copingFilters as copingFiltersMam } from '../../../redux/mamiferos/slices/FilterSlice'

export const Header = ({ imageUrl, registro, back }) => {
  const { paises = [], zonas = [] } = useSelector(
    state => state.landscapeSlice.optionsP
  )

  const theme = useTheme()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleClick = async (e, tipo, nombre) => {
    e.preventDefault()

    const optionList = tipo === 'pais' ? paises : zonas
    const selectedItem = optionList.find(item => item.nombre === nombre)

    if (!selectedItem) return

    const selectedOption =
      tipo === 'pais'
        ? { pais: [selectedItem] }
        : { zona: [selectedItem] }

    try {
      const resultLength = await dispatch(sendParameterP(selectedOption))

      dispatch(copingFiltersMam())
      dispatch(
        saveFilters({
          pais: tipo === 'pais' ? [selectedItem] : [],
          zona: tipo === 'zona' ? [selectedItem] : [],
        })
      )
      dispatch(copingFilters())
      dispatch(isSaltar(true))
      dispatch(isFromMam(true))
      dispatch(isOneLand(resultLength === 1))

      navigate('/paisajes')
    } catch (error) {
      console.error(error)
    }
  }

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
          background: 'rgba(16, 51, 0, 0.9)',
          backdropFilter: 'blur(12px)',
          color: 'white',
        }}
      >
        {registro.map((data, i) => (
          <Box key={i}>
            <Typography variant="h4" color="primary.light">
              {data.familias_mamifero?.nombre} /{' '}
              {data.grupos_mamifero?.nombre}
            </Typography>

            <Typography variant="overline" sx={{ opacity: 0.7 }}>
              Nombre en inglés
            </Typography>

            <Typography variant="h1" color="primary" sx={{ mb: 2 }}>
              {data.nombre_ingles}
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
              <Button
                size="small"
                variant="outlined"
                href={data.url_wiki}
                target="_blank"
              >
                Wiki
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
                sx={{
                  display: 'inline-block',
                  mr: 1,
                  cursor: 'pointer',
                  color: theme.palette.primary.main,
                }}
              >
                {p.nombre}
              </Link>
            ))}

            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              Zonas
            </Typography>
            {data.zonasMamiferos?.map((z, i) => (
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
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  )
}
