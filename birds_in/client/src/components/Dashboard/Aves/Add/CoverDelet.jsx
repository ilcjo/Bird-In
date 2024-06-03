import * as React from 'react';
import { Alert, Backdrop, Button, Card, CardActionArea, CardContent, CardMedia, Checkbox, CircularProgress, Dialog, DialogContent, Divider, Grid, IconButton, Snackbar, Typography, useTheme } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import '../../../../assets/styles/zoom.css'
//GLOBAL STATE
import { getInfoForUpdate } from '../../../../redux/actions/createBirds';
import { sendCoverPhoto, sendPhotosDelete } from '../../../../redux/actions/DeletCover';
//ICONS
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SearchIcon from '@mui/icons-material/Search';
//COMPONENTS
import { CarruselGalleryDelet } from '../../../Galeries/Aves/CarruselGalleryDelet';
import { Loading } from '../../../utils/Loading';
import { EditImageCards } from '../../../Cards/EditImageCards';

export const CoverDelet = ({
    showUpdateBird,
    showSearchBird,
    selectedBird, }) => {

    const theme = useTheme();
    const dispatch = useDispatch();
    const { infoAveForUpdate } = useSelector(state => state.createBird);
    const [selectedImages, setSelectedImages] = React.useState([]);
    const [highlightedImage, setHighlightedImage] = React.useState(null);
    const [showBackdrop, setShowBackdrop] = React.useState(false);
    const [loadingMessage, setLoadingMessage] = React.useState('Cargando...');
    const [errorSnackbarOpen, setErrorSnackbarOpen] = React.useState(false);
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    const [errorMessage, setErrorMessage] = React.useState(null);

    const handleSetAsCover = async (id, url, destacada) => {
        // console.log(id)
        try {
            // Marcar la imagen como portada actual
            setHighlightedImage((prev) => {

                // Deseleccionar la imagen destacada si ya estaba seleccionada
                if (prev && prev.id === id) {
                    return null;
                } else {
                    // Seleccionar la nueva imagen destacada
                    return { id, url };
                }
            });
            // Si la imagen es destacada, enviar la solicitud para guardarla como portada
            await dispatch(sendCoverPhoto(id, infoAveForUpdate.id_ave));
            setShowBackdrop(true);
            setLoadingMessage('Seleccionando Portada')
            await new Promise((resolve) => setTimeout(resolve, 5000));
            await dispatch(getInfoForUpdate(infoAveForUpdate.id_ave));
            setShowBackdrop(false);
            setSnackbarOpen(true);
            setSnackbarMessage('Portada Actual Seleccionada');
        } catch (error) {
            console.error('Error al realizar la acción:', error);
            setErrorMessage(`Error al realizar la acción: ${error.message}`);
            setErrorSnackbarOpen(true);
        }
    };

    const [selectedDialogImage, setSelectedDialogImage] = React.useState('');
    const [dialogOpen, setDialogOpen] = React.useState(false);

    const [isGalleryOpen, setIsGalleryOpen] = React.useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = React.useState('');
    const handleImageClick = (url) => {
        setSelectedImageIndex(url);
        setIsGalleryOpen(true)
    };

    const closeImageDialog = () => {
        setDialogOpen(false);

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
            setLoadingMessage('Borrando fotografías')
            // Separar IDs y URLs en arrays diferentes
            const selectedIds = selectedImages.map((img) => img.id);
            const selectedUrls = selectedImages.map((img) => img.url);
            // Realizar la eliminación de fotos
            await dispatch(sendPhotosDelete(selectedIds, selectedUrls));
            // Mostrar Snackbar y obtener información actualizada
            setSnackbarMessage('Fotografías Eliminadas con éxito');
            setSelectedImages([])
            setShowBackdrop(false)
            setSnackbarOpen(true);
            await dispatch(getInfoForUpdate(infoAveForUpdate.id_ave));
        } catch (error) {
            console.error('Error al eliminar fotos:', error);
            setErrorMessage(`Error al eliminar las fotografías: ${error.message}`);
            setErrorSnackbarOpen(true);
        } finally {
            setShowBackdrop(false);
        }
    };

    const handleReturnSearch = () => {
        showUpdateBird(false)
        showSearchBird(true)
        selectedBird(null)
    };

    return (
        <React.Fragment>
            <Loading
                message={loadingMessage}
                open={showBackdrop}
            />
            <Grid container spacing={5} sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                minWidth: '1200px',
                margin: '0 auto',
                backgroundColor: 'rgba(0, 56, 28, 0.1)',
                backdropFilter: 'blur(2px)',
                padding: '0px 40px 30px 0px',
                borderRadius: '0px 0px 20px 20px'
            }}>
                <Grid item xs={12} md={12}>
                    <Grid container alignItems="center">
                        <Grid item xs={12} sm={9}>
                            <Typography variant='h2' color='primary'>
                                Imágenes del Ave
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={3} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <Button
                                sx={{
                                    fontSize: '1.1rem',
                                    fontWeight: 'bold',
                                    backgroundColor: 'rgba(0, 56, 28, 0.1)',
                                    backdropFilter: 'blur(2px)',
                                }}
                                variant="outlined"
                                onClick={handleReturnSearch}
                                startIcon={<SearchIcon />}
                            >
                                Buscar Otro Registro
                            </Button>
                        </Grid>
                    </Grid>
                
                
                    <Typography variant='h5' color='primary.light' sx={{ mt: 2 }}>
                        Elegir Portada o Eliminar Imágenes
                    </Typography>
                    <Divider sx={{ my: 2, borderColor: 'primary.main' }} />
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDeleteButtonClick}
                        endIcon={<DeleteIcon />}
                        sx={{ mt: 0, mb: 2, color: 'primary.light' }}
                    >
                        Eliminar selección
                    </Button>
                    <Grid container>
                        {infoAveForUpdate?.imagenes_aves?.length > 0 ? (
                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(3, minmax(380px, 1fr))',
                                    gap: 5,
                                    width: '100%',
                                    mt: 2
                                }}
                            >
                                {infoAveForUpdate.imagenes_aves.map((image, index) => (
                                    <EditImageCards
                                        key={image.id}
                                        imageUrl={image.url}
                                        index={index}
                                        handleImageClick={handleImageClick}
                                        handleSetAsCover={handleSetAsCover}
                                        handleDeleteCheckBox={handleDeleteCheckBox}
                                    />
                                ))}
                            </Box>
                        ) : (
                            <Typography variant='body1' color='primary.light' sx={{ marginTop: '10px' }}>
                                No hay imágenes subidas.
                            </Typography>
                        )}
                    </Grid>
                </Grid>
            </Grid>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={9000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
            />
            <Snackbar
                open={errorSnackbarOpen}
                autoHideDuration={9000}
                onClose={() => setErrorSnackbarOpen(false)}
            >
                <Alert
                    elevation={6}
                    variant="filled"
                    severity="error"
                    onClose={() => setErrorSnackbarOpen(false)}
                >
                    {errorMessage}
                </Alert>
            </Snackbar>
            <Dialog
                open={dialogOpen}
                onClose={closeImageDialog}
                fullWidth
                maxWidth="md"
            >
                <DialogContent>
                    <img
                        src={selectedDialogImage}
                        alt="Imagen en diálogo"
                        style={{ maxWidth: '100%' }}
                    />
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
};
// <CarruselGalleryDelet
//     isOpen={isGalleryOpen}
//     images={infoAveForUpdate.imagenes_aves}
//     selectedIndex={selectedImageIndex}
//     onClose={() => setIsGalleryOpen(false)}
// />