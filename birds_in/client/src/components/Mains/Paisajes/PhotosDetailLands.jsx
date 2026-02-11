import * as React from 'react'
//LIBRARY
import { useDispatch, useSelector } from 'react-redux'
import { Box, Divider, Fab, Grid, Typography, useTheme } from '@mui/material'
//ICONS
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import fondo from '../../../assets/images/fondo.png'
//COMPONENTS
import { ImagesCards } from '../../Cards/ImagesCards'
import { HeaderLand } from './HeaderLand';
import { Loading } from '../../utils/Loading';
//redux
import { sendParameterP } from '../../../redux/paisaje/actionsP/fetchAllLands';
import { isSaltar, resetInfoLand, setNoMoreResults } from '../../../redux/paisaje/slicesP/LandscapeSlice';
import { CopyRight } from '../../CopyRight';
import { backInfo as backInfoBird } from '../../../redux/birds/actions/filterAction';
import { backInfo as backInfoMam } from '../../../redux/mamiferos/actions/filterAction';
import { backInfo, backInfo as backInfoRept } from '../../../redux/reptiles/actions/filterAction';
import { useNavigate } from 'react-router-dom';
import { isSaltarBird } from '../../../redux/birds/slices/InfoSlice';
import { isSaltarMa } from '../../../redux/mamiferos/slices/InfoSlice';
import { isSaltarRept } from '../../../redux/reptiles/slices/InfoSlice';

export const PhotosDetailLands = ({ setIsFilterOpen, setPage, }) => {
    // console.log(setPage)
    const theme = useTheme()
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const { copyFiltersP, oneLand, saltarP, filtersP, isBird, isMa, isRept } = useSelector(state => state.landscapeSlice)
    const { filters, currentFilters } = useSelector(state => state.filterSlice);
    const filtersM = useSelector(state => state.filters.filters);
    const filtersR = useSelector(state => state.filterRep.filters)
    const Register = useSelector(state => state.landscapeSlice.infoLands)
    const allImages = Register.flatMap(bird => bird.imagenes_paisajes);
    const featuredImage = allImages.find(image => image.destacada);
    const mainImage = featuredImage ? encodeURI(featuredImage.url) : null;
    const [showBackdrop, setShowBackdrop] = React.useState(false);
    const [loadingMessage, setLoadingMessage] = React.useState('Regresando..')

    const stepBack = () => {
        setShowBackdrop(true)
        // console.log(copyFiltersP, 'regreso copy filter')
        setTimeout(() => {
            if (isBird) {
                dispatch(backInfoBird(filters));
                dispatch(isSaltarBird(false));
                navigate('/aves');
                dispatch(resetInfoLand())
                return;
            } else if (isMa) {
                dispatch(backInfoMam(filtersM))
                dispatch(isSaltarMa(false))
                navigate('/mamiferos');
                dispatch(resetInfoLand())
            } else if (isRept) {
                dispatch(backInfo(filtersR))
                dispatch(isSaltarRept(false))
                navigate('/reptiles');
                dispatch(resetInfoLand())
            }
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
        // dispatch(isSaltar(false))
    }, [dispatch]);

    React.useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <React.Fragment>
            {mainImage && (
                <HeaderLand imageUrl={mainImage} register={Register} back={stepBack} />
            )}
            <Grid container spacing={0} sx={{
                backgroundColor: 'rgba(32,60,18, 0.5)', p: {
                    xs: 2, md: 2,
                    alignItems: 'center', // Centra verticalmente (si es necesario)
                    display: 'flex',
                    justifyContent: 'center',
                     backgroundImage: `url(${fondo})`,
                }
            }}>
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

                <Box sx={{ width: '100%', mb: 4, textAlign: 'left', mt: 2 }}>
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
            </Grid >
            <Loading
                message={loadingMessage}
                open={showBackdrop}
            />
        </React.Fragment >
    )
};
