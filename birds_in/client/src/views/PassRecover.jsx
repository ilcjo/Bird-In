import * as React from 'react'
import { Grid } from '@mui/material'
import { useSelector } from 'react-redux'
import { LazyLoad } from '../components/utils/LazyLoad'
import { Recover } from '../components/utils/Recover'

export const PassRecover = () => {
  const { allCustom } = useSelector(state => state.customizesSlice)
  return (
    <React.Fragment>
      <LazyLoad imageUrl={allCustom.cover_login} >
        <Grid container component="main"
          sx={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <Recover />
        </Grid>
      </LazyLoad>
    </React.Fragment>
  )
};
