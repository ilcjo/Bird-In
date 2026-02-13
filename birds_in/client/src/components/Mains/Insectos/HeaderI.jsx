import * as React from 'react'
import { Box, Button, Divider, Grid, Typography, useTheme, } from '@mui/material'
import { formatData } from '../../utils/formatDetail';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export const HeaderI = ({ imageUrl, registro, back }) => {
  const theme = useTheme()
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
        minHeight: '76vh'
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
        {registro.map((data, index) => (
          <Box key={index}>
              {/* <Grid item xs={12}>
                <Typography variant='h6' color='primary.light' sx={{ mb: 1, mt: -2 }}>
                  {data.familias_insecto.nombre || 'N/A'} / {data.grupos_insecto.nombre || 'N/A'}
                </Typography>
              </Grid> */}

                <Typography variant="overline" sx={{ opacity: .7 }}  >
                  Orden
                </Typography>
                <Typography variant='h1' color='primary' sx={{ mb: 2 }} >
                  {data.nombre_ingles || 'N/A'}
                </Typography>
                {/* <Divider sx={{ my: 2, borderColor: theme.palette.primary.main, width: '30%', height: '2px', borderBottomWidth: '3px', borderRadius: '10px', }} /> */}
                 <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                              <Button size="small" variant="outlined" href={data.url_wiki} target="_blank">
                                Wiki
                              </Button>
                            </Box>
              
              {/* <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="h5" color='white' sx={{ mb: 1 }} >
                  NOMBRE CIENTÍFICO
                  <Typography variant='body1' color='primary.light' sx={{ mb: 0.5, fontStyle: 'italic'  }}>
                    {data.nombre_cientifico || 'N/A'}
                  </Typography>
                </Typography>
                <Typography variant="h5" color='white' sx={{ mb: 0.5 }}>
                  NOMBRE COMÚN
                  <Typography variant='body2' color='primary.light'>
                    {data.nombre_comun || 'N/A'}
                  </Typography>
                </Typography>
              </Grid> */}

              {/* <Grid item xs={12}> */}
                {/* <Typography variant="h4" color='primary.light' sx={{ mb: 0.5 }}>
                  PAÍS
                  <Typography variant='h6' color='primary.light' sx={{ mb: 1 }}>
                    {formatData(data.paises) || 'N/A'}
                  </Typography>
                </Typography>
                <Typography variant="h4" color="primary.light">
                  ZONAS
                  <Typography variant="h6" color="primary.light" sx={{ mb: 1.5 }}>
                    {formatData(data.zonasInsectos) || 'N/A'}
                  </Typography>
                </Typography> */}
              {/* </Grid> */}
          </Box>
        ))}
        {/* <Box
          sx={{
            position: 'absolute',
            bottom: { xs: 555, md: 0 },
            right: { xs: '0%', md: '100%' },
          }}
        > */}
          {/* <Button
            color='primary'
            variant="contained"
            onClick={back}
            startIcon={<ArrowBackIcon />}
            sx={{ borderRadius: '0px 0px 10px 0px' }}
          >
            Regresar
          </Button> */}
        {/* </Box> */}
      </Box>
    </Box >
  )
};