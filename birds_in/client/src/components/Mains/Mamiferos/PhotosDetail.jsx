import * as React from 'react'
//LIBRARY
import { useDispatch, useSelector } from 'react-redux'
import { Box, Divider, Fab, Grid, Typography, useTheme } from '@mui/material'
//ICONS
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
//COMPONENTS
import { ImagesCards } from '../../Cards/ImagesCards'
import { Loading } from '../../utils/Loading';
//REDUX
import { sendParameter } from '../../../redux/mamiferos/actions/filterAction';
import { resetInfo } from '../../../redux/mamiferos/slices/InfoSlice';
import { setNoMoreResults } from '../../../redux/mamiferos/slices/FilterSlice';
import { Header } from './Header';
import { CopyRight } from '../../CopyRight';
import { isSaltar } from '../../../redux/paisaje/slicesP/LandscapeSlice';
import { backInfo } from '../../../redux/paisaje/actionsP/fetchAllLands';
import { useNavigate } from 'react-router-dom';

export const PhotosDetail = ({ setIsFilterOpen, setPage }) => {
    // console.log(setPage)
    const theme = useTheme()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { isOne, info, saltar } = useSelector(state => state.dataSlice)
    const { filtersP } = useSelector(state => state.landscapeSlice)
    const { copyFilters } = useSelector(state => state.filters)
    const allImages = info.flatMap(registro => registro.imagenes_mamiferos);
    const featuredImage = allImages.find(image => image.destacada);
    const mainImage = featuredImage ? encodeURI(featuredImage.url) : null;
    const [showBackdrop, setShowBackdrop] = React.useState(false);
    const [loadingMessage, setLoadingMessage] = React.useState('Regresando..')

    // const stepBack = () => {
    //     setShowBackdrop(true)
    //     // console.log(copyFilters, 'regreso copy filter')
    //     setTimeout(() => {
    //         switch (isOne) {
    //             case false:
    //                 // console.log(copyFilters)
    //                 dispatch(sendParameter(copyFilters));
    //                 setPage(1)
    //                 break;
    //             case true:
    //                 setIsFilterOpen(true);
    //                 dispatch(resetInfo())
    //                 setShowBackdrop(false)
    //                 break;
    //             default:
    //                 // Código que se ejecutará si isOne no es ni true ni false
    //                 break;
    //         }
    //     }, 1000);
    // };

    const stepBack = () => {
        setShowBackdrop(true);

        setTimeout(() => {
            if (saltar) {
                // Caso prioritario: si saltar es true, haces esto y terminas
                dispatch(backInfo(filtersP));
                dispatch(isSaltar(true));
                // navigate('/paisajes');
                return; // Importante para que no siga al switch
            }

            // Si no estamos en modo 'saltar', evaluamos el resto con switch
            switch (isOne) {
                case false:
                    dispatch(sendParameter(copyFilters));
                    setPage(1);
                    break;
                case true:
                    setIsFilterOpen(true);
                    dispatch(resetInfo());
                    setShowBackdrop(false);
                    break;
                default:
                    // Aquí puedes manejar casos inesperados
                    console.warn('Estado inesperado de oneBird:', oneBird);
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
                <Header imageUrl={mainImage} registro={info} back={stepBack} />
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
                    <Typography variant='h2' color='primary' sx={{ display: 'flex', alignItems: 'center', ml: 4 }}>
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
                {allImages?.length === 0 ? (
                    <Typography variant="h2" color="primary.main" sx={{ mt: 4, textAlign: 'left', ml: 4 }}>
                        No se han subido imágenes.
                    </Typography>
                ) : (
                    allImages?.map((image, index) => (
                        <ImagesCards
                            foto={image.url}
                            name={image.nombre_ingles}
                            arrayImages={allImages}
                        />
                    ))
                )}
                <Box sx={{ width: '100%', textAlign: 'center', mt: 4 }}>
                    <CopyRight.Photo />
                </Box>
            </Grid>
            <Loading
                message={loadingMessage}
                open={showBackdrop}
            />
        </React.Fragment >
    )
};
