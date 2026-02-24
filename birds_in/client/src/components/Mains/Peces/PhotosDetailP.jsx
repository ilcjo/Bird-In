import * as React from 'react'
//LIBRARY
import { useDispatch, useSelector } from 'react-redux'
import { Box, Divider, Fab, Grid, Typography, useTheme } from '@mui/material'
//ICONS
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import fondo from '../../../assets/images/fondo.png'
//COMPONENTS
import { ImagesCards } from '../../Cards/ImagesCards'
import { Loading } from '../../utils/Loading';
import { CopyRight } from '../../CopyRight';
import { HeaderP } from './HeaderP';
//REDUX
import { sendParameter } from '../../../redux/peces/actions/filterAction';
import { resetInfo } from '../../../redux/peces/slices/InfoSlice';
import { setNoMoreResults } from '../../../redux/peces/slices/FilterSlice';
import { useNavigate } from 'react-router-dom';

export const PhotosDetailP = ({ setIsFilterOpen, setPage }) => {
    // console.log(setPage)
    const theme = useTheme()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { isOne, info } = useSelector(state => state.data)
    const { copyFilters } = useSelector(state => state.filter)
    const allImages = info.flatMap(registro => registro.imagenes_peces);
    const featuredImage = allImages.find(image => image.destacada);
    const mainImage = featuredImage ? encodeURI(featuredImage.url) : null;
    const [showBackdrop, setShowBackdrop] = React.useState(false);
    const [loadingMessage, setLoadingMessage] = React.useState('Regresando..')

    const stepBack = () => {
        setShowBackdrop(true)
        // console.log(copyFilters, 'regreso copy filter')
        setTimeout(() => {
            switch (isOne) {
                case false:
                    console.log(copyFilters)
                    dispatch(sendParameter(copyFilters));
                    setPage(1)
                    break;
                case true:
                    setIsFilterOpen(true);
                    dispatch(resetInfo())
                    setShowBackdrop(false)
                    break;
                default:
                    // Código que se ejecutará si isOne no es ni true ni false
                    break;
            }
        }, 1000);

    };

    React.useEffect(() => {
        // Restablece noMoreResults a false cuando se render el componente
        dispatch(setNoMoreResults(true));
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
                            <HeaderP imageUrl={mainImage} registro={info} back={stepBack} />
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
                        <Typography variant='h1' color='primary' sx={{ mb: 4 }}>
                            Galería de Imágenes
                        </Typography>

                        {allImages?.length === 0 ? (
                            <Typography variant="h2" color="primary.main" sx={{ mt: 4, textAlign: 'left', ml: 4 }}>
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
                    <Box sx={{ width: '100%', textAlign: 'center', mt: 4 }}>
                        <CopyRight.Photo />
                    </Box>
                </Grid>
            </Grid >
            {/* BOTÓN REGRESAR */}
            < Fab
                variant="extended"
                size="medium"
                color="secondary"
                sx={{
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                    zIndex: 1000,
                    color: '#103300',
                    textTransform: 'none',
                }}
                onClick={stepBack}
            >
                <ArrowBackIcon sx={{ mr: 1 }} />
                Regresar
            </Fab >
            <Loading
                message={loadingMessage}
                open={showBackdrop}
            />
        </React.Fragment >
    )
};
