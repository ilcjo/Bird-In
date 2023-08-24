import { Grid } from '@mui/material'
import * as React from 'react'
import { Header } from '../../components/Header'
import { Menu } from '../../components/Menus/Menu'
import { Cards } from '../../components/Cards/Cards'
import { useDispatch, useSelector } from 'react-redux'
import { getInfoBirds } from '../../redux/actions/fetchAllBirds'

export const Aves = () => {
  const birds = useSelector(state => state.birdSlice.infoBirds)
  console.log('esto es info',birds)
  const dispatch = useDispatch()
  React.useEffect(() => {
    dispatch(getInfoBirds())
  }, [dispatch])

  return (
    <React.Fragment>
      <Header />
      <Grid container sx={{ padding: '40px' }} >
        <Menu />
        {birds.map((i, index) => (
          <Cards key={index} foto={i.imagenes_ave} name={i.nombre_cientifico} />
        )
        )}
      </Grid>
    </React.Fragment>
  )
}

