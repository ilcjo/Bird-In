import * as React from 'react'
import { Cards } from './Cards/Cards'
import { Grid } from '@mui/material'
import { useSelector } from 'react-redux'

export const PhotosDetail = () => {
    const birds = useSelector(state => state.birdSlice.infoBirds)
    return (

        <Grid item container spacing={3} justifyContent="center">
            {birds.map((i, index) => (
                <Grid item key={index}>
                    <Cards foto={i.imagenes_aves} name={i.nombre_ingles} />
                </Grid>
            ))}
        </Grid>
    )
}
