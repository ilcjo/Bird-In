import { Divider, Grid, TextField, Typography, useTheme } from '@mui/material';
import * as React from 'react'
import { useSelector } from 'react-redux';

export const About = () => {
    const theme = useTheme()
    const { allCustom } = useSelector(state => state.customizesSlice)
    const [textFirst, setTextFirst] = React.useState(allCustom.first_about || '');
    const [textAbout, setTextAbout] = React.useState(allCustom.text_about || '');
    const [textColab, setTextColab] = React.useState(allCustom.colaboradores || '');

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
                <Grid item xs={12} sm={12}>
                    <Typography variant='h5' color='primary.light' sx={{  }} >
                        Texto sobre mí
                        <Divider sx={{ my: 1 }} />
                    </Typography>
                    <Typography variant='h5' color='primary.main' sx={{ mb: 3, }} >
                        Primer Texto
                    </Typography>
                    <TextField
                        value={textFirst}
                        onChange={(e) => setTextFirst(e.target.value)}
                        multiline
                        rows={5}
                        fullWidth
                    />
                    <Typography variant='h5' color='primary.main' sx={{ mb: 3, mt: 3 }} >
                        Texto Grande
                    </Typography>
                    <TextField
                        value={textAbout}
                        onChange={(e) => setTextAbout(e.target.value)}
                        multiline
                        rows={10}
                        fullWidth
                    />
                        <Typography variant='h5' color='primary.main' sx={{ mb: 3, mt: 3 }} >
                        Colaboradores
                    </Typography>
                    <TextField
                        value={textColab}
                        onChange={(e) => setTextColab(e.target.value)}
                        multiline
                        rows={5}
                        fullWidth
                    />
                </Grid>
            </Grid>
        </React.Fragment>
    )
}
