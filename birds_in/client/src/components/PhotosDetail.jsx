import * as React from 'react'
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Divider, Grid, Typography, useTheme } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { ImagesCards } from './Cards/ImagesCards'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import wikipediaLogo from '../assets/images/wikilogo.png'
import ebirdLogo from '../assets/images/Logo_ebird.png'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { resetInfoBird, setNoMoreResults } from '../redux/slices/BirdsSlice';
import { sendParameter } from '../redux/actions/fetchAllBirds';
import fondo from '../assets/images/desenfoque.jpg'

export const PhotosDetail = ({ setIsFilterOpen }) => {
    const theme = useTheme()
    const dispatch = useDispatch()
    const birds = useSelector(state => state.birdSlice.infoBirds)
    const { copyFilters, oneBird } = useSelector(state => state.birdSlice)
    const allImages = birds.flatMap(bird => bird.imagenes_aves);
    const [expanded, setExpanded] = React.useState(`panel0`);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : null);
    };

    const formatCountries = (countries) => {
        if (!Array.isArray(countries)) {
            return ''; // Retorna una cadena vacía si no es un array
        }

        const formattedCountries = countries.map((country) => {
            // Verifica si el elemento del array es un objeto con la propiedad "nombre"
            if (typeof country === 'object' && country.nombre) {
                // Capitaliza la primera letra y convierte el resto a minúsculas
                return country.nombre;
            } else {
                // Si no es un objeto o no tiene la propiedad "nombre", retorna un string vacío
                return '';
            }
        });

        // Filtra los elementos no vacíos y une con comas
        const filteredCountries = formattedCountries.filter((country) => country !== '');
        return filteredCountries.join(', ');
    };


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

    // const formatZonas = (zonas) => {
    //     if (!Array.isArray(zonas)) {
    //         return ''; // Retorna una cadena vacía si no es un array
    //     }

    //     const formattedZonas = zonas.map((zona) => {
    //         // Verifica si el elemento del array es un objeto con la propiedad "nombre_zona"
    //         if (typeof zona === 'object' && zona.nombre_zona) {
    //             return zona.nombre_zona;
    //         } else {
    //             // Si no es un objeto o no tiene la propiedad "nombre_zona", retorna un string vacío
    //             return '';
    //         }
    //     });

    //     // Filtra los elementos no vacíos y une con comas
    //     const filteredZonas = formattedZonas.filter((zona) => zona !== '');
    //     return filteredZonas.join(', ');
    // };


    return (
        <React.Fragment>
            <Grid container spacing={3} justifyContent="center"
                sx={{
                    position: 'relative',
                    backgroundImage: `url(${fondo})`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'top',

                }}>
                {birds.map((bird, index) => (

                    <Accordion
                        key={index}
                        expanded={expanded === `panel${index}`}
                        onChange={handleChange(`panel${index}`)}
                        sx={{

                            backgroundColor: 'rgba(204,214,204,0)', // Establece el fondo transparente deseado
                            backdropFilter: 'blur(20px)', // Efecto de desenfoque de fondo
                            width: '200vh', // Ocupar todo el ancho de la pantalla
                            boxShadow: 'none',
                            top: 0, // Pegado al top
                            marginBottom: theme.spacing(), // Espacio en la parte inferior7 backgroundImage: `url(${fondo})`,  // Reemplaza con la ruta correcta de tu imagen
                            // '&.MuiAccordion-root': {
                            //     borderRadius: '50px', // Ajusta el valor según tus preferencias
                            //     overflow: 'hidden', // Asegúrate de que el contenido no sobresalga del borde redondeado
                            // },
                        }}
                    >

                        <AccordionSummary
                            expandIcon={
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    {!expanded && (
                                        <Typography variant="h4" sx={{ color: 'white', marginRight: 1 }}>
                                            Abrir Información
                                        </Typography>
                                    )}
                                    <ExpandMoreIcon />

                                </div>
                            }
                            aria-controls={`panel${index}bh-content`}
                            id={`panel${index}bh-header`}
                            sx={{ position: 'relative' }}
                        >

                            <Typography variant="h1" color='primary' sx={{ width: '40%', flexShrink: 0, mt: 2 }}>
                                {bird.nombre_ingles ? bird.nombre_ingles : 'No Especificado'}
                                {/* <Divider sx={{ mt: 2, borderColor: 'primary.main', borderWidth: 1, width: '50vh' }} /> */}
                            </Typography>

                        </AccordionSummary>
                        <AccordionDetails sx={{
                            backgroundColor: 'rgba(204,214,204,0.2)', // Establece el fondo transparente deseado
                            borderRadius: '20px',
                        }}>

                            <Grid container spacing={5} sx={{ ml: 4 }}>
                                {/* Contenido de la primera columna */}
                                <Grid item xs={2.5} >
                                    <Typography variant="h5" color="primary.main">
                                        Nombre Inglés:  <Typography variant="body1" color="primary.light" sx={{ mb: 1.5 }}>
                                            {bird.nombre_ingles ? bird.nombre_ingles : 'No Especificado'}
                                        </Typography>
                                        {/* <Divider sx={{ mt: 0.5, mb: 1, borderColor: 'primary', borderWidth: 0.5, width: '190px' }} /> */}
                                    </Typography>
                                    <Typography variant="h5" color="primary.main">
                                        País: <Typography variant="body1" color="primary.light" sx={{ mb: 1.5 }}>
                                            {formatCountries(bird.paises)}
                                        </Typography>
                                    </Typography>
                                </Grid>
                                {/* Contenido de la segunda columna */}
                                <Grid item xs={2.5}>
                                    <Typography variant="h5" color="primary.main">
                                        Nombre Común:
                                        <Typography variant="body1" color="primary.light" sx={{ mb: 1.5 }}>
                                            {bird.nombre_comun ? bird.nombre_comun : 'No Especificado'}
                                        </Typography>
                                        {/* <Divider sx={{ mt: 0.5, mb: 1, borderColor: 'primary', borderWidth: 0.5, width: '190px' }} /> */}
                                    </Typography>

                                    <Typography variant="h5" color="primary.main">
                                        Zonas:
                                        <Typography variant="body1" color="primary.light" sx={{ mb: 1.5 }}>
                                            {formatCountries(bird.zonasAves)}
                                        </Typography>
                                    </Typography>

                                </Grid>
                                <Grid item xs={2}>
                                    {/* Contenido de la tercera columna */}
                                    <Typography variant="h5" color="primary.main">
                                        Nombre Científico:
                                        <Typography variant="body1" color="primary.light">
                                            {bird.nombre_cientifico ? bird.nombre_cientifico : 'No Especificado'}
                                        </Typography>
                                    </Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Typography variant="h5" color="primary.main">
                                        Grupo:
                                        <Typography variant="body1" color="primary.light" sx={{ mb: 1.5 }}>
                                            {bird.grupo.nombre}
                                        </Typography>
                                        {/* <Divider sx={{ mt: 0.5, mb: 1, borderColor: 'primary', borderWidth: 0.5, width: '190px' }} /> */}
                                    </Typography>

                                    <Typography variant="h5" color="primary.main">
                                        Familia:
                                        <Typography variant="body1" color="primary.light" sx={{ mb: 1.5 }}>
                                            {bird.familia.nombre}
                                        </Typography>
                                    </Typography>
                                </Grid>
                                <Grid item xs={2} >
                                    <Typography variant="h5" color="primary.main" >
                                        URLS Externas:
                                        {/* <Divider sx={{ mt: 0.5, mb: 1, borderColor: 'primary', borderWidth: 0.5, width: '190px' }} /> */}
                                    </Typography>
                                    {/* <div style={{ display: 'flex', alignItems: 'center' }}> */}
                                    <Typography>

                                        {bird.url_wiki ? (
                                            <a href={bird.url_wiki} target="_blank" rel="noopener noreferrer">
                                                <img src={wikipediaLogo} alt="Wikipedia Logo" style={{
                                                    marginRight: '5px',
                                                    marginTop: '5px',
                                                    width: '30px', // Ajusta el ancho de la imagen
                                                    height: '25px', // Ajusta la altura de la imagen
                                                }}
                                                />
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
                                    </Typography>
                                    <Typography >
                                        {bird.url_bird ? (
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
                                    {/* </div> */}
                                </Grid>
                            </Grid>
                            <Divider
                                sx={{
                                    // mb: 3,
                                    mt: 2,
                                    borderColor: 'primary.main',
                                    borderWidth: 1,
                                }} />

                        </AccordionDetails>
                    </Accordion>
                ))}
            </Grid>

            <Grid container component={Box} spacing={3} justifyContent="center" sx={{
                position: 'relative',
                backgroundImage: `url(${fondo})`,  // Reemplaza con la ruta correcta de tu imagen
                // backgroundImage: `linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,1) 100%), url(${fondo})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                // overflow: 'hidden',  // Oculta el desenfoque que sobresale del contenedor
                // backdropFilter: 'blur(70px) brightness(70%)',
                // backgroundColor: 'rgba(204,214,204,0)',
            }}>
                
                <Button
                    sx={{
                        // mt: -4,
                        mb: 1,
                        ml: '75%',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        color: theme.palette.primary.main,
                        zIndex: 1,

                    }}
                    variant="outline"
                    onClick={stepBack}
                    startIcon={<ArrowBackIcon />}
                >Regresar</Button>
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
        </React.Fragment>
    )
};
