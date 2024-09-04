import * as React from 'react'
import { Grid } from '@mui/material';
//components
import { ZonasEdit } from './ZonasEdit';
import { GruposEdit } from './GruposEdit';
import { FamiliasEdit } from './FamiliasEdit';

export const IndexClass = () => {

  return (
    <div>
      <Grid container spacing={5} sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '80%',
        minWidth: '170vh',
        margin: '0px 0px 0px 150px',
        backgroundColor: 'rgba(0, 56, 28, 0.1)', // Establece el fondo transparente deseado
        backdropFilter: 'blur(8px)', // Efecto de desenfoque de fondo
        padding: '0px 40px 60px 0px',
        borderRadius: '0px 0px 20px 20px'
      }} >
        <ZonasEdit />
        <FamiliasEdit />
        <GruposEdit />
      </Grid>

    </div>
  )
};


