import * as React from 'react'
//LIBRARY
import { useDispatch, useSelector } from 'react-redux'
import { Box, Divider, Grid, Typography, useTheme } from '@mui/material'
//ICONS
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
//COMPONENTS
import { ImagesCards } from '../../Cards/ImagesCards'
import { HeaderLand } from '../../HeaderLand';
import { Header } from '../../Header';
import { Loading } from '../../utils/Loading';
//redux
import { sendParameterP } from '../../../redux/paisaje/actionsP/fetchAllLands';
import { resetInfoLand, setNoMoreResults } from '../../../redux/paisaje/slicesP/LandscapeSlice';

export const PhotosDetailLands = ({ setIsFilterOpen, setPage, }) => {
    // console.log(setPage)
    const theme = useTheme()
    const dispatch = useDispatch()
    const { copyFiltersP, oneLand } = useSelector(state => state.landscapeSlice)
    const Register = useSelector(state => state.landscapeSlice.infoLands)
    const allImages = Register.flatMap(bird => bird.imagenes_paisajes);
    const mainImage = allImages.find(image => image.destacada) ? allImages.find(image => image.destacada).url : null;
    const [showBackdrop, setShowBackdrop] = React.useState(false);
    const [loadingMessage, setLoadingMessage] = React.useState('Regresando..')

    const stepBack = () => {
        setShowBackdrop(true)
        console.log(copyFiltersP, 'regreso copy filter')
        setTimeout(() => {
            switch (oneLand) {
                case false:
                    dispatch(sendParameterP(copyFiltersP));
                    setPage(1)
                    break;
                case true:
                    setIsFilterOpen(true);
                    dispatch(resetInfoLand())
                    setShowBackdrop(false)
                    break;
                default:
                    // Código que se ejecutará si oneBird no es ni true ni false
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
            {mainImage && (
                <HeaderLand imageUrl={mainImage} register={Register} back={stepBack} />
            )}
            <Grid container spacing={0} sx={{ background: '#86ac8e', p: { xs: 2, md: 5 } }}>
                {/* Galería de imágenes */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        margin: 'auto',
                        backgroundColor: 'rgba(0, 56, 28, 0.3)',
                        backdropFilter: 'blur(8px)',
                        padding: { xs: '10px', md: '40px' },
                        borderRadius: '20px',
                        mb: 10
                    }}
                >
                    <Grid container spacing={2} justifyContent="center" sx={{ mt: -2 }}>
                        <Grid item xs={12}>
                            <Typography variant='h2' color='primary' sx={{ display: 'flex', alignItems: 'center', ml: 4 }}>
                                Galería de Imágenes
                            </Typography>
                            <Box sx={{ ml: 4 }}>
                                <Divider
                                    sx={{
                                        my: 2,
                                        borderColor: theme.palette.primary.main,
                                        width: '25%',
                                        height: '2px',
                                        borderBottomWidth: '3px',
                                        borderRadius: '10px',
                                    }}
                                />
                            </Box>
                        </Grid>

                        {allImages?.length === 0 && (
                            <Typography variant="h2" color="primary.main" sx={{ mt: 4, textAlign: 'left', ml: 4 }}>
                                No se han subido imágenes.
                            </Typography>
                        )}
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
                </Box>
            </Grid>
            <Loading
                message={loadingMessage}
                open={showBackdrop}
            />
        </React.Fragment>
    )
};
