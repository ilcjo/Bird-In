import * as React from 'react'
import { Box, Divider, Typography, useTheme, } from '@mui/material'
import { useSelector } from 'react-redux';
import { formatData } from './utils/formatFuntion';

export const Header = ({ imageUrl, bird }) => {
  const theme = useTheme()
  console.log(bird)

  return (
    <Box
      component="div"
      sx={{
        position: 'relative',
        width: '100%',
        height: '80vh',
        display: 'flex',
      }}
    >
      <Box
        component="div"
        sx={{
          width: '70%',
          height: '100%',
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          boxShadow: 3,
        }}
      />
      <Box
        component="div"
        sx={{
          width: '30%',
          height: '100%',
          backgroundColor: 'rgba(16, 51, 0, 0.9)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          padding: 5,
        }}
      >
        {bird.map((data, index) => (
          <React.Fragment key={index}>
            <Box sx={{ ml: 0 }} >
              <Typography variant="h4" color='primary.light' sx={{ mb: 0 }}>
                Nombre en Inglés:
              </Typography>
              <Typography variant='h1' color='primary'sx={{ mb: 4 }}>
                {data.nombre_ingles || 'N/A'}
              </Typography>
              <Divider sx={{ my: 2, borderColor: theme.palette.primary.main, width: '20%', height: '2px', borderBottomWidth: '3px', borderRadius: '10px', }} />
              <Typography variant="h4" color='primary.light' sx={{ mb: 0.5 }} >
                Nombre Científico:
              </Typography>
              <Typography variant='h6' color='primary.light' sx={{ mb: 1 }}>
                {data.nombre_cientifico || 'N/A'}
              </Typography>
              <Typography variant="h4" color='primary.light' sx={{ mb: 0.5 }}>
                Nombre Común:
              </Typography>
              <Typography variant='h6' color='primary.light' sx={{ mb: 1 }}>
                {data.nombre_comun || 'N/A'}
              </Typography>
              <Typography variant="h4" color='primary.light' sx={{ mb: 0.5 }}>
                País:
              </Typography>
              <Typography variant='h6' color='primary.light' sx={{ mb: 1 }}>
                {formatData(data.paises) || 'N/A'}
              </Typography>
            </Box>
          </React.Fragment>
        ))}
      </Box>
    </Box>
  )
};