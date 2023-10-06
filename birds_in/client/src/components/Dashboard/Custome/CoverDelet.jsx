import * as React from 'react';
import { Backdrop, Button, Checkbox, CircularProgress, Divider, Grid, IconButton, Snackbar, Typography, useTheme } from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { useSelector, useDispatch } from 'react-redux';
import { getInfoForUpdate } from '../../../redux/actions/createBirds';
import { sendCoverPhoto, sendPhotosDelete } from '../../../redux/actions/DeletCover';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


export const CoverDelet = ({ showUpdateBird, showSearchBird, selectedBird }) => {
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

    const handleSaveAsFeatured = async () => {
        try {
            if (highlightedImage) {
                // Envía el ID y la URL de la imagen destacada con destacada: true
                await dispatch(sendCoverPhoto(highlightedImage.id, infoAveForUpdate.id_ave));
            }
            setSnackbarOpen(true);
            setSnackbarMessage('Imagen destacada guardada con éxito');
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

                // Una vez que obtienes la información, establece loading en false
                setLoading(false);
            } catch (error) {
                // Maneja errores en la obtención de datos
                console.error("Error al obtener los datos:", error);
                // Puedes decidir qué hacer en caso de error, como mostrar un mensaje al usuario.
            }
        };

        // Llama a fetchData al montar el componente
        fetchData();
    }, [dispatch]); // La dependencia dispatch asegura que la función fetchData se vuelva a ejecutar si dispatch cambia

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
            <Grid container spacing={5} sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '80%',
                minWidth: '170vh',
                margin: '0px 0px 0px 150px',
                backgroundColor: theme.palette.secondary.light,
                padding: '0px 40px 30px 0px',
                borderRadius: '0px 0px 20px 20px'
            }} >

                <Grid item sx={12} md={12}>
                    <Typography variant='h5' color='primary.light' sx={{}}>
                        Imágenes Existente
                        <Divider sx={{ my: 1 }} />
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleDeleteButtonClick}
                        sx={{
                            marginTop: '10px',
                            marginBottom: '0px',
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            color: theme.palette.primary.dark,
                            textTransform: 'none',
                        }}
                    >
                        Eliminar seleccionadas
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleSaveAsFeatured}
                        sx={{
                            marginTop: '10px',
                            marginBottom: '0px',
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            textTransform: 'none',
                            color: theme.palette.primary.dark,
                            ml: 4
                        }}
                    >
                        Guardar Portada
                    </Button>
                    <Button
                        sx={{
                            marginBottom: '0px',
                            fontSize: '1.3rem',
                            fontWeight: 'bold',
                            ml: '80%',
                            color: theme.palette.secondary.main,
                        }}
                        variant="outline"
                        onClick={handleReturnSearch}
                        startIcon={<ArrowBackIcon />}
                    >
                        volver
                    </Button>

                    {infoAveForUpdate && infoAveForUpdate.imagenes_aves.length > 0 ? (
                        <Grid container spacing={1}>
                            {infoAveForUpdate.imagenes_aves.map((imageUrl, index) => (
                                <Grid item key={imageUrl.id}>
                                    <div style={{ position: 'relative' }}>
                                        <img
                                            src={imageUrl.url}
                                            alt={`Imagen existente ${index + 1}`}
                                            style={{ maxWidth: '250px', maxHeight: '200px', marginTop: '10px' }}
                                        />
                                        <div >
                                            <Checkbox
                                                color="primary"
                                                onChange={() => handleDeleteCheckBox(imageUrl.id, imageUrl.url)}
                                            />

                                            <IconButton
                                                aria-label="add to favorites"
                                                onClick={() => handleStarClick(imageUrl.id, imageUrl.url)}
                                            >
                                                <StarBorderIcon color={highlightedImage && highlightedImage.id === imageUrl.id ? "primary" : "primary.dark"} />
                                            </IconButton>
                                            {highlightedImage && highlightedImage.id === imageUrl.id && (
                                                <Typography variant="body1" color="primary" sx={{ marginLeft: 1 }}>
                                                    Portada
                                                </Typography>
                                            )}


                                        </div>
                                    </div>
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
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
        </React.Fragment >
    );
};
