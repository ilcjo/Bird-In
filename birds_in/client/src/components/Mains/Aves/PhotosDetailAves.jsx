import * as React from 'react'
import { Box, Button, Grid, Typography, useTheme } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { ImagesCards } from '../../Cards/ImagesCards'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { resetInfoBird, setNoMoreResults } from '../../../redux/slices/BirdsSlice';
import { sendParameter } from '../../../redux/actions/fetchAllBirds';
import { Header } from '../../Header';
import { Loading } from '../../utils/Loading';

export const PhotosDetailAves = ({ setIsFilterOpen }) => {
    const theme = useTheme()
    const dispatch = useDispatch()
    const { copyFilters, oneBird } = useSelector(state => state.birdSlice)
    const birds = useSelector(state => state.birdSlice.infoBirds)
    const allImages = birds.flatMap(bird => bird.imagenes_aves);
    const mainImage = allImages.find(image => image.destacada) ? allImages.find(image => image.destacada).url : null;
    const [showBackdrop, setShowBackdrop] = React.useState(false);
    const [loadingMessage, setLoadingMessage] = React.useState('Regresando..')

    const stepBack = () => {
        setShowBackdrop(true)
        setTimeout(() => {
            switch (oneBird) {
                case false:
                    dispatch(sendParameter(copyFilters));
                    break;
                case true:
                    setIsFilterOpen(true);
                    dispatch(resetInfoBird())
                    setShowBackdrop(false)
                    break;
                default:
                    // Código que se ejecutará si oneBird no es ni true ni false
                    break;
            }
        }, 1000);
    };

    React.useEffect(() => {
        // Restablece noMoreResults a false cuando se renderiza el componente
        dispatch(setNoMoreResults(true));
    }, [dispatch]);

    React.useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (

        <React.Fragment>
            {mainImage && (
                <Header imageUrl={mainImage} bird={birds} back={stepBack} />
            )}
            <Grid container spacing={3} sx={{ background: '#86ac8e', p: 8 }}>
                {/* Galería de imágenes */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        margin: 'auto',
                        backgroundColor: 'rgba(32,60,18, 0.5)',
                        backdropFilter: 'blur(8px)',
                        padding: '40px',
                        borderRadius: '20px',
                        mb: 10
                    }}
                >

                    <Grid container spacing={2} justifyContent="center" sx={{ mt: -2 }}>
                        <Grid item xs={12}>
                            <Typography variant='h2' color='primary' sx={{ display: 'flex', alignItems: 'center', ml: 4 }}>
                                Galería de Imágenes
                            </Typography>
                        </Grid>

                        {allImages.length === 0 && (
                            <Typography variant="h2" color="primary.main" sx={{ mt: 4, mr: '60%' }}>
                                No se han subido imágenes.
                            </Typography>
                        )}
                        {allImages.map((image, index) => (
                            <Grid item key={index}>
                                <ImagesCards
                                    foto={image.url}
                                    name={image.nombre_ingles}
                                    arrayImages={allImages}
                                />
                            </Grid>
                        ))}

                    </Grid>
                </Box>
            </Grid>
            <Loading
                message={loadingMessage}
                open={showBackdrop}
            />
        </React.Fragment >
    )
};