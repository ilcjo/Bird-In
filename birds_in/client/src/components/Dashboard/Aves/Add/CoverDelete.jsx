import * as React from 'react';
import { Alert, Button, Divider, Grid, Snackbar, Typography, useTheme } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import '../../../../assets/styles/zoom.css'
//GLOBAL STATE
import { getInfoForUpdate } from '../../../../redux/actions/createBirds';
import { sendCoverPhoto, sendPhotosDelete } from '../../../../redux/actions/DeletCover';
//ICONS
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
//COMPONENTS
import { CarruselGalleryDelet } from '../../../Galeries/Aves/CarruselGalleryDelet';
import { Loading } from '../../../utils/Loading';
import { EditImageCards } from '../../../Cards/EditImageCards';
import { getAve } from '../../../../redux/slices/createSlice';

export const CoverDelete = ({
    isCreate,
    showUpdateBird,
    showSearchBird,
    selectedBird, }) => {
// console.log(isCreate)
    const theme = useTheme();
    const dispatch = useDispatch();
    const nombreAve = localStorage.getItem('nombreIngles') || 'del Ave';
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

    const [isGalleryOpen, setIsGalleryOpen] = React.useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = React.useState('');


    const handleImageClick = (url) => {
        // console.log('dentro del handleimage:', url)
        setShowBackdrop(false);
        setLoadingMessage('Cargando..')
        setSelectedImageIndex(url); // Establecer la URL de la imagen seleccionada
        setIsGalleryOpen(true);
    };

    const handleCloseGallery = () => {
        setSelectedImageIndex(null); // Restablecer el estado de la imagen seleccionada
        setIsGalleryOpen(false);
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
            setLoadingMessage('Borrando Fotografías Seleccionadas')
            // Separar IDs y URLs en arrays diferentes
            const selectedIds = selectedImages.map((img) => img.id);
            const selectedUrls = selectedImages.map((img) => img.url);
            // Realizar la eliminación de fotos
            await dispatch(sendPhotosDelete(selectedIds, selectedUrls));
            // Mostrar Snackbar y obtener información actualizada
            await dispatch(getInfoForUpdate(infoAveForUpdate.id_ave));
            setSnackbarMessage('Fotografías Eliminadas con éxito');
            setSelectedImages([])
            setShowBackdrop(false)
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error al eliminar fotos:', error);
            setErrorMessage(`Error al eliminar las fotografías: ${error.message}`);
            setErrorSnackbarOpen(true);
        } finally {
            setShowBackdrop(false);
        }
    };

    const handleReturnSearch = () => {
        localStorage.removeItem('nombreIngles')
        showUpdateBird(false)
        showSearchBird(true)
        selectedBird(null)
    };

    React.useEffect(() => {
        if (isCreate) {
            setSelectedImages([]);
            dispatch(getAve({}))
            // localStorage.removeItem('nombreIngles')
        }
    }, [isCreate])

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
                                Imágenes {nombreAve ? ` ${nombreAve}` : 'del Ave'}
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
                    {infoAveForUpdate && infoAveForUpdate.imagenes_aves && infoAveForUpdate.imagenes_aves.length > 0 && (
                        <Grid container spacing={2} sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            m: 0
                        }}>
                            {infoAveForUpdate.imagenes_aves.map((imageUrl, index) => (
                                <Grid item key={imageUrl.id} sx={{ mt: 5 }}>
                                    <EditImageCards
                                        imageUrl={imageUrl}
                                        index={index}
                                        handleImageClick={handleImageClick}
                                        handleSetAsCover={handleSetAsCover}
                                        handleDeleteCheckBox={handleDeleteCheckBox}
                                    />
                                </Grid>
                            ))}
                            <CarruselGalleryDelet
                                isOpen={isGalleryOpen}
                                images={infoAveForUpdate.imagenes_aves}
                                selectedIndex={selectedImageIndex}
                                onClose={handleCloseGallery}
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
        </React.Fragment>
    );
}