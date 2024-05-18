import * as React from 'react'
import { Card, CardActionArea, CardContent, Checkbox, Grid, IconButton, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export const EditImageCards = ({ imageUrl, index, handleImageClick, handleSetAsCover, handleDeleteCheckBox }) => {
    return (

        <Card sx={{
            borderRadius: '15px', width: 380, margin: 0, flexDirection: 'column', background: 'rgba(0, 78, 55, 0.5)',

        }}>
            <CardActionArea
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: 400, height: 290 }}
                onClick={() => handleImageClick(imageUrl.url)}>
                <img
                    src={imageUrl.url}
                    alt={`Imagen existente ${index + 1}`}
                    style={{ height: 290, objectFit: 'scale-down', borderRadius: '15px', }}
                    loading="lazy"
                />
            </CardActionArea>
            <CardContent sx={{ height: '80px' }}>
                <Grid container alignItems="center" spacing={1}>
                    <Grid item xs={8}>
                        <Typography variant="h5" color="white">
                            {imageUrl.titulo}
                        </Typography>

                    </Grid>
                    <Grid item xs={4}>
                        <IconButton
                            aria-label="add to favorites"
                            onClick={() => handleSetAsCover(imageUrl.id, imageUrl.url, imageUrl.destacada)}
                            sx={{ position: 'absolute', height: '30px', }}
                        >
                            {imageUrl.destacada && (
                                <Typography variant="h4" color="primary" sx={{ mr: 1, ml: 1 }}>
                                    Portada Actual
                                </Typography>
                            )}
                            <CheckCircleIcon color={imageUrl.destacada ? "primary" : "primary.dark"} />
                        </IconButton>
                        <Checkbox
                            color="primary"
                            onChange={() => handleDeleteCheckBox(imageUrl.id, imageUrl.url)}
                            sx={{ position: 'absolute', left: '85%', mt: -3 }}
                        />
                        <Typography variant="h4" sx={{ position: 'absolute', mt: 1, left: '83%', fontSize: 'medium', mb: 1 }} color='secondary'>
                            Eliminar
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>

    );
};
