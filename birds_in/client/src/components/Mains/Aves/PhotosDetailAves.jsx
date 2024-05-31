import * as React from 'react'
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Divider, Grid, Typography, useTheme } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { ImagesCards } from '../../Cards/ImagesCards'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import wikipediaLogo from '../../../assets/images/wikilogo.png'
import ebirdLogo from '../../../assets/images/Logo_ebird.png'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { resetInfoBird, setNoMoreResults } from '../../../redux/slices/BirdsSlice';
import { sendParameter } from '../../../redux/actions/fetchAllBirds';
import fondo from '../../../assets/images/desenfoque.jpg'
import { Header } from '../../Header';

export const PhotosDetailAves = ({ setIsFilterOpen }) => {
    const theme = useTheme()
    const dispatch = useDispatch()
    const birds = useSelector(state => state.birdSlice.infoBirds)
    const { copyFilters, oneBird } = useSelector(state => state.birdSlice)
    const allImages = birds.flatMap(bird => bird.imagenes_aves);
    const mainImage = allImages.find(image => image.destacada) ? allImages.find(image => image.destacada).url : null;

    const stepBack = () => {
        // console.log('dentro');
        switch (oneBird) {
            case false:
                dispatch(sendParameter(copyFilters));
                break;
            case true:
                // console.log('dentro de bird', oneBird);
                setIsFilterOpen(true);
                dispatch(resetInfoBird())
                break;
            default:
            // Código que se ejecutará si oneBird no es ni true ni false
        }
    };


    React.useEffect(() => {
        // Restablece noMoreResults a false cuando se renderiza el componente
        dispatch(setNoMoreResults(true));
    }, [dispatch]);

  

    return (
        <React.Fragment>
            {mainImage && (
                <Header imageUrl={mainImage} bird={birds} />
            )}
            <Grid container spacing={3} justifyContent="center">
              
                        {/* <Typography variant="h5" color="primary.main">
                            URLS Externas:
                        </Typography>
                        <Typography>
                            {bird.url_wiki ? (
                                <a href={bird.url_wiki} target="_blank" rel="noopener noreferrer">
                                    <img src={wikipediaLogo} alt="Wikipedia Logo" style={{
                                        marginRight: '5px',
                                        marginTop: '5px',
                                        width: '30px',
                                        height: '25px',
                                    }} />
                                    Wikipedia
                                </a>
                            ) : (
                                <React.Fragment>
                                    <img src={wikipediaLogo} alt="Wikipedia Logo" style={{
                                        marginRight: '5px',
                                        marginTop: '5px',
                                        width: '30px',
                                        height: '25px',
                                    }} />
                                    <span>  Wikipedia</span>
                                </React.Fragment>
                            )}
                        </Typography> */}
                        {/* <Typography> */}
                            {/* {bird.url_bird ? (
                                <a href={bird.url_bird} target="_blank" rel="noopener noreferrer">
                                    <img src={ebirdLogo} alt="eBird Logo" style={{
                                        marginTop: '12px',
                                        width: '110px',
                                        height: '39px',
                                    }} />
                                </a>
                            ) : (
                                <img src={ebirdLogo} alt="eBird Logo" style={{
                                    marginTop: '12px',
                                    width: '110px',
                                    height: '39px',
                                }} />
                            )}
                        </Typography>
                    </Grid>
                ))} */}

                <Button

                    variant="outlined"
                    onClick={stepBack}
                    startIcon={<ArrowBackIcon />}
                >
                    Regresar
                </Button>

                {/* Galería de imágenes */}
                <Grid container spacing={3} justifyContent="center">
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
            </Grid>
        </React.Fragment>
    )
};
