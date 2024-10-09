import * as React from 'react'
import { Box, Card, CardActionArea, CardContent, Checkbox, Grid, IconButton, Typography } from '@mui/material';
import BeenhereTwoToneIcon from '@mui/icons-material/BeenhereTwoTone';
import TurnedInTwoToneIcon from '@mui/icons-material/TurnedInTwoTone';

export const EditImageCardsP = ({ imageUrl, index, handleImageClick, handleSetAsCover, handleDeleteCheckBox }) => {
    // console.log(imageUrl)
    return (
        <Card sx={{
            borderRadius: '6px',
            p: '0 auto',
            width: 439, minWidth: 439, margin: '10px 5px',
            flexDirection: 'column',
            background: 'linear-gradient(to top, rgba(0,56,28,0.5), transparent)',
           
        }}>
            <CardActionArea
                sx={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', }}
                onClick={() => handleImageClick(imageUrl.url)}>
                <IconButton
                    aria-label="set as cover"
                    onClick={(e) => { e.stopPropagation(); handleSetAsCover(imageUrl.id, imageUrl.url, imageUrl.destacada); }}
                    sx={{ position: 'absolute', top: 5, left: 30, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                >
                    {
                        imageUrl.destacada === true ? (
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    background: 'linear-gradient(to top, rgba(0,56,28,0.50), transparent)', // Establece el fondo transparente deseado
                                    // backdropFilter: 'blur(5px)',
                                    borderRadius: ' 0px 0px 30px 30px',
                                }}
                            >
                                <Typography variant="h4" color='primary' sx={{ mb: 0.5, color: 'white', m: 0.5 }}>
                                    Portada
                                </Typography>
                                <BeenhereTwoToneIcon fontSize="large" sx={{ mb: 0.5, color: 'yellow', }} />
                            </Box>
                        ) : (
                            <TurnedInTwoToneIcon color="primary" fontSize="large" sx={{ mb: 0.5, color: 'orange', }} />
                        )
                    }
                </IconButton>
                <img
                    src={imageUrl.url}
                    alt={`Imagen existente ${index + 1}`}
                    style={{ height: 290 }}
                    loading="lazy"
                />

            </CardActionArea>
            <CardContent sx={{ height: 'auto', }}>
                <Grid container alignItems="center" spacing={1}>
                    <Grid item xs={9}>
                        <Typography variant="h6" color="white">
                            {imageUrl.titulo}
                        </Typography>

                    </Grid>
                    <Grid item xs={3}>

                        <Checkbox
                            color="error"
                            onChange={() => handleDeleteCheckBox(imageUrl.id, imageUrl.url)}
                            sx={{ position: 'absolute', left: '85%', mt: -3 }}
                        />
                        <Typography variant="h4" sx={{ position: 'absolute', mt: 1, left: '83%', fontSize: 'medium', mb: 1 }} color='error'>
                            Eliminar
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>

    );
};
