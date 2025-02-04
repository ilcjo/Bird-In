import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Divider, Fab, Grid, Typography, useTheme } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { sendParameter } from '../../../redux/birds/actions/filterAction';
import { resetInfoBird } from '../../../redux/birds/slices/InfoSlice';
import { setNoMoreResults } from '../../../redux/birds/slices/FilterSlice';
import { ImagesCards } from '../../Cards/ImagesCards';
import { Loading } from '../../utils/Loading';
import { HeaderAves } from './HeaderAves';
import { CopyRight } from '../../CopyRight';

export const PhotosDetailAves = ({ setIsFilterOpen, setPage }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { oneBird } = useSelector(state => state.birdSlice);
    const { copyFilters } = useSelector(state => state.filterSlice);
    const birds = useSelector(state => state.birdSlice.infoBirds);
    const allImages = birds.flatMap(bird => bird.imagenes_aves);
    const featuredImage = allImages.find(image => image.destacada);
    const mainImage = featuredImage ? encodeURI(featuredImage.url) : null;
    const [showBackdrop, setShowBackdrop] = React.useState(false);
    const [loadingMessage, setLoadingMessage] = React.useState('Regresando..');

    const stepBack = () => {
        setShowBackdrop(true);
        setTimeout(() => {
            if (!oneBird) {
                dispatch(sendParameter(copyFilters));
                setPage(1);
            } else {
                setIsFilterOpen(true);
                dispatch(resetInfoBird());
                setShowBackdrop(false);
            }
        }, 1000);
    };

    React.useEffect(() => {
        dispatch(setNoMoreResults(true));
    }, [dispatch]);

    React.useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <React.Fragment>
            {mainImage && (
                <HeaderAves imageUrl={mainImage} bird={birds} back={stepBack} />
            )}
            <Grid container spacing={0} sx={{
                backgroundColor: 'rgba(32,60,18, 0.5)', p: {
                    xs: 2, md: 2,
                    alignItems: 'center', // Centra verticalmente (si es necesario)
                    display: 'flex',
                    justifyContent: 'center',
                }
            }}>
                <Fab
                    variant="extended"
                    size="medium"
                    color="primary"
                    sx={{
                        position: 'fixed',
                        bottom: 16,
                        right: 16,
                        zIndex: 1000,
                        fontWeight: 'bold',
                        '&:hover': {
                            color: 'white',
                        }
                    }}
                    onClick={stepBack}
                >
                    <ArrowBackIcon sx={{ mr: 1 }} />
                    Regresar
                </Fab>

                <Box sx={{ width: '100%', mb: 4, textAlign: 'left' }}>
                    <Typography variant='h1' color='primary' sx={{ display: 'flex', alignItems: 'center', ml: 4 }}>
                        Galería de Imágenes
                    </Typography>

                    {/* <Divider
                        sx={{
                            my: 2,
                            borderColor: theme.palette.primary.main,
                            width: '25%',
                            height: '2px',
                            borderBottomWidth: '3px',
                            borderRadius: '10px',
                        }}
                    /> */}
                </Box>

                {allImages.length === 0 ? (
                    <Typography variant="h2" color="primary.main" sx={{ mt: 4 }}>
                        No se han subido imágenes.
                    </Typography>
                ) : (
                    allImages.map((image, index) => (
                        <ImagesCards foto={image.url} name={image.nombre_ingles} arrayImages={allImages} />
                    ))
                )}
                <Box sx={{ width: '100%', textAlign: 'center', mt: 4 }}>
                    <CopyRight.Photo />
                </Box>
            </Grid>
            <Loading message={loadingMessage} open={showBackdrop} />
        </React.Fragment>
    );
};