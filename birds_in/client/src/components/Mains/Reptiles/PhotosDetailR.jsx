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
//REDUX
import { sendParameter } from '../../../redux/reptiles/actions/filterAction';
import { isSaltarRept, resetInfo } from '../../../redux/reptiles/slices/InfoSlice';
import { setNoMoreResults } from '../../../redux/reptiles/slices/FilterSlice';
import { HeaderR } from './HeaderR';
import { CopyRight } from '../../CopyRight';
import { isSaltar } from '../../../redux/paisaje/slicesP/LandscapeSlice';
import { backInfo } from '../../../redux/paisaje/actionsP/fetchAllLands';
import { useNavigate } from 'react-router-dom';

export const PhotosDetailR = ({ setIsFilterOpen, setPage }) => {
    // console.log(setPage)
    const theme = useTheme()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { isOne, info, saltarR } = useSelector(state => state.dataReptil)
    const { filtersP } = useSelector(state => state.landscapeSlice)
    const { copyFilters } = useSelector(state => state.filterRep)
    const allImages = info.flatMap(registro => registro.imagenes_reptiles);
    const featuredImage = allImages.find(image => image.destacada);
    const mainImage = featuredImage ? encodeURI(featuredImage.url) : null;
    const [showBackdrop, setShowBackdrop] = React.useState(false);
    const [loadingMessage, setLoadingMessage] = React.useState('Regresando..')

    const stepBack = () => {

        setShowBackdrop(true)
        // console.log(copyFilters, 'regreso copy filter')
        setTimeout(() => {
            if (saltarR) {
                dispatch(backInfo(filtersP));
                dispatch(isSaltar(true));
                dispatch(isSaltarRept(false))
                dispatch(resetInfo())
                navigate('/paisajes');
                return;
            }
            switch (isOne) {
                case false:
                    // console.log(copyFilters)
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
            <Grid container spacing={0}
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
                }}>
                <Grid container sx={{ position: 'relative', zIndex: 1 }}>
                    {/* CONTENIDO REAL */}
                    {mainImage && (
                        <Box sx={{ width: '100%', mt: 5, mb: 5, }}>
                            <HeaderR imageUrl={mainImage} registro={info} back={stepBack} />
                        </Box>
                    )}
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
                    <Box sx={{ width: '100%', textAlign: 'center', mt: 4 }}>
                        <CopyRight.Photo />
                    </Box>
                </Grid>
            </Grid >
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
            <Loading
                message={loadingMessage}
                open={showBackdrop}
            />
        </React.Fragment >
    )
};
