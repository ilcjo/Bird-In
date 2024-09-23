import * as React from 'react';
import { Box, Grid, Typography, useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCustomizes } from '../../redux/settings/actions/Custom';

export const SobreMi = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { allCustom } = useSelector(state => state.customizesSlice);

    React.useEffect(() => {
        // Cleanup function to handle component unmounting
        return () => {
            dispatch(getAllCustomizes());
        };
    }, [allCustom]);

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundImage: `url(${allCustom.background_sobremi})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                color: theme.palette.primary.contrastText,
                padding: '50px 20px',
                backgroundColor: 'linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent)',
            }}
        >
            <Typography variant='h1' color='primary' sx={{ m: 5, textAlign: 'center' }}>
                Las aves que pasaron por mis ojos....
            </Typography>

            <Box
                sx={{
                    mt: -8,
                    width: { xs: '90%', md: '80%' },
                    margin: 'auto',
                    padding: { xs: '8px', md: '40px' },
                    borderRadius: '30px',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Fondo semi-transparente para el texto
                    overflowY: 'auto',
                    maxHeight: '500px', // Limitar la altura para que aparezca la barra de desplazamiento
                }}
            >
                <Typography sx={{ pl: 5, pr: 5, mt: -2, textAlign: 'justify', mb: 0, m: 0 }}>
                    {allCustom.first_about}
                </Typography>
                <Typography sx={{ pl: 5, pr: 5, mt: -2, textAlign: 'justify' }}>
                    <Typography sx={{ textAlign: 'justify' }}>
                        <br />
                        {allCustom.text_about}
                    </Typography>
                    <Typography variant='h5' color='primary.dark' sx={{ mt: 2 }}>
                        Atentamente,
                        <br />
                        Moises Sterimberg
                    </Typography>
                </Typography>
            </Box>

            <Box sx={{ m: { xs: 0, md: 14 }, mt: { xs: 8, md: 5 }, p: 5, backgroundColor: 'rgba(255, 255, 255, 0.5)', borderRadius: '10px', }}>
                <Typography variant='h5' color='primary'>
                    Colaboradores:
                </Typography>
                <Typography variant='body1' color='primary.dark'>
                    <br />
                    {allCustom.colaboradores}
                </Typography>
            </Box>
        </Box>
    );
};
