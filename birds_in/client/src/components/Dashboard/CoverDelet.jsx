import * as React from 'react';
import { Backdrop, Button, Card, CardActionArea, CardContent, CardMedia, Checkbox, CircularProgress, Dialog, DialogContent, Divider, Grid, IconButton, Snackbar, Typography, useTheme } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { getInfoForUpdate } from '../../redux/actions/createBirds';
import { sendCoverPhoto, sendPhotosDelete } from '../../redux/actions/DeletCover';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
// import { transformWrapper, transformComponent } from 'react-pinch-zoom-pan'
import '../../assets/styles/zoom.css'
import { CarruselGalleryDelet } from '../Galeries/CarruselGalleryDelet';

export const CoverDelet = ({ showUpdateBird, showSearchBird, selectedBird, }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { infoAveForUpdate } = useSelector(state => state.createBird);
    const [showBackdrop, setShowBackdrop] = React.useState(false);
    const [loadingMessage, setLoadingMessage] = React.useState('Cargando...');
    const [selectedImages, setSelectedImages] = React.useState([]);
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    const [highlightedImage, setHighlightedImage] = React.useState(null);
    
    const handleStarClick = (id, url) => {
        setHighlightedImage((prev) => {
            if (prev && prev.id === id) {
                // Deseleccionar la imagen destacada si ya estaba seleccionada
                return null;
            } else {
                // Seleccionar la nueva imagen destacada
                return { id, url };
            }
        });
    };


    const [selectedDialogImage, setSelectedDialogImage] = React.useState('');
    const [dialogOpen, setDialogOpen] = React.useState(false);

    const [isGalleryOpen, setIsGalleryOpen] = React.useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = React.useState('');
    const handleImageClick = (url) => {
        setSelectedImageIndex(url);
        setIsGalleryOpen(true)
    };

    const openImageDialog = (imageUrl) => {
        setSelectedDialogImage(imageUrl);
        setDialogOpen(true);
    };

    const closeImageDialog = () => {
        setDialogOpen(false);
    };

    const handleSaveAsFeatured = async () => {
        try {
            if (highlightedImage) {
                // Envía el ID y la URL de la imagen destacada con destacada: true
                await dispatch(sendCoverPhoto(highlightedImage.id, infoAveForUpdate.id_ave));
            }
            setSnackbarOpen(true);
            setSnackbarMessage('Portada Actual Seleccionada');
        } catch (error) {
            console.error('Error al guardar la imagen destacada:', error);
            setSnackbarOpen(true);
            setSnackbarMessage('Error al guardar la imagen destacada');
        }
    };

    const handleDeleteCheckBox = (id, url) => {
        const index = selectedImages.findIndex((img) => img.id === id);

        if (index === -1) {
            // No existe en el array, agregarlo
            setSelectedImages([...selectedImages, { id, url }]);
        } else {
            // Ya existe en el array, quitarlo
            const newSelectedImages = [...selectedImages];
            newSelectedImages.splice(index, 1);
            setSelectedImages(newSelectedImages);
        }
    };

    const handleDeleteButtonClick = async () => {
        try {
            // Mostrar el indicador de carga
            setShowBackdrop(true);

            // Separar IDs y URLs en arrays diferentes
            const selectedIds = selectedImages.map((img) => img.id);
            const selectedUrls = selectedImages.map((img) => img.url);

            // Realizar la eliminación de fotos
            await dispatch(sendPhotosDelete(selectedIds, selectedUrls));

            // Mostrar Snackbar y obtener información actualizada
            setSnackbarOpen(true);
            setSnackbarMessage('Fotos eliminadas con éxito');
            setSelectedImages([])
            setShowBackdrop(false)
            setLoadingMessage('Borrando fotografías')
            await dispatch(getInfoForUpdate(infoAveForUpdate.id_ave));
        } catch (error) {
            console.error('Error al eliminar fotos:', error);
            setSnackbarOpen(true);
            setSnackbarMessage('Error al eliminar fotos');
        }
    };

    const handleReturnSearch = () => {
        showUpdateBird(false)
        showSearchBird(true)
        selectedBird(null)
    };
    const fetchData = async () => {
        try {
            // Llama a la acción para obtener la información necesaria
            await dispatch(getInfoForUpdate(infoAveForUpdate.id_ave));

            // Verifica si hay una imagen destacada en la información actualizada
            const destacadaImage = infoAveForUpdate.imagenes_aves.find((img) => img.destacada);

            // Inicializa highlightedImage con la imagen destacada si existe
            if (destacadaImage) {
                setHighlightedImage({ id: destacadaImage.id, url: destacadaImage.url });
            }

        } catch (error) {
            // Maneja errores en la obtención de datos
            console.error("Error al obtener los datos:", error);
            // Puedes decidir qué hacer en caso de error, como mostrar un mensaje al usuario.
        }
    };

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                // Llama a la acción para obtener la información necesaria
                await dispatch(getInfoForUpdate(infoAveForUpdate.id_ave));

                // Verifica si hay una imagen destacada en la información actualizada
                const destacadaImage = infoAveForUpdate.imagenes_aves.find((img) => img.destacada);

                // Inicializa highlightedImage con la imagen destacada si existe
                if (destacadaImage) {
                    setHighlightedImage({ id: destacadaImage.id, url: destacadaImage.url });
                }


            } catch (error) {
                // Maneja errores en la obtención de datos
                console.error("Error al obtener los datos:", error);
                // Puedes decidir qué hacer en caso de error, como mostrar un mensaje al usuario.
            }
        };

        // Llama a fetchData al montar el componente
        fetchData();
    }, []); // La dependencia dispatch asegura que la función fetchData se vuelva a ejecutar si dispatch cambia

    return (
        <React.Fragment>
            {/* Muestra el Backdrop mientras se cargan las imágenes */}
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={showBackdrop}
            >
                <>
                    <CircularProgress color="inherit" />
                    <Typography variant="h5" color="inherit" sx={{ ml: 2 }}>
                        {loadingMessage}
                    </Typography>
                </>

            </Backdrop>
            <Grid container spacing={1} sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                minWidth: '200vh',
                margin: 'auto',
                backgroundColor: 'rgba(0, 56, 28, 0.1)', // Establece el fondo transparente deseado
                backdropFilter: 'blur(2px)', // Efecto de desenfoque de fondo
                padding: '0px 40px 60px 10px',
                borderRadius: '20px 20px 20px 20px'
            }} >

                <Grid item xs={12} md={12} sx={{}}>
                    <Button
                        sx={{
                            marginTop: '10px',
                            marginBottom: '0px',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            ml: '75%',
                            color: theme.palette.primary.light,
                            backgroundColor: 'rgba(0, 56, 28, 0.1)', // Establece el fondo transparente deseado
                            backdropFilter: 'blur(2px)', // Efecto de desenfoque de fondo
                        }}
                        variant="outlined"
                        onClick={handleReturnSearch}
                        startIcon={< SearchIcon />}
                    >
                        Buscar Nuevo Registro
                    </Button>
                    <Typography variant='h5' color='primary.light' sx={{}}>
                        Imágenes Existente
                        <Divider sx={{ my: 1 }} />
                    </Typography>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleDeleteButtonClick}
                        endIcon={<DeleteIcon />}
                        sx={{
                            marginTop: '10px',
                            marginBottom: '0px',
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            color: theme.palette.primary.light,
                            textTransform: 'none',
                        }}
                    >
                        Eliminar selección
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSaveAsFeatured}
                        endIcon={<SaveIcon />}
                        sx={{
                            marginTop: '10px',
                            marginBottom: '0px',
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            textTransform: 'none',
                            color: theme.palette.primary.dark,
                            ml: 4,
                            '&:hover': {
                                backgroundColor: theme.palette.primary.dark, // Cambia el color de fondo en hover
                                color: theme.palette.primary.light, // Cambia el color del texto en hover
                                textTransform: 'none',
                            },
                        }}
                    > Guardar Portada
                    </Button>

                    {infoAveForUpdate && infoAveForUpdate.imagenes_aves && infoAveForUpdate.imagenes_aves.length > 0 && (
                        <Grid container spacing={2} sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            m: 0

                        }}>
                            {infoAveForUpdate.imagenes_aves.map((imageUrl, index) => (
                                <Grid item key={imageUrl.id} sx={{ mt: 5, }}>
                                    <Card
                                        sx={{
                                            // maxWidth: 'auto',
                                            minWidth: 380,
                                            // minHeight: 320, // Establece una altura mínima para la tarjeta
                                            maxWidth: 380,
                                            // maxHeight: 320,  
                                            borderRadius: '15px',
                                            flexDirection: 'column', // Alinea el contenido verticalmente
                                            // m: 1,
                                            // mt: 5,
                                            background: 'rgba(0, 78, 55, 0.5)'
                                        }}
                                    >
                                        <CardActionArea onClick={() => handleImageClick(imageUrl.url)}>
                                            <CardMedia
                                                component="img"
                                                alt={`Imagen existente ${index + 1}`}
                                                height="280"
                                                width='420'
                                                image={imageUrl.url}
                                            />

                                        </CardActionArea>

                                        <CardContent sx={{ height: '80px' }}>

                                            <Grid container alignItems="center" spacing={1}>
                                                <Grid item xs={10}>
                                                    <Typography variant="h5" color="white">
                                                        {imageUrl.titulo}
                                                    </Typography>
                                                    <IconButton
                                                        aria-label="add to favorites"
                                                        onClick={() => handleStarClick(imageUrl.id, imageUrl.url)}
                                                        sx={{ position: 'absolute', height: '30px', mt: -3, ml: '40%' }}
                                                    >
                                                        {highlightedImage && highlightedImage.url === imageUrl.url && (
                                                            <Typography variant="h4" color="primary" sx={{ mr: 1, ml: 1, }}>
                                                                Portada Actual
                                                            </Typography>
                                                        )}
                                                        <CheckCircleIcon
                                                            color={highlightedImage && highlightedImage.url === imageUrl.url ? "primary" : "primary.dark"}
                                                            sx={{}}
                                                        />
                                                    </IconButton>
                                                </Grid>

                                                <Grid item xs={2}>
                                                    <Checkbox
                                                        color="primary"
                                                        onChange={() => handleDeleteCheckBox(imageUrl.id, imageUrl.url)}
                                                        sx={{
                                                            position: 'absolute', left: '85%', mt: -3,
                                                        }}
                                                    />
                                                    {/* <DeleteIcon color='secondary' sx={{ position: 'absolute', mt: 1.5, left: '90%', fontSize: 'medium' }} /> */}
                                                    <Typography variant="h4" sx={{ position: 'absolute', mt: 1, left: '83%', fontSize: 'medium', mb: 1 }} color='secondary'>
                                                        Eliminar
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                            <CarruselGalleryDelet
                                isOpen={isGalleryOpen}
                                images={infoAveForUpdate.imagenes_aves}
                                selectedIndex={selectedImageIndex}
                                onClose={() => setIsGalleryOpen(false)}
                            />
                        </Grid>
                    )}
                    {!infoAveForUpdate || !infoAveForUpdate.imagenes_aves || infoAveForUpdate.imagenes_aves.length === 0 && (
                        <Typography variant='body1' color='primary.light' sx={{ marginTop: '10px' }}>
                            No hay imágenes subidas.
                        </Typography>
                    )}
                </Grid>
            </Grid>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
            />
            <Dialog
                open={dialogOpen}
                onClose={closeImageDialog}
                fullWidth
                maxWidth="md">
                <DialogContent sx={{}}>
                    <img
                        src={selectedDialogImage}
                        alt="Imagen en diálogo"
                        style={{ maxWidth: '100%' }}
                    // className={`zoomed-image ${zoomed ? 'zoomed' : ''}`}
                    />
                </DialogContent>
            </Dialog>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
            />
        </React.Fragment>
    );
};
