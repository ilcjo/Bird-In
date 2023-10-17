import * as React from 'react'
import { Divider, Grid, Typography, useTheme } from '@mui/material'
import { SectionCovers } from '../SectionCovers'

export const General = () => {
    const theme = useTheme()
    return (
        <React.Fragment>
            <Grid container spacing={5} sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '80%',
                margin: 'auto',
                backgroundColor: theme.palette.secondary.light,
                padding: '0px 40px 30px 0px',
                borderRadius: '0px 0px 20px 20px'
            }} >
                <Grid item xs={6} sm={6}>

                    <Typography variant='h5' color='primary.light' sx={{ mb: 3 }} >
                        Cabecera
                        <Divider sx={{ my: 1 }} />
                    </Typography>
                    <SectionCovers title="Cabecera" coverKey="header" />
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
}
