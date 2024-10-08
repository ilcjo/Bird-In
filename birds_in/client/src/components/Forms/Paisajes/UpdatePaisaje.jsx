import * as  React from 'react'
import {
    Alert,
    Autocomplete,
    Box,
    Button,
    Divider,
    Grid,
    IconButton,
    InputAdornment,
    Snackbar,
    TextField,
    Typography,
    useTheme,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
//REDUX
import { deleteLand } from '../../../redux/paisaje/actionsP/fetchAllLands';
import { UpdatePaisajeImage, actualizarPaisaje, getInfoForUpdatePa } from '../../../redux/paisaje/actionsP/createLands';
//ICONS
import wikipediaLogo from '../../../assets/images/icons8-wikipedia-50.png'
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import PlaceIcon from '@mui/icons-material/Place';
//COMPONENTS
import { ImageUploader } from '../../utils/ImageUploader';
import { Loading } from '../../utils/Loading';
import { StyledTextField } from '../../../assets/styles/MUIstyles';
import { getOptionsData } from '../../../redux/birds/actions/fetchOptions';


export const UpdatePaisaje = ({ isEnable, changeTab, showUpdateRegister, showSearchRegister, selectedRegister, changeImagenExist }) => {

    const theme = useTheme()
    const dispatch = useDispatch()

    const { paisesAll, zonas } = useSelector(state => state.filterSlice.options)
    const { infoLandForUpdate } = useSelector(state => state.createLand);

    const initialCreateData = {
        pais: infoLandForUpdate.paise || [],
        zona: infoLandForUpdate.zona || [],
        descripcion: infoLandForUpdate.descripcion || '',
        urlWiki: infoLandForUpdate.url || '',
        ImgDescatada: infoLandForUpdate.destacada || '',
        idPaisaje: infoLandForUpdate.id || 0,
        urlImagen: infoLandForUpdate.imagenes_paisajes || [],
        map: infoLandForUpdate.map || '',
    }
    // console.log(infoAveForUpdate)
    const [createData, setCreateData] = React.useState(initialCreateData)
    const [imageLink, setImageLink] = React.useState([]); // Para mostrar la imagen seleccionada
    const [imageFile, setImageFile] = React.useState([]); // Para almacenar el Blob de la imagen
    const [allImageURLs, setAllImageURLs] = React.useState([]); // Nuevo estado para mantener todas las URLs de las imágenes
    const [showBackdrop, setShowBackdrop] = React.useState(false);
    const [loadingMessage, setLoadingMessage] = React.useState('Cargando...');
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [errorSnackbarOpen, setErrorSnackbarOpen] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState(null);
    const [snackBarMessage, setSnackBarMessage] = React.useState('El ave se ha Actualizado correctamente.');

    React.useEffect(() => {
        setShowBackdrop(true); // Mostrar el backdrop al inicio
        setLoadingMessage('Cargando..'); // Ejemplo de mensaje de carga completada (ajusta según necesites)

        const timer = setTimeout(() => {
            setShowBackdrop(false); // Cerrar el backdrop después de 5 segundos
        }, 3000);

        return () => {
            clearTimeout(timer); // Limpiar el temporizador al desmontar el componente
        };
    }, []);

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
            setLoadingMessage('Eliminando Registro del Paisaje...');
            await dispatch(deleteLand(infoLandForUpdate.id));
            setOpenSnackbar(true);
            setSnackBarMessage('El Registro del Paisaje se ha eliminado correctamente');
            setTimeout(() => {
                handleReturnSearch()
            }, 2000);
        } catch (error) {
            console.error('Error al eliminar el registro:', error);
            setErrorMessage(`Ocurrió un error: ${error.message}`);
            setErrorSnackbarOpen(true);
        } finally {
            setShowBackdrop(false);

        }
    };


    const handleImageChange = (event) => {
        const selectedImages = event.target.files;
        if (selectedImages.length > 0) {
            const imageUrls = Array.from(selectedImages).map(image => URL.createObjectURL(image));
            // setImageURL(imageUrls);
            setAllImageURLs((prevImageURLs) => [...prevImageURLs, ...imageUrls]);
            setImageFile((prevImageFiles) => [...prevImageFiles, ...selectedImages]);
        }
    };

    //ELIMINAR IMÁGENES
    const handleRemoveImage = (index) => {
        URL.revokeObjectURL(imageLink[index]);
        const updatedImageURLs = [...imageLink];
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
                setLoadingMessage('Subiendo Imágenes al Servidor...');
                imageUrl = await uploadImagesFtpAndSaveLinks(formData);
                setLoadingMessage('Actualizando Paisaje...');
            }
            if (createData.zona.nombre) {
                localStorage.setItem('nombrePaisaje', JSON.stringify(createData.zona.nombre))
            }
            await createFullEntry(createData, imageUrl);

            setShowBackdrop(false);
            setLoadingMessage('Actualización en proceso...');
            setOpenSnackbar(true);

            setImageLink([]);
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

    const handleLogoClickW = () => {
        if (createData.urlWiki) {
            window.open(createData.urlWiki, '_blank');
        }
    };

    const handleMapsClick = () => {
        if (createData.map) {
            window.open(createData.map, '_blank');
        }
    };

    const handleReturnSearch = () => {
        showUpdateRegister(false)
        showSearchRegister(true)
        selectedRegister(null)
    };
    //GUARDA FTP CREA EL NOMBRE
    const uploadImagesFtpAndSaveLinks = async (formData) => {
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
    const createFullEntry = async (createData, imageUrl) => {
        try {
            await dispatch(actualizarPaisaje({ ...createData, urlImagen: imageUrl }));
        } catch (error) {
            console.error('Error al actualizar el Paisaje en la base de datos:', error);
            throw new Error('Error al actualizar el Paisaje.');
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
                                <Typography variant='h2' color='primary' sx={{ mb: 3 }} >
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

                        <Typography variant='h5' color='primary.light' sx={{ mb: 3 }} >
                            Subir imágenes a la Galería
                            <Divider sx={{ my: 2, borderColor: theme.palette.primary.main, }} />
                        </Typography>

                        <Grid container sx={{ mt: 0 }} >
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
                                    options={paisesAll}
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
                                    options={zonas}
                                    getOptionLabel={(option) => option.nombre}
                                    value={createData.zona}
                                    onChange={(event, newValue) => setCreateData({ ...createData, zona: newValue })}
                                    renderInput={(params) =>
                                        <TextField {...params}
                                            label="Zonas"
                                            sx={{ mb: 2 }}
                                        />}
                                    isOptionEqualToValue={(option, value) => option.nombre === value?.nombre}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={1}>
                            <Grid item sx={12} md={12}>
                                <StyledTextField
                                    name="descripcion"
                                    label='Descripción'
                                    variant="filled"
                                    value={createData.descripcion}
                                    onChange={handleInputChange}
                                    fullWidth
                                    shrink='true'
                                />
                            </Grid>

                            <Grid item sx={12} md={12}>
                                < StyledTextField
                                    name="urlWiki"
                                    label='URL Wiki'
                                    variant="filled"
                                    value={createData.urlWiki}
                                    onChange={handleInputChange}
                                    fullWidth
                                    shrink='true'
                                    margin="dense"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">

                                                <IconButton onClick={handleLogoClickW}
                                                    sx={{
                                                        zIndex: 1,
                                                        '&:hover': {
                                                            zIndex: 2,
                                                        },
                                                    }}
                                                >
                                                    <img src={wikipediaLogo} alt="Wikipedia Logo" style={{ width: '26px', height: '26px' }} />
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} >
                                <StyledTextField
                                    label="URL de Google Maps"
                                    variant="filled"
                                    fullWidth
                                    name="map"
                                    value={createData.map}
                                    onChange={handleInputChange}
                                    margin='dense'
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <IconButton onClick={handleMapsClick}
                                                    sx={{
                                                        zIndex: 1,
                                                        '&:hover': {
                                                            zIndex: 2,
                                                        },
                                                        color: theme.palette.primary.light
                                                    }}
                                                >
                                                    <PlaceIcon />
                                                </IconButton>
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
                <Loading
                    message={loadingMessage}
                    open={showBackdrop}
                />
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