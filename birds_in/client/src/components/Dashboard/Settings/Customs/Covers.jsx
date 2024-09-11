import { Divider, Grid, Typography, useTheme } from '@mui/material'
import * as React from 'react'
import { SectionCovers } from '../../../utils/SectionCovers'
import { General } from './General'

export const Covers = () => {
    const theme = useTheme()
    return (
        <React.Fragment>
            <Grid container spacing={5} sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 'auto',
                margin: '0 auto',
                backgroundColor: 'rgba(0, 56, 28, 0.1)', // Establece el fondo transparente deseado
                backdropFilter: 'blur(2px)', // Efecto de desenfoque de fondo
                padding: '0px 40px 30px 0px',
                borderRadius: '0px 0px 20px 20px',
                mb: 10

            }} >
                <Grid item xs={12} sm={12}>
                    <Typography variant='h2' color='primary.light' sx={{ mb: 1 }} >
                        Pestañas Menu Principal
                        <Divider sx={{ my: 1, borderColor: theme.palette.primary.main, }} />
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={6} sm={3}>
                            <SectionCovers title="Portada Aves" coverKey="cover_birds" />
                            <SectionCovers title="Portada Insectos" coverKey="cover_insect" />

                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <SectionCovers title="Portada Mamiferos" coverKey="cover_animals" />
                            <SectionCovers title="Portada Peces" coverKey="cover_fish" />
                        </Grid>
                        <Grid item xs={6} sm={3}>
                        <SectionCovers title="Portada Reptiles" coverKey="cover_reptile" />
                            <SectionCovers title="Portada Paisajes" coverKey="cover_land" />
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <SectionCovers title="Portada Sobre Mí" coverKey="cover_about" />
                        </Grid>
                    </Grid>
                </Grid>
                <General />
            </Grid>
        </React.Fragment>
    )
}
