import * as React from 'react';
import { Box, Button, Divider, Grid, Typography, useTheme } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export const HeaderLand = ({ imageUrl, register, back }) => {
  const theme = useTheme();
  return (
    <Box
      component="div"
      sx={{
        width: '100%',
      }}
    >
      {/* Caja de la Imagen */}
      <Box
        component="div"
        sx={{
          width: '100%',
          height: '80vh', // Ajusta la altura según sea necesario
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          pointerEvents: 'none',
        }}
      />

      {/* Caja de Títulos y Botones debajo de la imagen */}
      <Box
        component="div"
        sx={{
          width: '100%',
          backgroundColor: 'rgba(16, 51, 0, 0.9)',
          backdropFilter: 'blur(10px)',
          padding: 2,
          zIndex: 2,
          borderRadius: '0px 0px 0px 0px',
        }}
      >
        {register.map((data, index) => (
          <React.Fragment key={index}>
            <Grid container spacing={1}>
              <Grid item xs={3.5}>
                <Typography variant="h4" color='primary.light'>
                  PAÍS:
                  <Typography variant='h1' color='primary' sx={{ mb: 0 }}>
                    {data.paise.nombre || 'N/A'}
                  </Typography>

                <Button
                  sx={{
                    mt: 1,
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
                    mt: 1,
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
                  </Typography>
              </Grid>

              <Grid item xs={7}>
                <Typography variant="h4" color='primary.light'>
                  ZONA:
                  <Typography variant='h1' color='primary'>
                    {data.zona.nombre || 'N/A'}
                  </Typography>
                </Typography>

              </Grid>
            </Grid>
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );
};
