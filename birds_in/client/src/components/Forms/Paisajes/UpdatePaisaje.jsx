import * as  React from 'react'
import {
    Alert,
    Autocomplete,
    Backdrop,
    Box,
    Button,
    CircularProgress,
    Divider,
    Grid,
    InputAdornment,
    Snackbar,
    TextField,
    Typography,
    useTheme,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
//REDUX
import { deleteBird } from '../../../redux/actions/fetchAllBirds';
import { UpdatePaisajeImage, actualizarPaisaje, getInfoForUpdatePa } from '../../../redux/paisaje/actionsP/createLands';
import { getOptionsData } from '../../../redux/actions/fetchOptions';
//ICONS
import wikipediaLogo from '../../../assets/images/icons8-wikipedia-50.png'
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
//COMPONENTS
import { ImageUploader } from '../../utils/ImageUploader';


export const UpdatePaisaje = ({ isEnable, changeTab, showUpdateBird, showSearchBird, selectedBird, changeImagenExist }) => {

    const theme = useTheme()
    const dispatch = useDispatch()

    const { paises, zonas } = useSelector(state => state.birdSlice.options)
    const { infoAveForUpdate } = useSelector(state => state.createBird)
    const { infoLandForUpdate } = useSelector(state => state.createLand);

    const sortAlphabetically = (array) => {
        return array.slice().sort((a, b) => {
            if (a && a.nombre && b && b.nombre) {
                const nameA = a.nombre.charAt(0).toUpperCase() + a.nombre.slice(1);
                const nameB = b.nombre.charAt(0).toUpperCase() + b.nombre.slice(1);
                return nameA.localeCompare(nameB);
            }
            return 0;
        });
    };
    const sortedPaises = sortAlphabetically(paises);
    const sortedZonas = sortAlphabetically(zonas)

    const initialCreateData = {
        pais: infoLandForUpdate.paise || [],
        zona: infoLandForUpdate.zona || [],
        descripcion: infoLandForUpdate.descripcion || '',
        urlWiki: infoLandForUpdate.url || '',
        ImgDescatada: infoLandForUpdate.destacada || '',
        idPaisaje: infoLandForUpdate.id || 0,
        urlImagen: infoLandForUpdate.imagenes_paisajes || [],
    }
    // console.log(infoAveForUpdate)
    const [createData, setCreateData] = React.useState(initialCreateData)
    const [imageURL, setImageURL] = React.useState([]); // Para mostrar la imagen seleccionada
    const [imageFile, setImageFile] = React.useState([]); // Para almacenar el Blob de la imagen
    const [allImageURLs, setAllImageURLs] = React.useState([]); // Nuevo estado para mantener todas las URLs de las imágenes
    const [showBackdrop, setShowBackdrop] = React.useState(false);
    const [loadingMessage, setLoadingMessage] = React.useState('Cargando...');
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [errorSnackbarOpen, setErrorSnackbarOpen] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState(null);
    const [snackBarMessage, setSnackBarMessage] = React.useState('El ave se ha Actualizado correctamente.');

    React.useEffect(() => {
        setCreateData(initialCreateData);
    }, [infoLandForUpdate]);

    React.useEffect(() => {
        dispatch(getOptionsData());
    }, [dispatch]);

    //INPUT RECOGE EL VALOR SEGÚN EL NOMBRE DEL INPUT
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setCreateData({
            ...createData,
            [name]: value,
        });
    };

    //ELIMINA EL REGISTRO DE DB Y FTP IMÁGENES
    const handleDeleteRegistro = async () => {
        try {
            setShowBackdrop(true);
            setLoadingMessage('Eliminando...');
            await dispatch(deleteBird(infoAveForUpdate.id_ave));
            setOpenSnackbar(true);
            setSnackBarMessage('El Registro del Ave se ha eliminado correctamente');
        } catch (error) {
            console.error('Error al eliminar el registro:', error);
            setErrorMessage(`Ocurrió un error: ${error.message}`);
            setErrorSnackbarOpen(true);
        } finally {
            setShowBackdrop(false);
            handleReturnSearch()
        }
    };


    const handleImageChange = (event) => {
        const selectedImages = event.target.files;
        if (selectedImages.length > 0) {
            const imageUrls = Array.from(selectedImages).map(image => URL.createObjectURL(image));
            setImageURL(imageUrls);
            setAllImageURLs((prevImageURLs) => [...prevImageURLs, ...imageUrls]);
            setImageFile((prevImageFiles) => [...prevImageFiles, ...selectedImages]);
        }
    };

    //ELIMINAR IMÁGENES
    const handleRemoveImage = (index) => {
        URL.revokeObjectURL(imageURL[index]);
        const updatedImageURLs = [...imageURL];
        updatedImageURLs.splice(index, 1);
        setImageURL(updatedImageURLs);
        setAllImageURLs((prevAllImageURLs) => prevAllImageURLs.filter((_, i) => i !== index));
        const updatedImageFiles = [...imageFile];
        updatedImageFiles.splice(index, 1);
        setImageFile(updatedImageFiles);
    };

    //ENVIAR
    const handleSubmit = async (event) => {
        event.preventDefault();
        setShowBackdrop(true);
        try {
            let imageUrl = '';
            if (imageFile && imageFile.length > 0) {
                const formData = new FormData();
                for (let i = 0; i < imageFile.length; i++) {
                    formData.append('images', imageFile[i]);
                }
                setLoadingMessage('Subiendo Imágenes...');
                imageUrl = await saveImageFtpWithMessage(formData);
                setLoadingMessage('Actualizando Paisaje...');
            }

            await createWithMessage(createData, imageUrl);

            setShowBackdrop(false);
            setLoadingMessage('Actualización en proceso...');
            setOpenSnackbar(true);

            setImageURL([]);
            setImageFile([]);
            setAllImageURLs([])
            if (imageUrl) {
                setSnackBarMessage('El Registro se ha Actualizado correctamente.');
                dispatch(getInfoForUpdatePa(infoLandForUpdate.id));
                changeImagenExist();
            } else {
                setSnackBarMessage('El Registro se ha Actualizado correctamente.');
                dispatch(getInfoForUpdatePa(infoLandForUpdate.id));
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage(`Ocurrió un error: ${error.message}`);
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
    //GUARDA FTP CREA EL NOMBRE
    const saveImageFtpWithMessage = async (formData) => {
        try {
            const response = await dispatch(UpdatePaisajeImage(formData));
            if (response && response.data && response.data.imageUrls) {
                return response.data.imageUrls;
            } else {
                console.error('El servidor no devolvió las URLs de las imágenes.');
                throw new Error('El servidor no devolvió las URLs de las imágenes.');
            }
        } catch (error) {
            console.error('Error al enviar las imágenes:', error);
            throw new Error('Error al enviar las imágenes.');
        }
    };

    //GUARDA DB EL HTTP+NOMBRE
    const createWithMessage = async (createData, imageUrl) => {
        try {
            await dispatch(actualizarPaisaje({ ...createData, urlImagen: imageUrl }));
        } catch (error) {
            console.error('Error al actualizar el ave en la base de datos:', error);
            throw new Error('Error al actualizar el ave.');
        }
    };

    //CERRAR EL SNACKBAR
    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    return (
        <React.Fragment>
            <Box
                component="form"
                onSubmit={handleSubmit}
                autoComplete="off"
            >
                <Grid container spacing={5} sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 'auto',
                    margin: 'auto',
                    backgroundColor: 'rgba(0, 56, 28, 0.10)', // Establece el fondo transparente deseado
                    backdropFilter: 'blur(8px)', // Efecto de desenfoque de fondo
                    padding: '0px 40px 30px 0px',
                    borderRadius: '0px 0px 20px 20px',
                    mb: 10,
                }} >

                    <Grid item xs={12} sm={12}>
                        <Grid container alignItems="center">
                            <Grid item xs={12} sm={9}>
                                <Typography variant='h2' color='primary' >
                                    Formulario de Actualización
                                </Typography>
                            </Grid>

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
                                    Buscar Nuevo Registro
                                </Button>
                            </Grid>
                        </Grid>


                        <Typography variant='h5' color='primary.light' >
                            Subir imágenes a la Galería
                            <Divider sx={{ my: 2, borderColor: theme.palette.primary.main, }} />
                        </Typography>

                        <Grid container sx={{ mt: -4 }} >
                            <Grid item xs={12} sm={3} md={3}>
                                <ImageUploader
                                    allImageURLs={allImageURLs}
                                    handleImageChange={handleImageChange}
                                    handleRemoveImage={handleRemoveImage}
                                />
                            </Grid >
                            <Grid item xs={12} sm={9} md={9} >
                                <Button onClick={handleSubmit}
                                    variant="contained"
                                    color="secondary"
                                    endIcon={<SaveIcon />}
                                >Grabar</Button>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12} sm={12}>
                        <Typography variant='h5' color='primary.light' sx={{ mb: 3 }} >
                            Datos del Paisaje
                            <Divider sx={{ my: 2, borderColor: theme.palette.primary.main, }} />
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-pais"
                                    options={sortedPaises}
                                    getOptionLabel={(option) => option.nombre}
                                    value={createData.pais}
                                    onChange={(event, newValue) => setCreateData({ ...createData, pais: newValue })}
                                    renderInput={(params) =>
                                        <TextField {...params}
                                            label="Países"
                                        />}
                                    isOptionEqualToValue={(option, value) => option.nombre === value?.nombre}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-zonas"
                                    options={sortedZonas}
                                    getOptionLabel={(option) => option.nombre}
                                    value={createData.zona}
                                    onChange={(event, newValue) => setCreateData({ ...createData, zona: newValue })}
                                    renderInput={(params) =>
                                        <TextField {...params}
                                            label="Zonas"
                                            sx={{ mb: 4, height: '70px' }}
                                        />}
                                    isOptionEqualToValue={(option, value) => option.nombre === value?.nombre}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={1}>
                            <Grid item sx={12} md={12}>
                                <TextField
                                    name="descripcion"
                                    label='Descripción'
                                    value={createData.descripcion}
                                    onChange={handleInputChange}
                                    variant="filled"
                                    margin="normal"
                                    fullWidth
                                    shrink='true'
                                    sx={{
                                        my: 2, backgroundColor: 'rgba(204,214,204,0.17)',
                                    }}
                                />
                            </Grid>

                            <Grid item sx={12} md={12}>
                                <TextField
                                    name="urlWiki"
                                    label='URL Wiki'
                                    variant="filled"
                                    value={createData.urlWiki}
                                    onChange={handleInputChange}
                                    fullWidth
                                    shrink='true'
                                    sx={{
                                        backgroundColor: 'rgba(204,214,204,0.17)'
                                    }}
                                    InputProps={{

                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <img src={wikipediaLogo} alt="Wikipedia Logo" style={{ width: '24px', height: '24px' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <Button
                                endIcon={<DeleteForeverIcon />}
                                variant="contained"
                                color='custom'
                                onClick={handleDeleteRegistro}
                                sx={{
                                    color: theme.palette.primary.light,
                                }}
                            >
                                Eliminar Registro
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                {/* Backdrop para mostrar durante la carga */}
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

            </Box>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={5000}
                onClose={handleCloseSnackbar}
                message={snackBarMessage}
            >
            </Snackbar>

            <Snackbar
                open={errorSnackbarOpen}
                autoHideDuration={5000}
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

        </React.Fragment >
    );
};