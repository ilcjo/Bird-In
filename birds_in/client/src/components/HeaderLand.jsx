import * as React from 'react';
import { Box, Button, Divider, Grid, Typography, useTheme } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export const HeaderLand = ({ imageUrl, register, back }) => {
  const theme = useTheme();
  return (
    <Box
      component="div"
      sx={{
        position: 'relative',
        width: '100%',
        height: '90vh', // Ajusta la altura según sea necesario
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          bottom: 10,
          right: 10,
        }}
      >
        <Button
          color='primary'
          variant="contained"
          onClick={back}
          startIcon={<ArrowBackIcon />}
          sx={{ borderRadius: '0px 0px 10px 0px', zIndex: 8, }}
        >
          Regresar
        </Button>
      </Box>
      <Box
        component="div"
        sx={{
          width: '100%',
          height: '100%',
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <Box
        component="div"
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: { xs: '40%', md: '30%' },
          height: { xs: '60%', md: '63%' },
          backgroundColor: 'rgba(0, 56, 28, 0.3)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          padding: 5,
          zIndex: 2,
          borderRadius: '0px 0px 20px 20px'
        }}
      >

        {register.map((data, index) => (
          <React.Fragment key={index}>
            <Grid container spacing={1} sx={{ mt: { xs: 0, md: 4 }, }}>
              <Grid item xs={12}>
                <Typography variant="h4" color='primary.light' >
                  País:
                  <Typography variant='h1' color='primary' sx={{ mb: 1 }}>
                    {data.paise.nombre || 'N/A'},
                  </Typography>
                  <Typography variant="h4" color='primary.light' >
                    Zona:
                    <Typography variant='h1' color='primary.light' >
                  {data.zona.nombre || 'N/A'}
                    </Typography>
                  </Typography>
                </Typography>
              </Grid>

              <Grid item xs={12} >

                <Divider sx={{ my: 2, borderColor: theme.palette.primary.main, width: '30%', height: '2px', borderBottomWidth: '3px', borderRadius: '10px', }} />
                <Button
                  sx={{
                    mt: -2,
                    fontSize: '0.8rem',
                    alignSelf: 'center',
                    textTransform: 'none',
                    padding: '1px 1px',
                  }}
                  variant="outlined"
                  href={data.url}
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
                  href={data.map}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Maps
                </Button>

              </Grid>
            </Grid>
          </React.Fragment>
        ))}


      </Box>
    </Box>
  );
};
