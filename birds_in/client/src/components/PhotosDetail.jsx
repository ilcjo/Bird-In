import * as React from 'react'
import { Accordion, AccordionDetails, AccordionSummary, Divider, Grid, Typography, useTheme } from '@mui/material'
import { useSelector } from 'react-redux'
import { ImagesCards } from './Cards/ImagesCards'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export const PhotosDetail = () => {
    const theme = useTheme()
    const birds = useSelector(state => state.birdSlice.infoBirds)
    console.log('info bird', birds)
    const allImages = birds.flatMap(bird => bird.imagenes_aves);
    const [expanded, setExpanded] = React.useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
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
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={`panel${index}bh-content`}
                            id={`panel${index}bh-header`}
                        >
                            <Typography variant="h1" color='primary' sx={{ width: '33%', flexShrink: 0 }}>
                                {bird.nombre_ingles}
                                <Divider />
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography variant="h2" color='primary'>
                                Grupo
                                <Divider />
                            </Typography>
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
