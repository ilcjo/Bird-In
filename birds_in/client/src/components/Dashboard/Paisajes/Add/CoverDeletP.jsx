import * as React from 'react';
import { Alert, Backdrop, Box, Button, Card, CardActionArea, CardContent, CardMedia, Checkbox, CircularProgress, Dialog, DialogContent, Divider, Grid, IconButton, Snackbar, Typography, useTheme } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import '../../../../assets/styles/zoom.css'
//GLOBAL STATE
import { getInfoForUpdatePa } from '../../../../redux/paisaje/actionsP/createLands';
import { sendCoverPhotoP, sendPhotosDeleteP } from '../../../../redux/paisaje/actionsP/DeletCoverPaisaje';
//ICONS
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SearchIcon from '@mui/icons-material/Search';
//COMPONENTS
import { CarruselGalleryDelet } from '../../../Galeries/Aves/CarruselGalleryDelet';
import { EditImageCards } from '../../../Cards/EditImageCards';
import { Loading } from '../../../utils/Loading';

export const CoverDeletP = ({
    isCreate,
    showUpdateRegister,
    showSearchRegister,
    selectedRegister, }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { infoLandForUpdate } = useSelector(state => state.createLand);
    // console.log('soy info q actulizo', infoLandForUpdate)
    const [selectedImages, setSelectedImages] = React.useState([]);
    const [highlightedImage, setHighlightedImage] = React.useState(null);
    const [showBackdrop, setShowBackdrop] = React.useState(false);
    const [loadingMessage, setLoadingMessage] = React.useState('Cargando...');
    const [errorSnackbarOpen, setErrorSnackbarOpen] = React.useState(false);
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState(null);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    // console.log(selectedImages)


    const handleSetAsCover = async (id, url, destacada) => {

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
            await dispatch(sendCoverPhotoP(id, infoLandForUpdate.id));
            setShowBackdrop(true);
            setLoadingMessage('Seleccionando Portada')
            await new Promise((resolve) => setTimeout(resolve, 5000));
            await dispatch(getInfoForUpdatePa(infoLandForUpdate.id));
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
    const [selectedImageIndex, setSelectedImageIndex] = React.useState('')
        ;
    const handleImageClick = (url) => {
        setSelectedImageIndex(url);
        setIsGalleryOpen(true)
    };

    const closeImageDialog = () => {
        setDialogOpen(false);
    };

    const handleDeleteCheckBox = (id, url) => {
        // console.log('soy', url)
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
            console.log('imagenes url', selectedUrls)
            // Realizar la eliminación de fotos
            await dispatch(sendPhotosDeleteP(selectedIds, selectedUrls));
            // Mostrar Snackbar y obtener información actualizada
            setSnackbarMessage('Fotografías Eliminadas con éxito');
            setSelectedImages([])
            setShowBackdrop(false)
            setSnackbarOpen(true);
            await dispatch(getInfoForUpdatePa(infoLandForUpdate.id));
        } catch (error) {
            console.error('Error al eliminar fotos:', error);
            setErrorMessage(`Error al eliminar las fotografías: ${error.message}`);
            setErrorSnackbarOpen(true);
        } finally {
            setShowBackdrop(false);
        }
    };

    const handleReturnSearch = () => {
        showUpdateRegister(false)
        showSearchRegister(true)
        selectedRegister(null)
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
                minWidth: '800px',
                margin: '0 auto',
                backgroundColor: 'rgba(0, 56, 28, 0.1)', // Establece el fondo transparente deseado
                backdropFilter: 'blur(8px)', // Efecto de desenfoque de fondo
                padding: '0px 40px 30px 0px',
                borderRadius: '0px 0px 20px 20px'
            }} >

                <Grid item xs={12} md={12} >
                    <Grid container alignItems="center">
                        <Grid item xs={12} sm={9}>
                            <Typography variant='h2' color='primary' >
                                Imágenes del Paisaje
                            </Typography>
                        </Grid>
                        {!isCreate && (
                            <Grid item xs={12} sm={3} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} >
                                <Button
                                    sx={{
                                        fontSize: '1.1rem',
                                        fontWeight: 'bold',
                                        // color: theme.palette.primary.light,
                                        backgroundColor: 'rgba(0, 56, 28, 0.1)', // Establece el fondo transparente deseado
                                        backdropFilter: 'blur(2px)', // Efecto de desenfoque de fondo
                                    }}
                                    variant="outlined"
                                    onClick={handleReturnSearch}
                                    startIcon={<SearchIcon />}
                                >
                                    Buscar Otro Registro
                                </Button>
                            </Grid>
                        )}
                    </Grid>

                    <Typography variant='h5' color='primary.light' sx={{ mt: 2 }} >
                        Elegir Portada o Eliminar Imágenes
                        <Divider sx={{ my: 2, borderColor: theme.palette.primary.main, }} />
                    </Typography>

                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDeleteButtonClick}
                        endIcon={<DeleteIcon />}
                        sx={{
                            mt: 0,
                            mb: 2,
                            color: theme.palette.primary.light,
                        }}
                    >
                        Eliminar selección
                    </Button>

                    <Grid container>
                        {infoLandForUpdate?.imagenes_paisajes?.length > 0 ? (
                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(3, minmax(380px, 1fr))',
                                    gap: 5,
                                    width: '100%',
                                    mt: 2
                                }}
                            >
                                {infoLandForUpdate.imagenes_paisajes.map((imageUrl, index) => (
                                    <EditImageCards
                                        key={imageUrl.id}
                                        imageUrl={imageUrl}
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
        </React.Fragment >
    );
};
