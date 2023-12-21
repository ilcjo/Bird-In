import * as React from 'react'
import { Grid } from '@mui/material'
import { LazyLoad } from '../components/utils/LazyLoad'
import { useSelector } from 'react-redux'
import { ForgoToken } from '../components/utils/ForgoToken'

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
        <ForgoToken/>
      </Grid>
      </LazyLoad>
    </React.Fragment>
  )
};
