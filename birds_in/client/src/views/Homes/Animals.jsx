import React from 'react'
import birdBUild from '../../assets/images/pablita-bird-1.gif'
import { Button, Grid, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

export const Animals = () => {
  const navigate = useNavigate()
  const returnMenuClick = () => {
    navigate('/menu')
  };
  return (
    <div>
      <Grid container >
        <Grid item xs={12} md={12} lg={12}>
          <img
            src={birdBUild}
            alt='Página en construcción'
            style={{ width: 'auto', height: '20%', marginTop: '5%', marginLeft: '30%' }}
          >
          </img>
          <Typography variant='h1' sx={{ mt: '5%', ml: '20%', width: '40%' }}>
            Esta página se esta construyendo ....
            <br />
            <Button variant="filled" color="primary" onClick={returnMenuClick}>
              <ArrowBackIcon /> Volver
            </Button>
          </Typography>

        </Grid>
      </Grid>
    </div>
  )
};
