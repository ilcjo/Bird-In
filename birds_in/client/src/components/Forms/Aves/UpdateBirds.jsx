import * as  React from 'react'
import {
    Alert,
    Autocomplete,
    Box,
    Button,
    Chip,
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
//ESTADOS GLOBALES
import { UpdateAveImage, actualizarAve, getInfoForUpdate } from '../../../redux/actions/createBirds';
import { getOptionsData } from '../../../redux/actions/fetchOptions';
import { deleteBird } from '../../../redux/actions/fetchAllBirds';
//ICONS
import wikipediaLogo from '../../../assets/images/icons8-wikipedia-50.png'
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
//COMPONENTS
import { ImageUploader } from '../../utils/ImageUploader';
import { StyledTextField } from '../../../assets/styles/MUIstyles';
import { Loading } from '../../utils/Loading';

export const UpdateBirds = ({ isEnable, changeTab, showUpdateBird, showSearchBird, selectedBird, changeImagenExist }) => {

    const theme = useTheme()
    const dispatch = useDispatch()

    const { paises, familias, grupos, zonas } = useSelector(state => state.birdSlice.options)
    const { infoAveForUpdate } = useSelector(state => state.createBird)

    const initialCreateData = {
        grupo: infoAveForUpdate.grupo || null,
        familia: infoAveForUpdate.familia || null,
        pais: infoAveForUpdate.paises || [],
        zona: infoAveForUpdate.zonasAves || [],
        cientifico: infoAveForUpdate.nombre_cientifico || '',
        ingles: infoAveForUpdate.nombre_ingles || '',
        comun: infoAveForUpdate.nombre_comun || '',
        urlWiki: infoAveForUpdate.url_wiki || '',
        urlBird: infoAveForUpdate.url_bird || '',
        ImgDescatada: infoAveForUpdate.descatada || '',
        idAve: infoAveForUpdate.id_ave || 0,
        urlImagen: infoAveForUpdate.imagenes_aves || [],
    }
    // console.log(initialCreateData)
    const [createData, setCreateData] = React.useState(initialCreateData)
    const [imageLink, setImageLink] = React.useState([]); // Para mostrar la imagen seleccionada
    const [imageFiles, setImageFiles] = React.useState([]); // Para almacenar el Blob de la imagen
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
    }, [infoAveForUpdate]);

    React.useEffect(() => {
        // Aquí despachas la acción para cargar las opciones al montar el componente
        dispatch(getOptionsData());
    }, [dispatch]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setCreateData({
            ...createData,
            [name]: value,
        });
    };

    const handleDeleteRegistro = async () => {
        try {
            setShowBackdrop(true);
            setLoadingMessage('Eliminando Registro del Ave...');
            await dispatch(deleteBird(infoAveForUpdate.id_ave));
            setOpenSnackbar(true);
            setSnackBarMessage('El Registro del Ave se ha eliminado correctamente');
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
            setAllImageURLs((prevImageURLs) => [...prevImageURLs, ...imageUrls]);
            setImageFiles((prevImageFiles) => [...prevImageFiles, ...selectedImages]);
        }
    };


    const handleRemoveImage = (index) => {
        URL.revokeObjectURL(imageLink[index]);
        const updatedImageURLs = [...imageLink];
        updatedImageURLs.splice(index, 1);
        setImageLink(updatedImageURLs);
        setAllImageURLs((prevAllImageURLs) => prevAllImageURLs.filter((_, i) => i !== index));
        const updatedImageFiles = [...imageFiles];
        updatedImageFiles.splice(index, 1);
        setImageFiles(updatedImageFiles);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setShowBackdrop(true);
        try {
            let imageUrl = '';
            if (imageFiles && imageFiles.length > 0) {
                const formData = new FormData();
                for (let i = 0; i < imageFiles.length; i++) {
                    formData.append('images', imageFiles[i]);
                }
                setLoadingMessage('Subiendo Imágenes al Servidor...');
                imageUrl = await uploadImagesFtpAndSaveLinks(formData);
                setLoadingMessage('Actualizando Ave...');
            }

            if (createData.ingles) {
                localStorage.setItem('nombreIngles', createData.ingles);
            }

            await createFullEntry(createData, imageUrl);

            setShowBackdrop(false);
            setLoadingMessage('Actualización en proceso...');
            setOpenSnackbar(true);

            setImageLink([]);
            setImageFiles([]);
            setAllImageURLs([])
            if (imageUrl) {
                setSnackBarMessage('El Ave se ha Actualizado correctamente.');
                dispatch(getInfoForUpdate(infoAveForUpdate.id_ave));
                changeImagenExist();
            } else {
                setSnackBarMessage('El Ave se ha Actualizado correctamente.');
                dispatch(getInfoForUpdate(infoAveForUpdate.id_ave));
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

    const uploadImagesFtpAndSaveLinks = async (formData) => {
        try {
            const response = await dispatch(UpdateAveImage(formData));
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

    const createFullEntry = async (createData, imageUrl) => {
        try {
            await dispatch(actualizarAve({ ...createData, urlImagen: imageUrl }));
        } catch (error) {
            console.error('Error al actualizar el ave en la base de datos:', error);
            throw new Error('Error al actualizar el ave.');
        }
    };


    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };


    const handleLogoClickW = () => {
        if (createData.urlWiki) {
            window.open(createData.urlWiki, '_blank');
        }
    };

    const handleLogoClickB = () => {
        if (createData.urlBird) {
            window.open(createData.urlBird, '_blank');
        }
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
                    backgroundColor: 'rgba(0, 56, 28, 0.1)', // Establece el fondo transparente deseado
                    backdropFilter: 'blur(2px)', // Efecto de desenfoque de fondo
                    padding: '0px 40px 30px 0px',
                    borderRadius: '0px 0px 20px 20px',
                    mb: 10,
                }} >
                    <Grid item xs={12} sm={12}>
                        <Grid container alignItems="center">
                            <Grid item xs={12} sm={9}>
                                <Typography variant='h2' color='primary' sx={{ mb: 3 }}>
                                    Formulario de Actualización
                                </Typography>
                            </Grid>

                            <Grid item xs={12} sm={3} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
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
                        </Grid>


                        <Typography variant='h5' color='primary.light' sx={{ mb: 3 }} >
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
                            Datos del Ave
                            <Divider sx={{ my: 2, borderColor: theme.palette.primary.main, }} />
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <StyledTextField
                                    name="ingles"
                                    label="Nombre en Ingles"
                                    value={createData.ingles}
                                    onChange={handleInputChange}
                                    variant="filled"
                                    margin="dense"
                                    fullWidth
                                />
                                <StyledTextField
                                    name="comun"
                                    label="Nombre común"
                                    value={createData.comun}
                                    onChange={handleInputChange}
                                    variant="filled"
                                    margin="dense"
                                    fullWidth
                                />
                                <StyledTextField
                                    name="cientifico"
                                    label="Nombre cientifico"
                                    value={createData.cientifico}
                                    onChange={handleInputChange}
                                    variant="filled"
                                    margin="dense"
                                    fullWidth
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-grupos"
                                    options={grupos}
                                    getOptionLabel={(option) => option.nombre}
                                    value={createData.grupo}
                                    onChange={(event, newValue) => setCreateData({ ...createData, grupo: newValue })}
                                    renderInput={(params) =>
                                        <TextField {...params}
                                            label="Grupo"
                                            margin='dense'

                                        />}
                                    isOptionEqualToValue={(option, value) => option.id === value?.id}
                                    // sx={{ mb: 3, mt: 1 }}
                                    filterOptions={(options, state) => {
                                        // Filtra las opciones para que coincidan solo al principio de las letras
                                        const inputValue = state.inputValue.toLowerCase();
                                        return options.filter((option) =>
                                            option.nombre.toLowerCase().startsWith(inputValue)
                                        );
                                    }}
                                />
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-familias"
                                    options={familias}
                                    getOptionLabel={(option) => option.nombre}
                                    value={createData.familia}
                                    onChange={(event, newValue) => setCreateData({ ...createData, familia: newValue })}
                                    renderInput={(params) =>
                                        <TextField {...params}
                                            label="Familia"
                                            margin="dense"
                                        />}
                                    isOptionEqualToValue={(option, value) => option.id === value?.id}
                                    // sx={{ mb: 3 }}
                                    filterOptions={(options, state) => {
                                        // Filtra las opciones para que coincidan solo al principio de las letras
                                        const inputValue = state.inputValue.toLowerCase();
                                        return options.filter((option) =>
                                            option.nombre.toLowerCase().startsWith(inputValue)
                                        );
                                    }}
                                />

                            </Grid>
                        </Grid>
                        <Grid container spacing={1}>
                            <Grid item xs={12} sm={12}>
                                <Autocomplete
                                    disablePortal
                                    multiple
                                    id="combo-box-pais"
                                    options={paises}
                                    getOptionLabel={(option) => option.nombre}
                                    value={createData.pais}
                                    onChange={(event, newValue) => setCreateData({ ...createData, pais: newValue })}
                                    renderInput={(params) =>
                                        <TextField {...params}
                                            label="Países"
                                            margin="dense"
                                        />}
                                    isOptionEqualToValue={(option, value) => option.id === value?.id}

                                    filterOptions={(options, state) => {
                                        // Filtra las opciones para que coincidan solo al principio de las letras
                                        const inputValue = state.inputValue.toLowerCase();
                                        return options.filter((option) =>
                                            option.nombre.toLowerCase().startsWith(inputValue)
                                        );
                                    }}
                                    renderTags={(value, getTagProps) =>
                                        value.map((option, index) => (
                                            <Chip
                                                label={option.nombre}
                                                {...getTagProps({ index })}
                                                sx={{
                                                    backgroundColor: 'secondary.light',
                                                    color: 'white',
                                                    '& .MuiChip-label': {
                                                        fontSize: '1.1rem', // Ajusta el tamaño del texto aquí
                                                    }
                                                }}
                                            />
                                        ))
                                    }
                                />
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
                                            margin="dense"
                                        />}
                                    isOptionEqualToValue={(option, value) => option.id === value?.id}
                                    multiple
                                    filterOptions={(options, state) => {
                                        // Filtra las opciones para que coincidan solo al principio de las letras
                                        const inputValue = state.inputValue.toLowerCase();
                                        const selectedPaises = createData.pais || []; // Asegúrate de que selectedPaises sea un array

                                        const filteredByInput = options.filter((option) =>
                                            option.nombre.toLowerCase().startsWith(inputValue)
                                        );

                                        return filteredByInput.filter((option) => {
                                            if (selectedPaises.length === 0) {
                                                return true; // No hay paises seleccionados, muestra todas las zonas
                                            }
                                            return selectedPaises.some((pais) => option.nombre_pais === pais.nombre);
                                        });
                                    }}

                                    renderTags={(value, getTagProps) =>
                                        value.map((option, index) => (
                                            <Chip
                                                label={option.nombre}
                                                {...getTagProps({ index })}
                                                sx={{
                                                    backgroundColor: 'secondary.light', color: 'white', '& .MuiChip-label': {
                                                        fontSize: '1.1rem', // Ajusta el tamaño del texto aquí
                                                    },
                                                }} // Ajusta los estilos aquí
                                            />
                                        ))
                                    }

                                />
                            </Grid>

                            <Grid item xs={12} sm={12}>
                                <StyledTextField
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

                                <StyledTextField
                                    name="urlBird"
                                    label='URL'
                                    variant="filled"
                                    value={createData.urlBird}
                                    onChange={handleInputChange}
                                    margin="dense"
                                    fullWidth
                                    shrink='true'
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">

                                                <IconButton onClick={handleLogoClickB}
                                                    sx={{
                                                        // height: '26px',
                                                        color: 'white',
                                                        zIndex: 1,
                                                        '&:hover': {
                                                            zIndex: 2,
                                                        },
                                                    }}
                                                >
                                                    eBird
                                                    {/* <img src={wikipediaLogo} alt="Wikipedia Logo" style={{ width: '26px', height: '26px' }} /> */}
                                                </IconButton>
                                            </InputAdornment>

                                        ),

                                    }}
                                />

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
                </Grid>
                <Loading
                    message={loadingMessage}
                    open={showBackdrop}
                />
            </Box>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={5000} // Duración en milisegundos (ajusta según tus preferencias)
                onClose={handleCloseSnackbar}
                message={snackBarMessage}
            >


                {/* <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => { navigate('/aves') }}
                        sx={{
                            ml: 3,
                            fontSize: '1.3rem', padding: '5px 10px', fontWeight: 'bold', textTransform: 'none',
                            '&:hover': {
                                backgroundColor: theme.palette.primary.dark, // Cambia el color de fondo en hover
                                color: theme.palette.primary.light, // Cambia el color del texto en hover
                                textTransform: 'none',
                            },
                        }}
                    >
                        Ver Ave */}
                {/* </Button> */}


            </Snackbar>

            {/* Snackbar for error message */}
            <Snackbar
                open={errorSnackbarOpen}
                autoHideDuration={5000} // Adjust the duration as needed
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