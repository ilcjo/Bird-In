import * as React from 'react'
import { Backdrop, Button, Card, CardActionArea, CardContent, CardMedia, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Snackbar, SnackbarContent, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@emotion/react';
import SaveIcon from '@mui/icons-material/Save';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { getAllCustomizes, UpdateCustomizes } from '../../redux/settings/actions/Custom';

export const SectionCovers = ({ title, coverKey }) => {
    const theme = useTheme()
    const dispatch = useDispatch()
    const [selectedImageUrl, setSelectedImageUrl] = React.useState(null);
    const [uploadModalOpen, setUploadModalOpen] = React.useState(false);
    const [selectedFile, setSelectedFile] = React.useState(null);
    const [updateSuccess, setUpdateSuccess] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [loadingMessage, setLoadingMessage] = React.useState('Actualizando...'); // Nuevo estado para el indicador de carga
    const [uploadError, setUploadError] = React.useState(null); // Nuevo estado para manejar errores
    const [successSnackbarOpen, setSuccessSnackbarOpen] = React.useState(false);

    const { allCustom } = useSelector((state) => state.customizesSlice);

    const handleImageClick = (imageSrc) => {
        setSelectedImageUrl(imageSrc);
        setUploadModalOpen(true);
    };

    const handleCloseUploadModal = () => {
        setUploadModalOpen(false);
        setSelectedImageUrl(selectedImageUrl || allCustom[coverKey]);
        setSelectedFile(null);
        setUpdateSuccess(false);
        setUploadError(null);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            setSelectedFile(file);
            const imageUrl = URL.createObjectURL(file);
            setSelectedImageUrl(imageUrl);
        }
    };

    const handleUpload = async () => {
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('file', selectedFile, selectedFile.name);
            formData.append('oldUrl', allCustom[coverKey]);
            formData.append('campo', coverKey);
            await dispatch(UpdateCustomizes(formData));
            if (!uploadError) {
                // Set success only if there was no error during the dispatch
                setLoadingMessage('Subiendo Imagen');
                setUpdateSuccess(true);
                setSuccessSnackbarOpen(true);
                handleCloseUploadModal();
            }
        } catch (error) {
            console.error("Error durante la carga:", error);
            setUploadError('Error del servidor');
        } finally {
            setLoading(false);
        }
    };


    const handleSuccessSnackbarClose = () => {
        setSuccessSnackbarOpen(false);
    };

    React.useEffect(() => {
        // Cleanup function to handle component unmounting
        return () => {
            setUploadError(null);
            setSuccessSnackbarOpen(false);
            dispatch(getAllCustomizes())
        };
    }, []); // Empty dependency array to run only once on mount

    return (
        <Grid item xs={6} sm={12}>
            {/* <Typography variant='body1' color='primary.main' sx={{ mt: 1 }}>
                {title}
            </Typography>
            <Button
                onClick={() => handleImageClick(allCustom[coverKey])}>
                <img
                    src={selectedImageUrl || allCustom[coverKey]}
                    alt={`Imagen ${title}`}
                    style={{ maxWidth: '200px', maxHeight: '100px', marginTop: '10px', cursor: 'pointer', borderRadius: '10px' }}
                />
            </Button> */}
            <Card sx={{ maxWidth: 200, mt: 1 }} onClick={() => handleImageClick(allCustom[coverKey])}>
                <CardActionArea>
                    <CardMedia
                        component="img"
                        image={selectedImageUrl || allCustom[coverKey]}
                        alt={`Imagen ${title}`}
                        sx={{ maxHeight: 100, borderRadius: '10px', marginTop: '10px', cursor: 'pointer' }}
                    />
                    <CardContent>
                        <Typography variant='h4' color='primary.main'>
                            {title}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
            {/* Modal para subir archivos */}
            <Dialog open={uploadModalOpen} onClose={handleCloseUploadModal}>
                <DialogTitle> <Grid container alignItems="center">
                    <Grid item>
                        <Typography
                            variant='h2'
                            color='primary.main'
                            sx={{ mr: 2 }}
                        >
                            Actualizando:
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant='h2' color='primary.light'>
                            {title}
                        </Typography>
                    </Grid>
                </Grid>
                </DialogTitle>
                <DialogContent>
                    {selectedImageUrl && (
                        <img
                            src={selectedImageUrl}
                            alt="Imagen seleccionada"
                            style={{ maxWidth: '100%', maxHeight: '400px', marginBottom: '10px' }}
                        />
                    )}
                    <input type="file"
                        style={{ display: 'none' }}
                        accept="image/*"
                        id="image-upload-input"
                        onChange={handleFileChange}

                    />
                    <label htmlFor="image-upload-input"> {/* Utiliza el atributo "for" para asociar el label al input */}
                        <Button
                            variant="contained" // Cambia el estilo del botón a "contained" para un aspecto diferente
                            color="primary"
                            component="span" // Indica que es un botón para seleccionar archivo
                            onChange={handleFileChange}
                            endIcon={<UploadFileIcon />}
                        >
                            Cargar Imágenes
                        </Button>
                    </label>
                    {selectedFile && (
                        <Typography variant="body1" color="textSecondary" sx={{ marginTop: '10px' }}>
                            Archivo seleccionado: {selectedFile && selectedFile.name}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCloseUploadModal} color="error" variant='outlined'
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleUpload}
                        color="secondary"
                        variant='contained'
                        endIcon={<SaveIcon />}
                    >

                        Grabar
                    </Button>
                </DialogActions>
                <Backdrop open={loading} onClick={() => { }} style={{ zIndex: 1, color: '#fff' }}>
                    <>
                        <CircularProgress color="inherit" />
                        <Typography variant="h5" color="inherit" sx={{ ml: 2 }}>
                            {loadingMessage}
                        </Typography>
                    </>
                </Backdrop>
            </Dialog>
            <Snackbar
                open={!!uploadError}
                autoHideDuration={6000}
                onClose={() => setUploadError(null)}
            >
                <SnackbarContent
                    message={uploadError}
                />
            </Snackbar>
            {/* Snackbar para mostrar el éxito */}
            {successSnackbarOpen && (
                <Snackbar
                    open={true}
                    autoHideDuration={6000}
                    onClose={handleSuccessSnackbarClose}
                >
                    <SnackbarContent
                        message="Imagen actualizada con éxito."
                    />
                </Snackbar>
            )}
        </Grid>
    )
};
