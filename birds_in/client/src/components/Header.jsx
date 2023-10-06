import React from 'react'
import { Box, Grid, } from '@mui/material'
import { MenuBar } from './Menus/MenuBar';
import { useSelector } from 'react-redux';



export const Header = () => {
  const { allCustom } = useSelector(state => state.customizesSlice)

  return (

    <Grid container component={Box} sx={{
      height: '15vh',
      width: '100%',
      position: 'relative',
      backgroundColor: 'rgba(255, 255, 255, 0)', // Fondo semitransparente para mejorar la legibilidad
    }}>

      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(rgba(137, 138, 108, 0), rgba(0, 61, 21, 100))',
          opacity: 0.9,
        }}
      />
      <img
        src={allCustom.header}
        alt="Ave"
        style={{ width: '100vw', height: '100%', objectFit: 'cover' }}
      />
        < MenuBar ShowFilterButton={false} ShowBackButton={true} />

    
      <Grid item xs={12} // Controla el ancho de la columna derecha
        sx={{
          position: 'absolute',
          top: '80%',
          right: '15%', // Ajusta la posición derecha
          transform: 'translate(50%, -50%)',
        }}
      >
      </Grid>
    </Grid>
  )
};