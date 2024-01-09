import * as React from 'react'
import { Box, Grid, Typography, useTheme } from '@mui/material'
import { Header } from '../../components/Header';
import { MenuBar } from '../../components/Menus/MenuBar';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCustomizes } from '../../redux/actions/Custome';

export const SobreMi = () => {
    const theme = useTheme()
    const dispatch = useDispatch()
    const { allCustom } = useSelector(state => state.customizesSlice)
    React.useEffect(() => {
        // Cleanup function to handle component unmounting
        return () => {
            dispatch(getAllCustomizes())
        };
    }, [allCustom]); // Empty dependency array to run only once on mount
    return (
        <div>
            <Header />
            <MenuBar ShowBackButton={true} ShowFilterButton={false} />
            <Typography variant='h1' color='primary' sx={{ m: 5, textAlign: 'center', }}>
                Las aves que pasaron por mis ojos....

            </Typography>
            <Typography
                sx={{
                    p: { xs: 0, sm: 1, md: 7, lg: 7, xl: 7 },
                    mt: { xs: 0, sm: 0, md: -4, lg: -4, xl: -4 },
                    // width: { xs: '600px',  },
                    // ml: {xs: 0},
                   

                }}>

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
};
