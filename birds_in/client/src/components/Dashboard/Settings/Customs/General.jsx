import * as React from 'react'
import { Divider, Grid, Typography, useTheme } from '@mui/material'
import { SectionCovers } from '../../../utils/SectionCovers'

export const General = () => {
    const theme = useTheme()
    return (
        <React.Fragment>
            <Grid item xs={12} sm={12}>
                <Typography variant='h2' color='primary.light' sx={{ mb: 3, mt: 2 }} >
                    Fondo de Galerías
                    <Divider sx={{ my: 1, borderColor: theme.palette.primary.main, }} />
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={6} sm={3}>
                        <SectionCovers title="Galería Aves" coverKey="background_aves" />
                        <SectionCovers title="Galería Peces" coverKey="background_fish" />

                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <SectionCovers title="Galería Mamiferos" coverKey="background_mamiferos" />
                        <SectionCovers title="Galería Paisajes" coverKey="background_paisaje" />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <SectionCovers title="Galería Reptiles" coverKey="background_reptile" />

                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <SectionCovers title="Galería Insectos" coverKey="background_insect" />
                    </Grid>
                </Grid>
                <Typography variant='h2' color='primary.light' sx={{ mb: 3, mt: 2 }} >
                    Fondos panel de Editar
                    <Divider sx={{ my: 1, borderColor: theme.palette.primary.main, }} />
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={6} sm={3}>
                        <SectionCovers title="Editar Aves" coverKey="background_update_ave" />
                        <SectionCovers title="Editar Insectos" coverKey="background_update_insect" />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <SectionCovers title="Editar Mamiferos" coverKey="background_update_mamifero" />
                        <SectionCovers title="Editar Peces" coverKey="background_update_fish" />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <SectionCovers title="Editar Reptiles" coverKey="background_update_reptil" />
                        <SectionCovers title="Editar Paisajes" coverKey="background_update_land" />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <SectionCovers title="Sobre Mí" coverKey="background_sobremi" />
                        <SectionCovers title="Mantenimiento" coverKey="background_mantenimiento" />
                    </Grid>
                </Grid>
                <Typography variant='h5' color='primary.light' sx={{ mb: 3, mt: 2 }} >
                    Logo
                    <Divider sx={{ my: 1, borderColor: theme.palette.primary.main, }} />
                </Typography>
            </Grid>
            <SectionCovers title="Logo" coverKey="logo" />
        </React.Fragment>
    )
};
