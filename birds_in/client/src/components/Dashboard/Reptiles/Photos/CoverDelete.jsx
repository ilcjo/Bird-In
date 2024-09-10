import * as React from 'react';
import { Alert, Button, Divider, Grid, Snackbar, Typography, useTheme } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import '../../../../assets/styles/zoom.css'

//ICONS
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
//COMPONENTS
import { CarruselGalleryDelete } from '../../../Gallery/CarruselGalleryDelete';
import { Loading } from '../../../utils/Loading';
import { EditImageCards } from '../../../Cards/EditImageCards';
//redux
import { sendCoverPhoto, sendPhotosDelete } from '../../../../redux/reptiles/actions/photosAction';
import { getInfoForUpdate } from '../../../../redux/reptiles/actions/crudAction';
import { getRegistro } from '../../../../redux/reptiles/slices/UpdateSlice';

export const CoverDelete = ({
    isCreate,
    showUpdate,
    showSearch,
    selected,
    setCoverSelected,
}) => {

    const theme = useTheme();
    const dispatch = useDispatch();
    const nombre = localStorage.getItem('nombreIngles') || 'del Registro ';
    const { infoForUpdate } = useSelector(state => state.updateReptil);
    const [selectedImages, setSelectedImages] = React.useState([]);
    const [highlightedImage, setHighlightedImage] = React.useState(null);
    const [showBackdrop, setShowBackdrop] = React.useState(false);
    const [loadingMessage, setLoadingMessage] = React.useState('Cargando...');
    const [errorSnackbarOpen, setErrorSnackbarOpen] = React.useState(false);
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState(null);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');

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
            await dispatch(sendCoverPhoto(id, infoForUpdate.id_reptil));
            setShowBackdrop(true);
            setLoadingMessage('Seleccionando Portada')
            await new Promise((resolve) => setTimeout(resolve, 5000));
            await dispatch(getInfoForUpdate(infoForUpdate.id_reptil));
            setShowBackdrop(false);
            setSnackbarOpen(true);
            setSnackbarMessage('Portada Actual Seleccionada');
            if (setCoverSelected) {
                setCoverSelected(true);
            }
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
            console.log(selectedIds, selectedUrls)
            await dispatch(sendPhotosDelete(selectedIds, selectedUrls));
            // Mostrar Snackbar y obtener información actualizada
            await dispatch(getInfoForUpdate(infoForUpdate.id_reptil));
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
        showUpdate(false)
        showSearch(true)
        selected(null)
    };

    React.useEffect(() => {
        if (isCreate) {
            setSelectedImages([]);
            dispatch(getRegistro({}))
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
                borderRadius: '0px 0px 20px 20px',
                mb: 10,
            }}>
                <Grid item xs={12} md={12}>
                    <Grid container alignItems="center">
                        <Grid item xs={12} sm={9}>
                            <Typography variant='h2' color='primary'>
                                Imágenes {nombre ? ` ${nombre}` : 'del Registro '}
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
                    <Divider sx={{ my: 2, borderColor: theme.palette.primary.main, }} />
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDeleteButtonClick}
                        endIcon={<DeleteIcon />}
                        sx={{ mt: 0, mb: 2, color: 'primary.light' }}
                    >
                        Eliminar selección
                    </Button>
                    {infoForUpdate && infoForUpdate.imagenes_reptiles && infoForUpdate.imagenes_reptiles.length > 0 && (
                        <Grid container spacing={2} sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            m: 0
                        }}>
                            {infoForUpdate.imagenes_reptiles.map((imageUrl, index) => (
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
                            <CarruselGalleryDelete
                                isOpen={isGalleryOpen}
                                images={infoForUpdate.imagenes_reptiles}
                                selectedIndex={selectedImageIndex}
                                onClose={handleCloseGallery}
                            />
                        </Grid>
                    )}
                    {!infoForUpdate || !infoForUpdate.imagenes_reptiles || infoForUpdate.imagenes_reptiles.length === 0 && (
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