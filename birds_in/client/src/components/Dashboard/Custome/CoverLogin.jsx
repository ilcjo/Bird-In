import * as React from 'react'
import { Divider, Grid, TextField, Typography, useTheme } from '@mui/material'
import { SectionCovers } from '../SectionCovers'
import { useSelector } from 'react-redux'

export const CoverLogin = () => {
    const theme = useTheme()
    const { allCustom } = useSelector(state => state.customizesSlice)
    const [textLogin, setTextLogin] = React.useState(allCustom.text_login || '');
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
                        Portada Inicio de sesión
                        <Divider sx={{ my: 1 }} />
                    </Typography>
                    <SectionCovers title="" coverKey="cover_login" />

                </Grid>
                <Grid item xs={6} sm={6}>
                    <Typography variant='h5' color='primary.light' sx={{ mb: 3 }} >
                        Info foto portada Inicio de sesión
                        <Divider sx={{ my: 1 }} />
                    </Typography>
                    <TextField
                        value={textLogin}
                        onChange={(e) => setTextLogin(e.target.value)}
                        multiline
                        rows={2}
                        fullWidth
                    />
                </Grid>
            </Grid>
        </React.Fragment>
    )
}
