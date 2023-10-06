import React from 'react'
import { Box, Divider, Grid, Typography, useTheme } from '@mui/material'
import { Header } from '../../components/Header';
import { MenuBar } from '../../components/Menus/MenuBar';

export const SobreMi = () => {
    const theme = useTheme()

    return (
        <div>
            <Header />
            <MenuBar ShowBackButton={true} ShowFilterButton={false} />
            <Typography variant='h1' color='primary' sx={{ m: 5, textAlign: 'center', }}>
                Las aves que pasaron por mis ojos....

            </Typography>
            <Typography sx={{ p: 7, mt: -4 }}>

                <Typography sx={{ ml: 20, mr: 20, textAlign: 'center' }} >
                    <Typography >
                        <Typography variant='body1' color='primary' sx={{ fontSize: '3rem' }}>"</Typography>
                        A lo largo de mi vida he tenido la suerte y oportunidad de conocer lugares
                        increíbles que despertaron en mí una gran admiración por la naturaleza y por
                        todos los seres que la habitan.
                    </Typography>
                    <Typography>
                        <br />
                        Pero han sido las aves, que con sus llamativos colores, melodiosos cánticos y
                        majestuosidad, lograron atraparme para convertirme en uno de sus más fieles admiradores.
                    </Typography>
                </Typography>
            </Typography>
            <Box
                sx={{
                    alignItems: 'center',
                    width: '80%',
                    margin: '0px 0px 0px 150px',
                    borderRadius: '20px',
                    textAlign: 'justify',
                }}>
                <Grid container spacing={2} >

                    <Grid item xs={12} md={6}>
                        <Typography sx={{ pl: 5, pr: 5, mt: -2 }}>

                            <Typography>
                                <br />
                                Fue así como hace 2 años tome la decisión de estudiar las aves en detalle y llegar
                                a ser un observador de ellas, aun cuando mis conocimientos eran básicos.
                                <Typography>


                                    No fue necesario ser científico u ornitólogo para tener el título de “Pajarero”.
                                    <br />
                                    Entusiasmo, amor e interés por las aves fueron los aspectos más relevantes que me
                                    impulsaron a iniciar una aventura por esta apasionante actividad.
                                </Typography>
                            </Typography>
                            <Typography>
                                Tan solo una cámara, unos buenos binoculares, y una grata compañía sumados a la suerte de
                                encontrar los más hermosos ejemplares de aves en el lugar y momento indicados,
                                fueron suficientes para capturar las imágenes que hoy en día conforman mi colección fotográfica.
                                <br />
                                Aunque mi intención nunca fue viajar para encontrar algún tipo de ave en especial,
                                me emocionaba más que algún ejemplar de esta bella especie pasara
                                al frente de mis ojos que apreciar los sitios turísticos del destino donde estuviera.
                            </Typography>
                            <Typography>
                                Son cerca de 10.000 fotografías de aves que en algún momento “pasaron por mis ojos” y
                                que tuve la oportunidad de retratar. Cada una de ellas simboliza un ejemplar entre todas las aves
                                que existen en el mundo, con sus distintivas características y comportamientos.
                                <br />
                                Pero además de eso, cada imagen representa una fecha, un lugar, una aventura y por
                                supuesto toda una historia, la cual hace parte hoy en día de mis más gratos recuerdos.

                            </Typography>
                        </Typography>
                    </Grid >
                    <Grid item xs={12} md={6}>
                        <Typography sx={{ p: 5, mt: -4 }} >
                            <Typography>

                                Sin lugar a dudas este trabajo, ha sido el resultado de un aprendizaje continuo que
                                incluye no solo el desarrollo de las técnicas más efectivas para la toma de fotos,
                                sino también el estudio e investigación de cada una de las especies que conforman esta
                                colección.
                                <br />

                                Han sido muchos años de experiencias inolvidables que quedaran plasmadas en este Sitio Web
                                con el objeto de que todo aquel que le apasione la naturaleza, termine conociendo,
                                disfrutando y enamorándose de la diversidad de aves que existen en el planeta.
                                Y porque no, practicando este emocionante pasatiempo.
                                <br />
                                <Typography>
                                    <br />
                                    Esta Página es sólo el comienzo de un espacio que pretende recopilar toda la información
                                    posible acerca de aquellas “aves que pasaron por mis ojos” a lo largo de mi vida.
                                    Es mi intención que mis hijos, mis nietos y demás generaciones continúen construyendo esta
                                    auténtica obra que pretende aportar experiencias, e información valiosa a toda la humanidad.

                                    Por último, quiero agradecer a todos aquellos que me han acompañado en estos
                                    fascinantes paseos; especialmente a mi esposa Sara, a mis hijos Enrique, Alan y Jessica
                                    con sus respectivos conyugues, a mis amigos Alfredo y Myriam Barbosa, John y Frida Sanabria,
                                    y a los diferentes pajareros de profesión y guías turísticos que en su momento me
                                    orientaron durante mis inolvidables excursiones y en especial a la desarrolladora de
                                    la página, Melanie Rechter.
                                </Typography>
                            </Typography>
                            <Typography variant='h5' color='primary.dark' sx={{ mt: 2 }} >
                                Atentamente,
                                <br />
                                Moises Sterimberg
                            </Typography>
                        </Typography>
                    </Grid>
                </Grid>

            </Box>
            <Grid sx={{ m: 20, mt: -0.5 }}>

                <Typography variant='body1' color='primary.dark'>
                    <br />
                    <Typography variant='h5' color='primary'>
                        Colaboradores:
                    </Typography >
                    Carlos Betancourt (PAN), Ito Santamaria( BOQ), Danilo Rodriguez (PAN), Luis Paz (PAN), Natalia Escobar (ECU) Jose Castaño (COL), Michael Molina (HUI) , Andrea Beltran (QUIN), Carlos Mario Aranzazu (CALD), Cristian Valencia (CALDS), Jose Puchaina (GUAJ)
                </Typography>
            </Grid>
        </div>
    )
}
