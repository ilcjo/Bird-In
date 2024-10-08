import * as React from 'react'
import { Box, Button, Divider, Grid, Typography, useTheme, } from '@mui/material'
import { formatData } from '../../utils/formatDetail';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export const HeaderAves = ({ imageUrl, bird, back }) => {
  const theme = useTheme()
  return (
    <Box
      component="div"
      sx={{
        position: 'relative',
        width: '100%',
        height: { xs: 'auto', md: '90vh' },
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        background: '#86ac8e'

      }}
    >
      <Box
        component="div"
        sx={{
          width: { xs: '100%', md: '70%', lg: '70%' },
          height: { xs: '500px', md: '100%' },
          backgroundImage: `url(${imageUrl})`,
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
          width: { xs: 'auto', md: '30%' },
          height: { xs: 'auto', md: 'auto' },
          backgroundColor: 'rgba(16, 51, 0, 0.9)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          padding: 5,
          borderRadius: '0px 0px 10px 0px',
        }}
      >
        {bird.map((data, index) => (
          <React.Fragment key={index}>
            <Grid container spacing={1} sx={{ mt: { xs: 0, md: 4 }, }}>
              <Grid item xs={12}>
                <Typography variant='h6' color='primary.light' sx={{ mb: 1, mt: -2 }}>
                  {data.familia.nombre || 'N/A'} / {data.grupo.nombre || 'N/A'}
                </Typography>
              </Grid>

              <Grid item xs={12} >
                <Typography variant="h4" color='primary.light' >
                  Nombre en Inglés:
                  <Typography variant='h1' color='primary' >
                    {data.nombre_ingles || 'N/A'}
                  </Typography>
                  <Divider sx={{ my: 2, borderColor: theme.palette.primary.main, width: '30%', height: '2px', borderBottomWidth: '3px', borderRadius: '10px', }} />
                </Typography>
                <Button
                  sx={{
                    mt: -2,
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
                <Button
                  sx={{
                    mt: -2,
                    fontSize: '0.8rem',
                    ml: 2,
                    alignSelf: 'center',
                    textTransform: 'none',
                    padding: '1px 1px',
                  }}
                  variant="outlined"
                  href={data.url_bird}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  eBird
                </Button>

              </Grid>
              <Grid item xs={12}>

              </Grid>
            </Grid>
            <Box sx={{
              // backgroundColor: 'rgba(16, 51, 0, 0.5)',
              // backdropFilter: 'blur(10px)',
              p: 2,
              borderRadius: '10px',
            }} >
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography variant="h4" color='primary.light' sx={{ mb: 0.5 }} >
                    Nombre Científico:
                    <Typography variant='h6' color='primary.light' sx={{ mb: 1 }}>
                      {data.nombre_cientifico || 'N/A'}
                    </Typography>
                  </Typography>
                  <Typography variant="h4" color='primary.light' sx={{ mb: 0.5 }}>
                    Nombre Común:
                    <Typography variant='h6' color='primary.light'>
                      {data.nombre_comun || 'N/A'}
                    </Typography>
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h4" color='primary.light' sx={{ mb: 0.5 }}>
                    País:
                    <Typography variant='h6' color='primary.light' sx={{ mb: 1 }}>
                      {formatData(data.paises) || 'N/A'}
                    </Typography>
                  </Typography>
                  <Typography variant="h4" color="primary.light">
                    Zonas:
                    <Typography variant="h6" color="primary.light" sx={{ mb: 1.5 }}>
                      {formatData(data.zonasAves) || 'N/A'}
                    </Typography>
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </React.Fragment>
        ))}
        <Box
          sx={{
            position: 'absolute',
            bottom: { xs: 555, md: 0 },
            right: { xs: '0%', md: '0%' },
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
      </Box>
    </Box>
  )
};