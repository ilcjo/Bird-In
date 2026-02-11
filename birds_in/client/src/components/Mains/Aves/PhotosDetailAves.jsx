import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Divider, Fab, Grid, Typography, useTheme } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { sendParameter } from '../../../redux/birds/actions/filterAction';
import { backInfo, sendParameterP } from '../../../redux/paisaje/actionsP/fetchAllLands';
import { isSaltarBird, resetInfoBird } from '../../../redux/birds/slices/InfoSlice';
import { setNoMoreResults } from '../../../redux/birds/slices/FilterSlice';
import { ImagesCards } from '../../Cards/ImagesCards';
import { Loading } from '../../utils/Loading';
import { HeaderAves } from './HeaderAves';
import { CopyRight } from '../../CopyRight';
import { useNavigate } from 'react-router-dom';
import fondo from '../../../assets/images/fondo.png'
import { isSaltar } from '../../../redux/paisaje/slicesP/LandscapeSlice';

export const PhotosDetailAves = ({ setIsFilterOpen, setPage }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { oneBird, saltarB } = useSelector(state => state.birdSlice);
    const { copyFilters } = useSelector(state => state.filterSlice);
    const { filtersP } = useSelector(state => state.landscapeSlice)
    const birds = useSelector(state => state.birdSlice.infoBirds);
    const allImages = birds.flatMap(bird => bird.imagenes_aves);
    const featuredImage = allImages.find(image => image.destacada);
    const mainImage = featuredImage ? encodeURI(featuredImage.url) : null;
    const [showBackdrop, setShowBackdrop] = React.useState(false);
    const [loadingMessage, setLoadingMessage] = React.useState('Regresando..');


    const stepBack = () => {
        setShowBackdrop(true);
        setTimeout(() => {
            if (saltarB) {
                dispatch(backInfo(filtersP))
                dispatch(isSaltar(true))
                dispatch(isSaltarBird(false))
                dispatch(resetInfoBird())
                navigate('/paisajes')
            }
            else if (!oneBird) {
                dispatch(sendParameter(copyFilters));
                setPage(1);
            }
            else {
                setIsFilterOpen(true);
                dispatch(resetInfoBird());
                setShowBackdrop(false);
            }
        }, 1000);
    };

    React.useEffect(() => {
        dispatch(setNoMoreResults(true));
        // dispatch(isSaltarBird(false))
    }, [dispatch]);

    React.useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <React.Fragment>
            <Grid
                container
                spacing={0}
                sx={{
                    p: 3,
                    minHeight: '100vh',
                    width: '100%',
                    position: 'relative',
                    backgroundImage: `url(${fondo})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed',

                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(16, 51, 0, 0.6)',
                        zIndex: 0,
                    },
                }}
            >
                {/* CONTENIDO REAL */}
                <Grid container sx={{ position: 'relative', zIndex: 1 }}>

                    {/* HEADER / HERO */}
                    {mainImage && (
                        <Box sx={{ width: '100%', mt: 5, mb: 5, }}>
                            <HeaderAves
                                imageUrl={mainImage}
                                bird={birds}
                                back={stepBack}
                            />
                        </Box>
                    )}

                    {/* GALERÍA */}
                    <Box
                        sx={{
                            maxWidth: '1450px',
                            mx: 'auto',
                            width: '100%',
                            px: { xs: 2, md: 0 },
                            pb: 10,
                        }}
                    >
                        <Typography
                            variant="h1"
                            color="primary"
                            sx={{ mb: 4 }}
                        >
                            Galería de Imágenes
                        </Typography>

                        {allImages.length === 0 ? (
                            <Typography variant="h2" color="primary.main">
                                No se han subido imágenes.
                            </Typography>
                        ) : (
                            <Grid container spacing={1}>
                                {allImages?.map((image, index) => (
                                    <Grid item key={index}>
                                        <ImagesCards
                                            foto={image.url}
                                            name={image.nombre_ingles}
                                            arrayImages={allImages}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </Box>

                    {/* COPYRIGHT */}
                    <Box sx={{ width: '100%', textAlign: 'center', mb: 6 }}>
                        <CopyRight.Photo />
                    </Box>
                </Grid>
            </Grid>

            {/* BOTÓN REGRESAR */}
            <Fab
                variant="extended"
                size="medium"
                color="secondary"
                sx={{
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                    zIndex: 1000,
                    fontWeight: 'bold',
                    color: '#103300',
                    textTransform: 'none',
                }}
                onClick={stepBack}
            >
                <ArrowBackIcon sx={{ mr: 1 }} />
                Regresar
            </Fab>

            <Loading message={loadingMessage} open={showBackdrop} />
        </React.Fragment>
    );

};