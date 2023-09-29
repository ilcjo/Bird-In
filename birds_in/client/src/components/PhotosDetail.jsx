import * as React from 'react'
import { Accordion, AccordionDetails, AccordionSummary, Divider, Grid, Typography, useTheme } from '@mui/material'
import { useSelector } from 'react-redux'
import { ImagesCards } from './Cards/ImagesCards'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import wikipediaLogo from '../assets/images/wikilogo.png'
import ebirdLogo from '../assets/images/cornell-lab-logo.svg'

export const PhotosDetail = () => {
    const theme = useTheme()
    const birds = useSelector(state => state.birdSlice.infoBirds)
    // console.log(birds)
    const allImages = birds.flatMap(bird => bird.imagenes_aves);
    const [expanded, setExpanded] = React.useState(false);
   

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const formatCountries = (countries) => {
        if (!Array.isArray(countries)) {
            return ''; // Retorna una cadena vacía si no es un array
        }

        const formattedCountries = countries.map((country) => {
            // Verifica si el elemento del array es un objeto con la propiedad "nombre"
            if (typeof country === 'object' && country.nombre) {
                // Capitaliza la primera letra y convierte el resto a minúsculas
                return country.nombre.charAt(0).toUpperCase() + country.nombre.slice(1).toLowerCase();
            } else {
                // Si no es un objeto o no tiene la propiedad "nombre", retorna un string vacío
                return '';
            }
        });

        // Filtra los elementos no vacíos y une con comas
        const filteredCountries = formattedCountries.filter((country) => country !== '');
        return filteredCountries.join(', ');
    };

    return (
        <React.Fragment>
            <Grid container spacing={3} justifyContent="center" sx={{ position: 'relative' }}>
                {birds.map((bird, index) => (
                    <Accordion
                        key={index}
                        expanded={expanded === `panel${index}`}
                        onChange={handleChange(`panel${index}`)}
                        sx={{
                            backgroundColor: 'rgba(255, 255, 255, 0)',
                            width: '100%', // Ocupar todo el ancho de la pantalla
                            boxShadow: 'none',
                            top: 0, // Pegado al top
                            marginBottom: theme.spacing(2), // Espacio en la parte inferior
                        }}
                    >
                        <AccordionSummary
                            expandIcon={
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    {!expanded && (
                                        <Typography variant="h4" sx={{ color: 'text.secondary', marginRight: 1 }}>
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
                            <Typography variant="h1" color='primary' sx={{ width: '33%', flexShrink: 0 }}>
                                {bird.nombre_ingles}
                                <Divider sx={{ mt: 2, borderColor: 'primary.main', borderWidth: 1, width: '50vh' }} />
                            </Typography>

                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container spacing={9}>
                                <Grid item xs={3} ></Grid>
                                <Grid item xs={2.5}>
                                    {/* Contenido de la primera columna */}
                                    <Typography variant="h5" color="primary.light">
                                        Nombre Inglés:
                                        <Divider sx={{ mt: 0.5, mb: 1, borderColor: 'primary', borderWidth: 0.5, width: '190px' }} />
                                        <Typography variant="body1" color="primary.dark" sx={{ mb: 1.5 }}>
                                            {bird.nombre_ingles}
                                        </Typography>
                                    </Typography>

                                    <Typography variant="h5" color="primary.light">
                                        Nombre Común:
                                        <Divider sx={{ mt: 0.5, mb: 1, borderColor: 'primary', borderWidth: 0.5, width: '190px' }} />
                                        <Typography variant="body1" color="primary.dark" sx={{ mb: 1.5 }}>
                                            {bird.nombre_comun}
                                        </Typography>
                                    </Typography>
                                    <Typography variant="h5" color="primary.light">
                                        Nombre Científico:
                                        <Divider sx={{ mt: 0.5, mb: 1, borderColor: 'primary', borderWidth: 0.5, width: '190px' }} />
                                        <Typography variant="body1" color="primary.dark">
                                            {bird.nombre_cientifico}
                                        </Typography>
                                    </Typography>

                                </Grid>
                                <Grid item xs={2}>
                                    {/* Contenido de la segunda columna */}
                                    <Typography variant="h5" color="primary.light">
                                        País:
                                        <Divider sx={{ mt: 0.5, mb: 1, borderColor: 'primary', borderWidth: 0.5, width: '190px' }} />
                                        <Typography variant="body1" color="primary.dark" sx={{ mb: 1.5 }}>
                                            {formatCountries(bird.paises)}
                                        </Typography>
                                    </Typography>

                                    <Typography variant="h5" color="primary.light">
                                        Zonas:
                                        <Divider sx={{ mt: 0.5, mb: 1, borderColor: 'primary', borderWidth: 0.5, width: '190px' }} />
                                        <Typography variant="body1" color="primary.dark" sx={{ mb: 1.5 }}>
                                            {bird.zonas}
                                        </Typography>
                                    </Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Typography variant="h5" color="primary.light">
                                        Grupo:
                                        <Divider sx={{ mt: 0.5, mb: 1, borderColor: 'primary', borderWidth: 0.5, width: '190px' }} />
                                        <Typography variant="body1" color="primary.dark" sx={{ mb: 1.5 }}>
                                            {bird.grupo.nombre}
                                        </Typography>
                                    </Typography>

                                    <Typography variant="h5" color="primary.light">
                                        Familia:
                                        <Divider sx={{ mt: 0.5, mb: 1, borderColor: 'primary', borderWidth: 0.5, width: '190px' }} />
                                        <Typography variant="body1" color="primary.dark" sx={{ mb: 1.5 }}>
                                            {bird.familia.nombre}
                                        </Typography>
                                    </Typography>
                                </Grid>
                                <Grid item xs={2} >
                                    <Typography variant="h5" color="primary.light" >
                                        Urls Externas:
                                        <Divider sx={{ mt: 0.5, mb: 1, borderColor: 'primary', borderWidth: 0.5, width: '190px' }} />
                                    </Typography>
                                    {/* <div style={{ display: 'flex', alignItems: 'center' }}> */}
                                    <Typography>
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
                                    </Typography>
                                    <Typography >
                                        <a href={bird.url_bird} target="_blank" rel="noopener noreferrer">
                                            <img src={ebirdLogo} alt="eBird Logo" style={{
                                                // marginLeft: '30px',
                                                marginTop: '10px',
                                                width: '130px', // Ajusta el ancho de la imagen
                                                height: '39px', // Ajusta la altura de la imagen
                                            }} />
                                        </a >
                                    </Typography>
                                    {/* </div> */}
                                </Grid>
                            </Grid>
                            <Divider
                                sx={{
                                    mb: 3,
                                    mt: 5,
                                    borderColor: 'primary.main',
                                    borderWidth: 1,
                                }} />

                        </AccordionDetails>
                    </Accordion>
                ))}
            </Grid>
            <Grid container spacing={3} justifyContent="center">
                {allImages.map((image, index) => (
                    <Grid item key={index}>
                        <ImagesCards foto={image.url} name={image.nombre_ingles} arrayImages={allImages} />
                    </Grid>
                ))}
            </Grid>
        </React.Fragment>
    )
};
