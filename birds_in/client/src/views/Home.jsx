import { Grid, Link, Typography } from '@mui/material'
import React from 'react'
import { Link as RouterLink } from 'react-router-dom'

export const Home = () => {
  return (
    <React.Fragment>
      <Grid container component="main" sx={{ height: '100vh', backgroundColor: 'primary.dark' }} >

        <Grid item xs={false} sm={4} md={3} style={{ position: 'relative' }}>
          <Link component={RouterLink} to="/aves">
            <img
              src="https://source.unsplash.com/random?bird"
              alt="Ave"
              style={{ width: '100%', height: '100%', objectFit: 'cover', padding: '0px 9px 0px 9px' }}
            />
            <Typography variant='h1' color="primary.light" style={{ position: 'absolute', bottom: 80, left: 0, padding: '10px', textAlign: 'center', width: '100%' }}>
              Aves
            </Typography>
            <Typography variant='body1' color="primary.light" style={{ position: 'absolute', bottom: 50, left: 0, padding: '10px', textAlign: 'center', width: '100%' }}>
              Galerias de imagenes
            </Typography>
          </Link>
        </Grid>
        <Grid item xs={false} sm={4} md={3} style={{ position: 'relative' }}>
          <Link component={RouterLink} to='/animales'>
            <img
              src="https://source.unsplash.com/random?animal"
              alt="Ave"
              style={{ width: '100%', height: '100%', objectFit: 'cover', padding: '0px 9px 0px 0px' }}
            />
            <Typography variant='h1' color="primary.light" style={{ position: 'absolute', bottom: 80, left: 0, padding: '10px', textAlign: 'center', width: '100%' }}>
              Animales
            </Typography>
            <Typography variant='body1' color="primary.light" style={{ position: 'absolute', bottom: 50, left: 0, padding: '10px', textAlign: 'center', width: '100%' }}>
              Galerias de imagenes
            </Typography>
          </Link>
        </Grid>
        <Grid item xs={false} sm={4} md={3} style={{ position: 'relative' }}>
          <Link component={RouterLink} to='/flores'>
            <img
              src="https://source.unsplash.com/random?flower"
              alt="Ave"
              style={{ width: '100%', height: '100%', objectFit: 'cover', padding: '0px 0px 0px 0px' }}
            />
            <Typography variant='h1' color="primary.light" style={{ position: 'absolute', bottom: 80, left: 0, padding: '10px', textAlign: 'center', width: '100%' }}>
              Flora
            </Typography>
            <Typography variant='body1' color="primary.light" style={{ position: 'absolute', bottom: 50, left: 0, padding: '10px', textAlign: 'center', width: '100%' }}>
              Galerias de imagenes
            </Typography>
          </Link>
        </Grid>
        <Grid item xs={false} sm={4} md={3} style={{ position: 'relative' }} >
          <Link component={RouterLink} to='/paisajes'>
            <img
              src="https://source.unsplash.com/random?landscape"
              alt="Ave"
              style={{ width: '100%', height: '100%', objectFit: 'cover', padding: '0px 9px 0px 9px' }}
            />
            <Typography variant='h1' color="primary.light" style={{ position: 'absolute', bottom: 80, left: 0, padding: '10px', textAlign: 'center', width: '100%' }}>
              Paisajes
            </Typography>
            <Typography variant='body1' color="primary.light" style={{ position: 'absolute', bottom: 50, left: 0, padding: '10px', textAlign: 'center', width: '100%' }}>
              Galerias de imagenes
            </Typography>
          </Link>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}
