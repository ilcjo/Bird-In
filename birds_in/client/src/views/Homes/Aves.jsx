import { Grid } from '@mui/material'
import React from 'react'
import { Header } from '../../components/Header'
import { Menu } from '../../components/Menus/Menu'
import { Cards } from '../../components/Cards/Cards'
import { useSelector } from 'react-redux'

export const Aves = () => {
  const birds = useSelector(state => state.birdSlice.images)
  return (
    <React.Fragment>
      <Header />
      <Grid container sx={{ padding: '40px' }} >
        <Menu />
        {birds.map((i, index) => (
          <Cards key={index} foto={i.url} name={i.name} />
        )      
      )}
      </Grid>
    </React.Fragment>
  )
}

