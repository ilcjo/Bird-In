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
// redux
import { sendCoverPhoto, sendPhotosDelete } from '../../../../redux/birds/actions/photosAction';
import { getInfoForUpdate } from '../../../../redux/birds/actions/crudAction';
import { getAve } from '../../../../redux/birds/slices/UpdateSlice';
import ImageDragContainer from './ImageDragContainer';

export const CoverDelete = ({
    isCreate,
    showUpdateBird,
    showSearchBird,
    selectedBird,
    setCoverSelected,
}) => {
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

    const handleSetAsCover = async (id, url, destacada) => {
        console.log(id, url)
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
            const selectedIds = selectedImages.map((img) => img.id);
            const selectedUrls = selectedImages.map((img) => img.url);
            await dispatch(sendPhotosDelete(selectedIds, selectedUrls));
            await dispatch(getInfoForUpdate(infoAveForUpdate.id_ave));
            setSnackbarMessage('Fotografías Eliminadas con éxito');
            setSelectedImages([]);
            setShowBackdrop(false);
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

    const [images, setImages] = React.useState(infoAveForUpdate.imagenes_aves );

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
                    <Grid container>
                        <Grid item xs={12} sm={9}>
                            <Typography variant='h2' color='primary'>
                                Imágenes {nombreAve ? ` ${nombreAve}` : 'del Ave'}
                            </Typography>
                        </Grid>
                        {!isCreate && (
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
                </Grid>
            </Grid>
            <Grid sx={{
                margin: '0 auto',
                backgroundColor: 'rgba(0, 56, 28, 0.1)',
                borderRadius: '0px 0px 20px 20px',
                mb: 10,
            }}>
                <DndProvider backend={HTML5Backend}>
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
                </DndProvider>
                <CarruselGalleryDelete
                    isOpen={isGalleryOpen}
                    images={infoAveForUpdate.imagenes_aves}
                    selectedIndex={selectedImageIndex}
                    onClose={handleCloseGallery}
                />
                {images.length === 0 && (
                    <Typography variant='body1' color='primary.light' sx={{ marginTop: '10px' }}>
                        No hay imágenes subidas.
                    </Typography>
                )}
            </Grid>
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
};
