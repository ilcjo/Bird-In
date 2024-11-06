import * as React from 'react';
import { Box, Card, CardActionArea, CardContent, Checkbox, Grid, IconButton, Typography } from '@mui/material';
import BeenhereTwoToneIcon from '@mui/icons-material/BeenhereTwoTone';
import TurnedInTwoToneIcon from '@mui/icons-material/TurnedInTwoTone';
import { useDrag, useDrop } from 'react-dnd';

export const PhotosOrganize = ({ imageUrl, index, moveImage, handleImageClick, handleSetAsCover, handleDeleteCheckBox }) => {
    const ref = React.useRef(null);
    const [isHorizontal, setIsHorizontal] = React.useState(false);

    // Check if image is horizontal or vertical
    React.useEffect(() => {
        const img = new Image();
        img.src = imageUrl.url;
        img.onload = () => {
            setIsHorizontal(img.width > img.height);
        };
    }, [imageUrl.url]);

    const [, drop] = useDrop({
        accept: 'image',
        hover(item) {
            if (item.index !== index) {
                moveImage(item.index, index);
                item.index = index;
            }
        },
    });

    const [{ isDragging }, drag] = useDrag({
        type: 'image',
        item: { id: imageUrl.id, index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    drag(drop(ref));

    return (
        <Grid ref={ref} item sx={{ opacity: isDragging ? 0.5 : 1, mt: 5 }}>
            <Card sx={{
                borderRadius: '6px',
                p: '0 auto',
                width: { xs: 450, sm: 450, md: 440, lg: 490, }, minWidth: { xs: 490, sm: 460, md: 440, lg: 490, }, margin: '0px 0px',
                flexDirection: 'column',
                background: 'linear-gradient(to top, rgba(0,56,28,0.5), transparent)',
            }}>
                <CardActionArea
                    sx={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    onClick={() => handleImageClick(imageUrl.url)}
                >
                    <IconButton
                        aria-label="set as cover"
                        onClick={(e) => { e.stopPropagation(); handleSetAsCover(imageUrl.id, imageUrl.url, imageUrl.destacada); }}
                        sx={{ position: 'absolute', top: 5, left: 30, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                    >
                        {imageUrl.destacada ? (
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                background: 'linear-gradient(to top, rgba(0,56,28,0.50), transparent)',
                                borderRadius: '0px 0px 30px 30px',
                            }}>
                                <Typography variant="h4" color='primary' sx={{ mb: 0.5, color: 'white', m: 0.5 }}>Portada</Typography>
                                <BeenhereTwoToneIcon fontSize="large" sx={{ mb: 0.5, color: 'yellow' }} />
                            </Box>
                        ) : (
                            <TurnedInTwoToneIcon color="primary" fontSize="large" sx={{ mb: 0.5, color: 'orange' }} />
                        )}
                    </IconButton>
                    <img
                        src={imageUrl.url}
                        alt={`Imagen no cargada ${index + 1}`}
                        style={{
                            height: 290,
                            objectFit: isHorizontal ? 'scale-down' : 'scale-down', // Cambia el estilo basado en la orientación
                            width: '100%',
                        }}
                        loading="lazy"
                    />
                </CardActionArea>
                <CardContent sx={{ height: 'auto' }}>
                    <Grid container alignItems="center" spacing={1}>
                        <Grid item xs={9}>
                            <Typography variant="h6" color="white">{imageUrl.titulo}</Typography>
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
        </Grid>
    );
};
