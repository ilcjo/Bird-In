import * as React from 'react';
import { Alert, Button, Divider, Grid, Snackbar, Typography, useTheme } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import '../../../../assets/styles/zoom.css'
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
//ICONS
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
//COMPONENTS
import { CarruselGalleryDelete } from '../../../Gallery/CarruselGalleryDelete';
import { Loading } from '../../../utils/Loading';
import ImageDragContainer from './ImageDragContainer';
//redux
import { saveOrderPhotos, sendCoverPhoto, sendPhotosDelete } from '../../../../redux/mamiferos/actions/photosAction';
import { getInfoForUpdate } from '../../../../redux/mamiferos/actions/crudAction';
import { getRegistro } from '../../../../redux/mamiferos/slices/UpdateSlice';
import PhotosOrganizerContainer from '../../Mamiferos/Photos/PhotosOrganizerContainer';

export const CoverDelete = ({
    isCreate,
    showUpdate,
    showSearch,
    selected,
    setCoverSelected,
}) => {
    const organizerRef = React.useRef(null);
    const inputRefs = React.useRef({});
    const theme = useTheme();
    const dispatch = useDispatch();
    const nombre = localStorage.getItem('nombreIngles') || 'del Registro ';
    const { infoForUpdate } = useSelector(state => state.updateSlice);
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
            await dispatch(sendCoverPhoto(id, infoForUpdate.id_mamifero));
            setShowBackdrop(true);
            setLoadingMessage('Seleccionando Portada')
            await new Promise((resolve) => setTimeout(resolve, 5000));
            await dispatch(getInfoForUpdate(infoForUpdate.id_mamifero));
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
            setLoadingMessage('Guardando orden y borrando Fotografías Seleccionadas')
            // 1️⃣ Obtener imágenes ordenadas del hijo
            const currentImages = organizerRef.current.getCurrentImages();
            console.log("📦 Imágenes actuales desde el hijo:", currentImages);

            // Separar IDs y URLs en arrays diferentes
            const selectedIds = selectedImages.map((img) => img.id);
            const selectedUrls = selectedImages.map((img) => img.url);
            const updatedImages = currentImages
                .filter((img) => !selectedIds.includes(img.id))
                .map((img, index) => ({
                    ...img,
                    orden_imagenes: index + 1
                }));
            // 3️⃣ Guarda orden actualizado
            await saveOrderToDB(updatedImages);
            // Realizar la eliminación de fotos
            await dispatch(sendPhotosDelete(selectedIds, selectedUrls));
            // Mostrar Snackbar y obtener información actualizada
            await dispatch(getInfoForUpdate(infoForUpdate.id_mamifero));
            setImages(updatedImages);
            setSelectedImages([])
            setShowBackdrop(false)
            setSnackbarMessage('Fotografías Eliminadas con éxito');
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
            await dispatch(getInfoForUpdate(infoForUpdate.id_mamifero));  // usa el id correcto
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
        if (infoForUpdate?.imagenes_mamiferos) {
            setImages(infoForUpdate.imagenes_mamiferos);
        }
    }, [infoForUpdate?.imagenes_mamiferos]);

    const [images, setImages] = React.useState(infoForUpdate.imagenes_mamiferos);
    // console.log(infoForUpdate.imagenes_mamiferos)
    const handleCloseViewer = () => {
        setIsGalleryOpen(false);
        setTimeout(() => {
            inputRefs.current[focusedImageId]?.focus(); // Vuelve a enfocar
        }, 100); // Pequeño delay para esperar que el viewer se cierre
    };

    return (
        <React.Fragment>
            <Loading message={loadingMessage} open={showBackdrop} />
            <Grid container spacing={5} sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                // minWidth: '1200px',
                margin: '0 auto',
                background: `
                  linear-gradient(
                    180deg,
                    rgba(242, 246, 219, 0.14) 0%,
                    rgba(242, 246, 219, 0.14) 0%,
                    rgba(242, 246, 219, 0.14) 0%
                  )
                `,
                backdropFilter: 'blur(2px)',
                padding: '0px 40px 30px 0px',
                borderRadius: '0px 0px 0px 0px',
                mb: 1

            }}>
                <Grid item xs={12} md={12}>
                    <Grid container alignItems="center">
                        <Grid item xs={12} sm={9}>
                            <Typography variant='h1' color='primary' sx={{ mb: 1.5 }}>
                                Imágenes {nombre ? ` ${nombre}` : 'del Mamífero'}
                            </Typography>
                        </Grid>
                        {!isCreate && (
                            <Grid item xs={12} sm={3} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} >
                                <Button
                                    sx={{
                                        fontSize: '1rem',
                                        fontWeight: 'bold',
                                        backgroundColor: 'rgba(65, 99, 69, 0.42)',
                                        // backdropFilter: 'blur(2px)',
                                    }}
                                    id='boton-buscar'
                                    variant="outlined"
                                    onClick={handleReturnSearch}
                                    startIcon={<SearchIcon />}
                                >
                                    Buscar Otro Registro
                                </Button>
                            </Grid>
                        )}
                    </Grid>
                    <Typography variant='h4' color='primary.light' sx={{ mb: 2 }}>
                        Elegir Portada o Eliminar Imágenes
                    </Typography>
                    <Divider sx={{ my: 2, borderColor: 'primary.main' }} />
                    <Button
                        id='boton-eliminar'
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
                pb: 5,
                background: `
                  linear-gradient(
                    180deg,
                    rgba(242, 246, 219, 0.14) 0%,
                    rgba(65, 99, 69, 0.75) 50%,
                    rgba(65, 99, 69, 0.42) 100%
                  )
                `,
            }}>
                {/* <DndProvider backend={HTML5Backend}>
                    <ImageDragContainer
                        images={infoForUpdate.imagenes_mamiferos}
                        handleImageClick={handleImageClick}
                        handleSetAsCover={handleSetAsCover}
                        handleDeleteCheckBox={handleDeleteCheckBox}
                        loading={setLoadingMessage}
                        backDrop={setShowBackdrop}
                        snackBar={setSnackbarOpen}
                        messageBar={setSnackbarMessage}
                        errorMessage={setErrorMessage}
                        errorBar={setErrorSnackbarOpen}
                        idMamifero={infoForUpdate.id_mamifero}
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
                    images={infoForUpdate.imagenes_mamiferos}
                    selectedIndex={selectedImageIndex}
                    onClose={handleCloseViewer}
                />

                {images.length === 0 && (
                    <Typography variant='body1' color='primary.light' sx={{ marginTop: '10px' }}>
                        No hay imágenes subidas.
                    </Typography>
                )}
            </Grid>
            {/* <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)} message={snackbarMessage} />
            <Snackbar open={errorSnackbarOpen} autoHideDuration={6000} onClose={() => setErrorSnackbarOpen(false)}>
                <Alert elevation={6} variant="filled" severity="error" onClose={() => setErrorSnackbarOpen(false)}>
                    {errorMessage}
                </Alert>
            </Snackbar> */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
            />
            <Snackbar
                open={errorSnackbarOpen}
                autoHideDuration={6000}
                onClose={() => setErrorSnackbarOpen(false)}
                message={errorMessage}
                action={
                    <Button color="inherit" onClick={() => setErrorSnackbarOpen(false)}>
                        Cerrar
                    </Button>
                }
            />
        </React.Fragment>
    );
}