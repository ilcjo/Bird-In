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
    useTheme
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
//ICONS
import SaveIcon from '@mui/icons-material/Save';
import wikipediaLogo from '../../../assets/images/icons8-wikipedia-50.png'
//COMPONENTS
import { Loading } from '../../utils/Loading';
import { ImageUploader } from '../../utils/ImageUploader';
import { StyledTextField } from '../../../assets/styles/MUIstyles';
//redux
import { createBird, duplicateNameCheck, getInfoForUpdateName } from '../../../redux/birds/actions/crudAction';
import { saveImageFtp } from '../../../redux/birds/actions/photosAction';
import { getOptionsData } from '../../../redux/birds/actions/fetchOptions';


export const CreateBird = ({ changeImagenTab, changeTabSearch, isImages, }) => {

    const theme = useTheme()
    const dispatch = useDispatch()

    const { paises, familias, grupos, zonas } = useSelector(state => state.filterSlice.options)
    const [imageLink, setImageLink] = React.useState([]); // Para mostrar la imagen seleccionada
    const [imageFiles, setImageFiles] = React.useState([]); // Para almacenar el Blob de la imagen
    const [allImageURLs, setAllImageURLs] = React.useState([]);
    const [showBackdrop, setShowBackdrop] = React.useState(false);
    const [loadingMessage, setLoadingMessage] = React.useState('Cargando...');
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [errorSnackbarOpen, setErrorSnackbarOpen] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState(null);
    const [snackBarMessage, setSnackBarMessage] = React.useState('El ave se a creado correctamente.');
    const [birdCreated, setBirdCreated] = React.useState(false);
    const [formSubmitted, setFormSubmitted] = React.useState(false);


    const [createData, setCreateData] = React.useState({
        grupo: null,
        familia: null,
        pais: [],
        zona: [],
        cientifico: '',
        ingles: '',
        comun: '',
        urlWiki: '',
        urlBird: '',
        urlImagen: [],
    });

    const [errors, setErrors] = React.useState({
        grupo: false,
        familia: false,
        ingles: false,
    });


    const handleImageChange = (event) => {
        const selectedImages = event.target.files;
        if (selectedImages.length > 0) {
            const imageUrls = Array.from(selectedImages).map(image => URL.createObjectURL(image));
            setAllImageURLs((prevImageURLs) => [...prevImageURLs, ...imageUrls]);
            setImageFiles((prevImageFiles) => [...prevImageFiles, ...selectedImages]);
        }
    };


    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setCreateData({
            ...createData,
            [name]: value,
        });

        // Clear the error when the user starts typing in the input field
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: false,
            });
        }
    };


    const handleInputChangeIngles = (event) => {
        const newName = event.target.value;
        // Si no hay duplicados, actualiza el estado createData
        setCreateData({
            ...createData,
            ingles: newName,
        });
        // Reinicia el error al escribir
        setErrors({
            ...errors,
            ingles: false,
        });

        // Reinicia el formulario
        setFormSubmitted(false);

        // Espera 500 milisegundos antes de llamar a la función para comprobar duplicados
        setTimeout(async () => {
            try {
                // Llama a la función para comprobar duplicados
                await dispatch(duplicateNameCheck(newName));


            } catch (error) {
                // Si hay un error, muestra un mensaje de error
                console.error('Error al comprobar duplicados:', String(error));
                alert('Esta ave ya existe');
                // Restablece el valor del input
                changeTabSearch()
            }
        }, 700);
    };


    const handleRemoveImage = (index) => {
        URL.revokeObjectURL(allImageURLs[index]);
        setAllImageURLs(allImageURLs.filter((_, i) => i !== index));
        setImageFiles(imageFiles.filter((_, i) => i !== index));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const newErrors = {};
        setFormSubmitted(true);
        if (!createData.grupo) {
            newErrors.grupo = true;
        }

        if (!createData.familia) {
            newErrors.familia = true;
        }

        if (!createData.ingles) {
            newErrors.ingles = true;
        }

        setErrors(newErrors);

        // Check if any errors exist and prevent form submission
        if (Object.values(newErrors).some((error) => error)) {
            return;

        }
        // Check if there are images before attempting to submit the form
        if (!imageFiles || imageFiles.length === 0) {
            // Show an alert indicating that images are required
            alert("Debes cargar al menos una imagen antes de enviar el formulario.");
            return;
        }

        if (imageFiles && imageFiles.length > 0) {
            const formData = new FormData();
            imageFiles.forEach((file) => formData.append('images', file))
            setShowBackdrop(true);
            setLoadingMessage('Subiendo imágenes al Servidor...');

            try {
                // Espera a que la imagen se suba y obtén la URL
                const imageUrls = await uploadImagesFtpAndSaveLinks(formData);
                localStorage.setItem('nombreIngles', JSON.stringify(createData.ingles))
                await createFullEntry(createData, imageUrls);
                setLoadingMessage('Creando el Ave en la DB...');
                setShowBackdrop(false);
                setBirdCreated(true);
                setOpenSnackbar(true);
                setLoadingMessage('Cargando...');
                setImageLink([]);
                setImageFiles([]);
                setFormSubmitted(false)
                setSnackBarMessage('El ave se a creado correctamente.')
                // Añadir un retraso de 10 segundos antes de ejecutar changeImagenExist()
                setTimeout(() => {
                    dispatch(getInfoForUpdateName(createData.ingles));
                    changeImagenTab(1);
                    isImages(true)
                }, 1500); // 10000 mili segundos = 10 segundos
            } catch (error) {
                console.log('este es el error:', String(error))
                setErrorMessage(`Ocurrió un error: ${error}`);
                setErrorSnackbarOpen(true);
            } finally {
                setShowBackdrop(false);
            }
        }
    };

    const uploadImagesFtpAndSaveLinks = async (formData) => {
        return new Promise(async (resolve, reject) => {
            try {
                // Realiza la carga de la imagen y espera la respuesta
                const response = await dispatch(saveImageFtp(formData));
                // Verifica si la respuesta contiene la URL de la imagen
                if (response && response.data && response.data.imageUrls) {
                    const imageUrlString = response.data.imageUrls;
                    setImageLink(imageUrlString)
                    resolve(imageUrlString);
                } else {
                    console.error('El servidor no devolvió la URL de la imagen.');
                    reject('El servidor no devolvió la URL de la imagen.');
                }
            } catch (error) {
                console.error('Error al enviar la imagen:', error);
                reject('Error al enviar la imagen.');
            }
        });
    };

    const createFullEntry = async (createData, imageUrl) => {
        return new Promise((resolve, reject) => {
            dispatch(createBird({ ...createData, urlImagen: imageUrl }))
                .then(() => {
                    resolve(); // Si la creación del ave tiene éxito, resuelve la Promesa sin un mensaje.
                })
                .catch((error) => {
                    reject("Error al crear el ave"); // Si hay un error, resuelve la Promesa con un mensaje.
                });
        });
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


    React.useEffect(() => {
        // Aquí despachas la acción para cargar las opciones al montar el componente
        dispatch(getOptionsData());
    }, [dispatch]);

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
                                <Typography variant='h2' color='primary' sx={{ mb: 2 }}>
                                    Formulario de Creación
                                </Typography>
                            </Grid>
                        </Grid>

                        <Typography variant='h5' color='primary.light' sx={{ mb: 1 }} >
                            Subir imágenes a Galería
                            <Divider sx={{ my: 2, borderColor: theme.palette.primary.main, }} />
                        </Typography>

                        <Grid container sx={{}} >
                            <Grid item xs={12} sm={3} md={3}>
                                <ImageUploader
                                    allImageURLs={allImageURLs}
                                    handleImageChange={handleImageChange}
                                    handleRemoveImage={handleRemoveImage}
                                />
                            </Grid >
                            <Grid item xs={12} sm={9} md={9} >
                                <Button
                                    onClick={handleSubmit}
                                    variant="contained"
                                    color="secondary"
                                    endIcon={<SaveIcon />}
                                >Grabar</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <Typography variant='h5' color='primary.light' sx={{ mb: 1 }} >
                            Datos del Ave
                            <Divider sx={{ my: 2, borderColor: theme.palette.primary.main, }} />
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} >
                                <StyledTextField
                                    name="ingles"
                                    label="Nombre en Inglés"
                                    value={createData.ingles}
                                    onChange={handleInputChangeIngles}
                                    type='text'
                                    variant="filled"
                                    margin="dense"
                                    fullWidth
                                    error={formSubmitted && createData.ingles.trim() === ''} // Check if the field is empty when the form is submitted
                                    helperText={formSubmitted && createData.ingles.trim() === '' ? 'Este Campo es obligatorio *' : ''}
                                    FormHelperTextProps={{
                                        sx: {
                                            fontSize: '1.1rem',
                                            fontWeight: 'bold'
                                        },
                                    }}
                                />
                                <StyledTextField
                                    name="comun"
                                    label="Nombre común"
                                    value={createData.comun}
                                    onChange={handleInputChange}
                                    type='text'
                                    variant="filled"
                                    margin="dense"
                                    fullWidth
                                />
                                <StyledTextField
                                    name="cientifico"
                                    label="Nombre científico"
                                    value={createData.cientifico}
                                    onChange={handleInputChange}
                                    type='text'
                                    variant="filled"
                                    margin="dense"
                                    fullWidth
                                />

                            </Grid>

                            <Grid item xs={12} sm={6}>

                                <Autocomplete
                                    disablePortal
                                    id="combo-box-familias"
                                    options={familias}
                                    getOptionLabel={(option) => option.nombre}
                                    value={createData.familia}
                                    onChange={(event, newValue) => setCreateData({ ...createData, familia: newValue })}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Familia"
                                            margin="none"
                                            error={formSubmitted && !createData.familia} // Add error state to the TextField
                                            helperText={formSubmitted && !createData.familia ? 'Este Campo es obligatorio *' : ''}
                                            FormHelperTextProps={{
                                                sx: {
                                                    fontSize: '1.1rem',
                                                    fontWeight: 'bold'
                                                },
                                            }}
                                            sx={{
                                                mb: 1,
                                                '& .MuiInputBase-input': {
                                                },
                                            }}

                                        />
                                    )}
                                    isOptionEqualToValue={(option, value) => option.id === value?.id}

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
                                    id="combo-box-grupos"
                                    options={grupos}
                                    getOptionLabel={(option) => option.nombre}
                                    value={createData.grupo}
                                    onChange={(event, newValue) => setCreateData({ ...createData, grupo: newValue })}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Grupos"
                                            margin='dense'
                                            error={formSubmitted && !createData.grupo} // Add error state to the TextField
                                            helperText={formSubmitted && !createData.grupo ? 'Este Campo es obligatorio *' : ''}
                                            FormHelperTextProps={{
                                                sx: {
                                                    /* Agrega los estilos que desees para el texto del helper text */
                                                    fontSize: '1.1rem',
                                                    // color: theme.palette.secondary.main,
                                                    fontWeight: 'bold'
                                                },
                                            }}
                                            sx={{
                                                mb: 1,
                                                '& .MuiInputBase-input': {
                                                    // height: '30px',
                                                },
                                            }}
                                        />
                                    )}
                                    isOptionEqualToValue={(option, value) => option.id === value?.id}

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
                                        <TextField
                                            {...params}
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
                autoHideDuration={6000} // Duración en milisegundos (ajusta según tus preferencias)
                onClose={handleCloseSnackbar}
                message={snackBarMessage}
            >
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