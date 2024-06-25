import React from 'react'
import birdBUild from '../../assets/images/pablita-bird-1.gif'
import { Button, Grid, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

export const LandsCapes = () => {
  const navigate = useNavigate()
  const returnMenuClick = () => {
    navigate('/menu')
  };
  return (
    <div>
      <Grid container >
        <Grid item xs={12} md={6}>
          <Typography variant='h1' sx={{ mt: '30%', ml: 50, width: '50%' }}>
            Esta página se esta construyendo ....
            <br/>
            <Button variant="filled" color="primary" onClick={returnMenuClick}>
            <ArrowBackIcon /> Volver
          </Button>
          </Typography>
         
        </Grid>
        <Grid item xs={12} md={6}>
          <img src={birdBUild} alt='Página en construcción'>
          </img>
        </Grid>
      </Grid>
    </div>
  )

};
