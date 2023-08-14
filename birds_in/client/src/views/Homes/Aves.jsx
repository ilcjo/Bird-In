import { Grid } from '@mui/material'
import React from 'react'
import { Header } from '../../components/Header'
import { Container } from '../../components/Cards/Container'
import { Menu } from '../../components/Menus/Menu'

export const Aves = () => {
  return (
    <React.Fragment>
      <Header />
      <Grid container sx={{ padding: '40px'}} >
        <Menu />'
        <Container />
      </Grid>
    </React.Fragment>
  )
}

