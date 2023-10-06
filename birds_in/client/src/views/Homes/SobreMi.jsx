import React from 'react'
import { Box, Grid, Typography, useTheme } from '@mui/material'
import { Header } from '../../components/Header';
import { MenuBar } from '../../components/Menus/MenuBar';
import { useSelector } from 'react-redux';

export const SobreMi = () => {
    const theme = useTheme()
    const { allCustom } = useSelector(state => state.customizesSlice)
    return (
        <div>
            <Header />
            <MenuBar ShowBackButton={true} ShowFilterButton={false} />
            <Typography variant='h1' color='primary' sx={{ m: 5, textAlign: 'center', }}>
                Las aves que pasaron por mis ojos....

            </Typography>
            <Typography sx={{ p: 7, mt: -4 }}>

                <Typography sx={{ ml: 20, mr: 20, textAlign: 'center' }} >
                    <Typography >
                        {allCustom.first_about}
                    </Typography>
                </Typography>
            </Typography>


            <Box
                sx={{
                    alignItems: 'center',
                    width: '80%',
                    margin: 'auto',
                    padding: '40px',
                    borderRadius: '30px',
                    textAlign: 'justify',
                    backgroundColor: theme.palette.secondary.light
                }}>
                <Grid container spacing={2} >

                    <Grid item xs={12} md={12}>
                        <Typography sx={{ pl: 5, pr: 5, mt: -2 }}>

                            <Typography>
                                <br />
                                {allCustom.text_about}
                            </Typography>
                            <Typography variant='h5' color='primary.dark' sx={{ mt: 2 }} >
                                Atentamente,
                                <br />
                                Moises Sterimberg
                            </Typography>
                        </Typography>
                    </Grid>
                </Grid>

            </Box >
            <Grid sx={{ m: 20, mt: -0.5 }}>

                <Typography variant='body1' color='primary.dark'>
                    <br />
                    <Typography variant='h5' color='primary'>
                        Colaboradores:
                    </Typography >
                    {allCustom.colaboradores}
                </Typography>
            </Grid>
        </div >
    )
}
