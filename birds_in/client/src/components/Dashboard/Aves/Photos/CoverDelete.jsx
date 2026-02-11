import * as React from 'react';
import { Alert, Button, Divider, Grid, Snackbar, Typography, useTheme } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import '../../../../assets/styles/zoom.css'
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// ICONS
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
// COMPONENTS
import { CarruselGalleryDelete } from '../../../Gallery/CarruselGalleryDelete';
import { Loading } from '../../../utils/Loading';
import { EditImageCards } from '../../../Cards/EditImageCards';
import ImageDragContainer from './ImageDragContainer';
// redux
import { saveOrderPhotos, sendCoverPhoto, sendPhotosDelete } from '../../../../redux/birds/actions/photosAction';
import { getInfoForUpdate } from '../../../../redux/birds/actions/crudAction';
import { getAve } from '../../../../redux/birds/slices/UpdateSlice';
import PhotosOrganizerContainer from './PhotosOrganizerContainer';
export const CoverDelete = ({
    isCreate,
    showUpdateBird,
    showSearchBird,
    selectedBird,
    setCoverSelected,
}) => {
    const organizerRef = React.useRef(null);
    const inputRefs = React.useRef({});
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
    const [errorMessage, setErrorMessage] = React.useState(null);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    const [isGalleryOpen, setIsGalleryOpen] = React.useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = React.useState('');
    // console.log(selectedImageIndex)
    const handleSetAsCover = async (id, url, destacada) => {
        // console.log(id, url)
        try {
            setHighlightedImage((prev) => {
                if (prev && prev.id === id) {
                    return null;
                } else {
                    return { id, url };
                }
            });
            await dispatch(sendCoverPhoto(id, infoAveForUpdate.id_ave));
            setShowBackdrop(true);
            setLoadingMessage('Seleccionando Portada');
            await new Promise((resolve) => setTimeout(resolve, 5000));
            await dispatch(getInfoForUpdate(infoAveForUpdate.id_ave));
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
        setLoadingMessage('Cargando..');
        setSelectedImageIndex(url);
        setIsGalleryOpen(true);
    };

    const handleCloseGallery = () => {
        setSelectedImageIndex(null);
        setIsGalleryOpen(false);
        if (organizerRef.current && organizerRef.current.focusContainer) {
            organizerRef.current.focusContainer();
        }
    };

    const handleDeleteCheckBox = (id, url) => {
        const index = selectedImages.findIndex((img) => img.id === id);
        if (index === -1) {
            setSelectedImages([...selectedImages, { id, url }]);
        } else {
            const newSelectedImages = [...selectedImages];
            newSelectedImages.splice(index, 1);
            setSelectedImages(newSelectedImages);
        }
    };

    const handleDeleteButtonClick = async () => {
        try {
            setShowBackdrop(true);
            setLoadingMessage('Borrando Fotografías Seleccionadas');
            // 1️⃣ Obtener imágenes ordenadas del hijo
            const currentImages = organizerRef.current.getCurrentImages();
            // console.log("📦 Imágenes actuales desde el hijo:", currentImages);
            // 2️⃣ Filtra y reordena
            const selectedIds = selectedImages.map((img) => img.id);
            const selectedUrls = selectedImages.map((img) => img.url);
            const updatedImages = currentImages
                .filter((img) => !selectedIds.includes(img.id))
                .map((img, index) => ({
                    ...img,
                    orden_imagen: index + 1
                }));

            // 3️⃣ Guarda orden actualizado
            await saveOrderToDB(updatedImages);
            // 4️⃣ Elimina en base
            await dispatch(sendPhotosDelete(selectedIds, selectedUrls));
            // 5️⃣ Actualiza estado y recarga
            await dispatch(getInfoForUpdate(infoAveForUpdate.id_ave));
            setImages(updatedImages);
            setSelectedImages([]);
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

    // const handleDeleteButtonClick = async () => {
    //     try {
    //         setShowBackdrop(true);
    //         setLoadingMessage('Borrando Fotografías Seleccionadas');
    //         const selectedIds = selectedImages.map((img) => img.id);
    //         const selectedUrls = selectedImages.map((img) => img.url);
    //         await dispatch(sendPhotosDelete(selectedIds, selectedUrls));
    //         await dispatch(getInfoForUpdate(infoAveForUpdate.id_ave));
    //         setSnackbarMessage('Fotografías Eliminadas con éxito');
    //         setSelectedImages([]);
    //         setShowBackdrop(false);
    //         setSnackbarOpen(true);
    //     } catch (error) {
    //         console.error('Error al eliminar fotos:', error);
    //         setErrorMessage(`Error al eliminar las fotografías: ${error.message}`);
    //         setErrorSnackbarOpen(true);
    //     } finally {
    //         setShowBackdrop(false);
    //     }
    // };

    const handleReturnSearch = () => {
        localStorage.removeItem('nombreIngles');
        showUpdateBird(false);
        showSearchBird(true);
        selectedBird(null);
    };

    React.useEffect(() => {
        if (isCreate) {
            setSelectedImages([]);
            dispatch(getAve({}));
        }
    }, [isCreate]);


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
            await dispatch(getInfoForUpdate(infoAveForUpdate.id_ave));  // usa el id correcto
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
        if (infoAveForUpdate?.imagenes_aves) {
            setImages(infoAveForUpdate.imagenes_aves);
        }
    }, [infoAveForUpdate?.imagenes_aves]);

    const [images, setImages] = React.useState(infoAveForUpdate.imagenes_aves);

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
                mb: 1,

            }}>
                <Grid item xs={12} md={12}>
                    <Grid container alignItems="center">
                        <Grid item xs={12} sm={9}>
                            <Typography variant='h1' color='primary' sx={{ mb: 1.5 }}>
                                Imágenes {nombreAve ? ` ${nombreAve}` : 'del Ave'}
                                <Divider sx={{ my: 2, borderColor: theme.palette.primary.main, }} />
                            </Typography>
                        </Grid>
                        {!isCreate && (
                            <Grid item xs={12} sm={3} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                <Button
                                    sx={{
                                        fontSize: '1rem',
                                        fontWeight: 'bold',
                                        backgroundColor: 'rgba(65, 99, 69, 0.42)',
                                        // backdropFilter: 'blur(2px)',
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
                    <Typography variant='h4' color='primary.light' sx={{ mb: 2 }}>
                        Elegir Portada o Eliminar Imágenes
                    </Typography>
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
                pb: 5,
                mb: 10,
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
                        images={infoAveForUpdate.imagenes_aves}
                        handleImageClick={handleImageClick}
                        handleSetAsCover={handleSetAsCover}
                        handleDeleteCheckBox={handleDeleteCheckBox}
                        loading={setLoadingMessage}
                        backDrop={setShowBackdrop}
                        snackBar={setSnackbarOpen}
                        messageBar={setSnackbarMessage}
                        errorMessage={setErrorMessage}
                        errorBar={setErrorSnackbarOpen}
                        id={infoAveForUpdate.id}
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
                    images={infoAveForUpdate.imagenes_aves}
                    selectedIndex={selectedImageIndex}
                    onClose={handleCloseViewer}

                />
                {images.length === 0 && (
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
                message={errorMessage}
                action={
                    <Button color="inherit" onClick={() => setErrorSnackbarOpen(false)}>
                        Cerrar
                    </Button>
                }
            />
        </React.Fragment>
    );
};
