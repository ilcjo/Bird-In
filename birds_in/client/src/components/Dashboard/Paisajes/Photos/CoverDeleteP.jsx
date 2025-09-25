import * as React from 'react';
import { Alert, Box, Button, Divider, Grid, Snackbar, Typography, useTheme } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import '../../../../assets/styles/zoom.css'
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
//GLOBAL STATE
import { getInfoForUpdatePa, saveOrderPhotos } from '../../../../redux/paisaje/actionsP/createLands';
import { sendCoverPhotoP, sendPhotosDeleteP } from '../../../../redux/paisaje/actionsP/DeletCoverPaisaje';
//ICONS
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
//COMPONENTS
import { CarruselGalleryDelete } from '../../../Gallery/CarruselGalleryDelete';
import { Loading } from '../../../utils/Loading';
import { getLand } from '../../../../redux/paisaje/slicesP/createLandSlice';
import { EditImageCardsP } from '../../../Cards/Paisaje/EditImageCardsP';
import ImageDragContainer from './ImageDragContainer';
import PhotosOrganizerContainer from './PhotosOrganizerContainer';

export const CoverDeleteP = ({
    isCreate,
    showUpdateRegister,
    showSearchRegister,
    selectedRegister,
    setCoverSelected,
}) => {
    const organizerRef = React.useRef(null);
    const inputRefs = React.useRef({});
    const theme = useTheme();
    const dispatch = useDispatch();
    const nombreP = localStorage.getItem('nombrePaisaje') || 'del Paisaje';
    const { infoLandForUpdate } = useSelector(state => state.createLand);
    // console.log('soy info q actualizo', infoLandForUpdate)
    const [selectedImages, setSelectedImages] = React.useState([]);
    const [highlightedImage, setHighlightedImage] = React.useState(null);
    const [showBackdrop, setShowBackdrop] = React.useState(false);
    const [loadingMessage, setLoadingMessage] = React.useState('Cargando...');
    const [errorSnackbarOpen, setErrorSnackbarOpen] = React.useState(false);
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState(null);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    const [isGalleryOpen, setIsGalleryOpen] = React.useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = React.useState('');
    // console.log(selectedImages)

    const handleSetAsCover = async (id, url, destacada) => {
        // console.log(id, url)
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
            if (setCoverSelected) {
                setCoverSelected(true);
            }
        } catch (error) {
            console.error('Error al realizar la acción:', error);
            setErrorMessage(`Error al realizar la acción: ${error.message}`);
            setErrorSnackbarOpen(true);
        }
    };

    const handleImageClick = (url) => {
        setShowBackdrop(false);
        setLoadingMessage('Cargando..')
        setSelectedImageIndex(url);
        setIsGalleryOpen(true)
    };

    const handleCloseGallery = () => {
        setSelectedImageIndex(null); // Restablecer el estado de la imagen seleccionada
        setIsGalleryOpen(false);
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
            setLoadingMessage('Borrando Fotografías Seleccionadas')
            // 1️⃣ Obtener imágenes ordenadas del hijo
            const currentImages = organizerRef.current.getCurrentImages();
            console.log("📦 Imágenes actuales desde el hijo:", currentImages);
            // 2️⃣ Filtra y reordena
            const selectedIds = selectedImages.map((img) => img.id);
            const selectedUrls = selectedImages.map((img) => img.url);
            // console.log('imagenes url', selectedUrls)
            const updatedImages = currentImages
                .filter((img) => !selectedIds.includes(img.id))
                .map((img, index) => ({
                    ...img,
                    orden_imagen: index + 1
                }));

            // 3️⃣ Guarda orden actualizado
            await saveOrderToDB(updatedImages);
            // Realizar la eliminación de fotos
            await dispatch(sendPhotosDeleteP(selectedIds, selectedUrls));
            // Mostrar Snackbar y obtener información actualizada
            await dispatch(getInfoForUpdatePa(infoLandForUpdate.id));
            setImages(updatedImages);
            setSelectedImages([])
            setSnackbarMessage('Fotografías Eliminadas con éxito');
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
        localStorage.removeItem('nombrePaisaje')
        showUpdateRegister(false)
        showSearchRegister(true)
        selectedRegister(null)
    };

    React.useEffect(() => {
        if (isCreate) {
            setSelectedImages([]);
            dispatch(getLand({}))
            // localStorage.removeItem('nombreIngles')
        }
    }, [isCreate])

    const saveOrderToDB = async (orderedImages) => {
        setShowBackdrop(true);
        setLoadingMessage('Guardando orden...');

        const formattedImages = orderedImages.map((image, index) => ({
            id: image.id,
            orden: index + 1
        }));

        try {
            await dispatch(saveOrderPhotos(formattedImages));
            console.log("Orden guardado en la base de datos.");
            await new Promise(resolve => setTimeout(resolve, 2000));
            await dispatch(getInfoForUpdatePa(infoLandForUpdate.id));  // usa el id correcto
            setSnackbarOpen(true);
            setSnackbarMessage('Orden de imágenes guardado Exitosamente');
        } catch (error) {
            console.error("Error al guardar el orden:", error);
            setErrorMessage(`Error: ${error.message || "Ocurrió un error inesperado"}`);
            setErrorSnackbarOpen(true);
        } finally {
            setShowBackdrop(false);
        }
    };

    React.useEffect(() => {
        if (infoLandForUpdate?.imagenes_paisajes) {
            setImages(infoLandForUpdate.imagenes_paisajes);
        }
    }, [infoLandForUpdate?.imagenes_paisajes]);

    const [images, setImages] = React.useState(infoLandForUpdate.imagenes_paisajes);

    const handleCloseViewer = () => {
        setIsGalleryOpen(false);
        setTimeout(() => {
            inputRefs.current[focusedImageId]?.focus(); // Vuelve a enfocar
        }, 100); // Pequeño delay para esperar que el viewer se cierre
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
                borderRadius: '0px 0px 0px 0px',
                mb: 1

            }}>
                <Grid item xs={12} md={12}>
                    <Grid container >
                        <Grid item xs={12} sm={9}>
                            <Typography variant='h1' color='primary' sx={{ mb: 1.5 }}>
                                Imágenes {nombreP ? ` ${nombreP}` : 'del Paisaje'}
                            </Typography>
                        </Grid>
                        {!isCreate && (
                            <Grid item xs={12} sm={3} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} >
                                <Button
                                    sx={{
                                        fontSize: '1rem',
                                        fontWeight: 'bold',
                                        // color: theme.palette.primary.light,
                                        backgroundColor: 'rgba(0, 56, 28, 0.1)', // Establece el fondo transparente deseado
                                        backdropFilter: 'blur(2px)', // Efecto de desenfoque de fondo
                                    }}
                                    id="boton-buscar"
                                    variant="outlined"
                                    onClick={handleReturnSearch}
                                    startIcon={<SearchIcon />}
                                >
                                    Buscar Otro Registro
                                </Button>
                            </Grid>
                        )}
                    </Grid>
                    <Typography variant='h4' color='primary.light' sx={{ mb: 1 }}>
                        Elegir Portada o Eliminar Imágenes
                    </Typography>
                    <Divider sx={{ my: 2, borderColor: theme.palette.primary.main, }} />
                    <Button
                        id="boton-eliminar"
                        variant="contained"
                        color="error"
                        onClick={handleDeleteButtonClick}
                        endIcon={<DeleteIcon />}
                        sx={{ mt: 0, mb: 0, color: 'primary.light' }}
                    >
                        Eliminar selección
                    </Button>
                </Grid>
            </Grid>
            <Grid sx={{
                margin: '0 auto',
                backgroundColor: 'rgba(0, 56, 28, 0.1)',
                backdropFilter: 'blur(2px)',
                borderRadius: '0px 0px 20px 20px',
                mb: 10,
            }}>
                {/* <DndProvider backend={HTML5Backend}>
                    <ImageDragContainer
                        images={infoLandForUpdate.imagenes_paisajes}
                        handleImageClick={handleImageClick}
                        handleSetAsCover={handleSetAsCover}
                        handleDeleteCheckBox={handleDeleteCheckBox}
                        loading={setLoadingMessage}
                        backDrop={setShowBackdrop}
                        snackBar={setSnackbarOpen}
                        messageBar={setSnackbarMessage}
                        errorMessage={setErrorMessage}
                        errorBar={setErrorSnackbarOpen}
                        id={infoLandForUpdate.id}
                    />
                </DndProvider> */}
                <PhotosOrganizerContainer
                    ref={organizerRef}
                    initialImages={images}
                    handleSetAsCover={handleSetAsCover}
                    handleDeleteCheckBox={handleDeleteCheckBox}
                    handleImageClick={handleImageClick}
                    highlightedImage={highlightedImage}
                    onSaveOrder={(updatedImages) => {
                        console.log('Nuevo orden:', updatedImages);
                    }}
                    onSaveToDB={saveOrderToDB}
                />

                <CarruselGalleryDelete
                    isOpen={isGalleryOpen}
                    images={infoLandForUpdate.imagenes_paisajes}
                    selectedIndex={selectedImageIndex}
                    onClose={handleCloseViewer}
                />
                {!infoLandForUpdate || !infoLandForUpdate.imagenes_paisajes || infoLandForUpdate.imagenes_paisajes.length === 0 && (
                    <Typography variant='body1' color='primary.light' sx={{ marginTop: '10px' }}>
                        No hay imágenes subidas.
                    </Typography>
                )}
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