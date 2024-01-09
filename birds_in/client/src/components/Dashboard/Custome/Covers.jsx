import { Divider, Grid, Typography, useTheme } from '@mui/material'
import * as React from 'react'
import { SectionCovers } from '../SectionCovers'

export const Covers = () => {
    const theme = useTheme()
    return (
        <React.Fragment>
            <Grid container spacing={5} sx={{
                width: '80%',
                margin: 'auto',
                backgroundColor: 'rgba(0, 56, 28, 0.1)', // Establece el fondo transparente deseado
                backdropFilter: 'blur(2px)', // Efecto de desenfoque de fondo
                padding: '0px 40px 30px 0px',
                borderRadius: '0px 0px 20px 20px'
            }} >
                <Grid item xs={12} sm={12}>
                    <Typography variant='h5' color='primary.light' sx={{ mb: 3 }} >
                        Portadas Galerías
                        <Divider sx={{ my: 1 }} />
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={6} sm={3}>
                            <SectionCovers title="Portada Aves" coverKey="cover_birds" />
                            <SectionCovers title="Portada Animales" coverKey="cover_animals" />
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <SectionCovers title="Portada Peces" coverKey="cover_fish" />
                            <SectionCovers title="Portada Flores" coverKey="cover_flowers" />
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <SectionCovers title="Portada Paisajes" coverKey="cover_land" />
                            <SectionCovers title="Portada Sobre Mí" coverKey="cover_about" />
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <SectionCovers title="Portada Admin" coverKey="covert_admin" />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </React.Fragment>
    )
}
