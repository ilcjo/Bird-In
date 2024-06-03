import * as React from 'react'
import { Box, Card, CardActionArea, CardContent, Checkbox, Grid, IconButton, Typography } from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BeenhereIcon from '@mui/icons-material/Beenhere';

export const EditImageCards = ({ imageUrl, index, handleImageClick, handleSetAsCover, handleDeleteCheckBox }) => {
    console.log(imageUrl)
    return (
        <Card sx={{
            borderRadius: '6px', 
            width: 380, minWidth: 400, margin: 0, 
            flexDirection: 'column',
            background: 'linear-gradient(to top, rgba(0,56,28,0.5), transparent)' 
        }}>
            <CardActionArea
                sx={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center',  }}
                onClick={() => handleImageClick(imageUrl.url)}>
                <IconButton
                    aria-label="set as cover"
                    onClick={(e) => { e.stopPropagation(); handleSetAsCover(imageUrl.id, imageUrl.url, imageUrl.destacada); }}
                    sx={{ position: 'absolute', top: 5, right: 30, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                >
                    {
                        imageUrl.destacada === true ? (
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    background: 'linear-gradient(to top, rgba(0,56,28,0.50), transparent)', // Establece el fondo transparente deseado
                                    // backdr6opFilter: 'blur(5px)',
                                    borderRadius: ' 0px 0px 30px 30px',
                                }}
                            >
                                <Typography variant="h4" color='primary' sx={{ mb: 0.5, color: 'white', m:0.5 }}>
                                    Portada
                                </Typography>
                                <BeenhereIcon fontSize='medium' sx={{ mb: 0.5, color: 'yellow' }} />
                            </Box>
                        ) : (
                            <BookmarkIcon color="secondary" fontSize='medium' />
                        )
                    }
                </IconButton>
                <img
                    src={imageUrl.url}
                    alt={`Imagen existente ${index + 1}`}
                    style={{ height: 290, objectFit: 'scale-down', }}
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
