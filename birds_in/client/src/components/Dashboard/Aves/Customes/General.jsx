import * as React from 'react'
import { Divider, Grid, Typography, useTheme } from '@mui/material'
import { SectionCovers } from '../../../utils/SectionCovers'

export const General = () => {
    const theme = useTheme()
    return (
        <React.Fragment>
            <Grid container spacing={5} sx={{
                display: 'flex',
                alignItems: 'flex-start',  // Alinea al inicio del contenedor
                justifyContent: 'center',
                width: '80%',
                margin: 'auto',
                backgroundColor: 'rgba(0, 56, 28, 0.1)', // Establece el fondo transparente deseado
                backdropFilter: 'blur(2px)', // Efecto de desenfoque de fondo
                borderRadius: '0px 0px 20px 20px',
                flexDirection: 'row',  // Coloca los elementos en una fila
                flexWrap: 'wrap',       // Envolvimiento en caso de falta de espacio
                padding: '0px 40px 30px 0px',
            }} >
                <Grid item xs={6} sm={6}>
                    <Typography variant='h5' color='primary.light' sx={{ mb: 3 }} >
                        Panel de Administración
                        <Divider sx={{ my: 1 }} />
                    </Typography>
                    <SectionCovers title="Fondo detrás de Actualizar" coverKey="header" />
                    <Typography variant='h5' color='primary.light' sx={{ mb: 3, mt: 2 }} >
                        Fondo Filtro
                        <Divider sx={{ my: 1 }} />
                    </Typography>
                    <SectionCovers title="Fondo detrás del Menu" coverKey="background_aves" />
                </Grid>
                <Grid item xs={6} sm={6}>
                    <Typography variant='h5' color='primary.light' sx={{ mb: 3 }} >
                        Logo
                        <Divider sx={{ my: 1 }} />
                    </Typography>
                    <SectionCovers title="Logo" coverKey="logo" />
                </Grid>
            </Grid>
        </React.Fragment>
    )
};
