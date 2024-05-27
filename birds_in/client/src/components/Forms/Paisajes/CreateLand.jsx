import * as  React from 'react'
import {
    Alert,
    Autocomplete,
    Backdrop,
    Box,
    Button,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    IconButton,
    InputAdornment,
    Snackbar,
    TextField,
    Typography
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@emotion/react';
//REDUX
import { createBird, duplicateNameCheck, getInfoForUpdateName, saveImageFtp } from '../../../redux/actions/createBirds';
import { getOptionsData } from '../../../redux/actions/fetchOptions';
import { createLand, duplicateNameCheckP, getInfoForUpdateNameP, saveImageFtpLand } from '../../../redux/paisaje/actionsP/createLands';
//ICONS
import SaveIcon from '@mui/icons-material/Save';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import { ImageUploader } from '../../utils/ImageUploader';
import wikipediaLogo from '../../../assets/images/icons8-wikipedia-50.png'


export const CreateLand = ({ changeImagenExist, changeTabSearch }) => {

    const theme = useTheme()
    const dispatch = useDispatch()
    const { paises, zonas } = useSelector(state => state.birdSlice.options)

    const [imgLink, setImgLink] = React.useState([]); // Para mostrar la imagen seleccionada
    const [imageFiles, setImageFiles] = React.useState([]); // Para almacenar el Blob de la imagen
    const [allImageURLs, setAllImageURLs] = React.useState([]);
    const [showBackdrop, setShowBackdrop] = React.useState(false);
    const [loadingMessage, setLoadingMessage] = React.useState('Cargando...');
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [errorSnackbarOpen, setErrorSnackbarOpen] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState(null);
    const [snackBarMessage, setSnackBarMessage] = React.useState('El ave se a creado correctamente.');
    const [registerCreated, setRegisterCreated] = React.useState(false);

    const [formSubmitted, setFormSubmitted] = React.useState(false);
    const sortAlphabetically = (array) => {
        return array.slice().sort((a, b) => {
            if (a && a.nombre && b && b.nombre) {
                return a.nombre.localeCompare(b.nombre);
            }
            return 0;
        });
    };
    const sortedPaises = sortAlphabetically(paises);
    const sortedZonas = sortAlphabetically(zonas);

    const [createData, setCreateData] = React.useState({
        pais: null,
        zona: null,
        descripcion: '',
        urlWiki: '',
        urlImagen: [],
    });
    const [errors, setErrors] = React.useState({
        pais: false,
        zona: false,
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
    const handleLogoClick = () => {
        if (createData.urlWiki) {
            window.open(createData.urlWiki, '_blank');
        }
    };
    const handleZonaChange = (newValue) => {
        if (!newValue) {
            setCreateData({
                ...createData,
                zona: null,
            });
            return;
        }
        setCreateData({
            ...createData,
            zona: newValue,
        });
        setErrors({
            ...errors,
            zona: false,
        });
        setFormSubmitted(false);

        // Wait 500 milliseconds before checking for duplicates
        setTimeout(async () => {
            try {
                // Llama a la función para comprobar duplicados
                await dispatch(duplicateNameCheckP(newValue.id)); // Assuming newValue is an object with a 'nombre' property
            } catch (error) {
                // Si hay un error, muestra un mensaje de error
                console.error('Error al comprobar duplicados:', String(error));
                alert('Este Registro ya existe');
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

        if (!createData.pais) {
            newErrors.pais = true;
        }
        if (!createData.zona) {
            newErrors.zona = true; // Establecer un error si el campo 'zona' está vacío
        }

        setErrors(newErrors);
        if (Object.values(newErrors).some((error) => error)) {
            return;
        }
        // Check if there are images before attempting to submit the form
        if (imageFiles.length === 0) {
            alert("Debes cargar al menos una imagen antes de enviar el formulario.");
            return;
        }

        if (imageFiles && imageFiles.length > 0) {
            const formData = new FormData();
            // Agregar las imágenes al formulario FormData
            // for (let i = 0; i < imageFiles.length; i++) {
            //     formData.append('images', imageFiles[i]); // El nombre 'images' debe coincidir con el nombre del campo en el servidor
            // }
            imageFiles.forEach((file) => formData.append('images', file))
            setShowBackdrop(true);
            setLoadingMessage('Subiendo imágenes al Servidor...');
            try {
                // Espera a que la imagen se suba y obtén la URL
                const imageUrls = await uploadImagesFtpAndSaveLinks(formData);
                await createFullEntry(createData, imageUrls);
                setLoadingMessage('Creando el Paisaje en la DB...');
                setShowBackdrop(false);
                setRegisterCreated(true);
                setOpenSnackbar(true);
                setLoadingMessage('Cargando...');
                setImgLink([]);
                setImageFiles([]);
                setFormSubmitted(false)
                setSnackBarMessage('El Paisaje se a creado correctamente.')
                dispatch(getInfoForUpdateNameP(createData.zona.id))
                changeImagenExist()
            } catch (error) {
                console.log('este es el error:', String(error))
                // Muestra el mensaje de error en caso de que ocurra un error en cualquiera de las dos promesas.
                setErrorMessage(`Ocurrió un error: ${error}`);
                setErrorSnackbarOpen(true);
                // Muestra el mensaje de error al usuario
            } finally {
                setShowBackdrop(false);
            }
        }
    };

    const uploadImagesFtpAndSaveLinks = async (formData) => {
        return new Promise(async (resolve, reject) => {
            try {
                // Realiza la carga de la imagen y espera la respuesta
                const response = await dispatch(saveImageFtpLand(formData));
                // Verifica si la respuesta contiene la URL de la imagen
                if (response && response.data && response.data.imageUrls) {
                    const imageUrlString = response.data.imageUrls;
                    setImgLink(imageUrlString)
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
            console.log('imagenes q llegan', imageUrl)
            dispatch(createLand({ ...createData, urlImagen: imageUrl }))
                .then(() => {
                    resolve(); // Si la creación del ave tiene éxito, resuelve la Promesa sin un mensaje.
                })
                .catch((error) => {
                    reject("Error al crear el ave"); // Si hay un error, resuelve la Promesa con un mensaje.
                });
        });
    };


    React.useEffect(() => {
        // Aquí despachas la acción para cargar las opciones al montar el componente
        dispatch(getOptionsData());
    }, []);

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
                                <Typography variant='h2' color='primary' sx={{ mb: 2 }}>
                                    Formulario de Creación
                                </Typography>
                            </Grid>
                        </Grid>
                        <Typography variant='h5' color='primary.light' sx={{ mb: 1 }} >
                            Subir imágenes Galería
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
                                        <TextField
                                            {...params}
                                            required
                                            label="Países"
                                            error={errors.pais}
                                            helperText={errors.pais ? 'Este campo es obligatorio' : ''}
                                            FormHelperTextProps={{
                                                sx: {
                                                    fontSize: '1.1rem',
                                                    fontWeight: 'bold'
                                                },
                                            }}
                                            sx={{
                                                '& .MuiInputBase-input': {
                                                    height: '30px',
                                                },
                                            }}
                                        />}
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
                            <Grid item xs={12} sm={6}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-zonas"
                                    options={sortedZonas}
                                    getOptionLabel={(option) => option.nombre}
                                    value={createData.zona}
                                    onChange={(event, newValue) => handleZonaChange(newValue)}
                                    renderInput={(params) =>
                                        <TextField {...params}
                                            required
                                            label="Zonas"
                                            error={errors.zona}
                                            helperText={errors.zona ? 'Este campo es obligatorio' : ''}
                                            FormHelperTextProps={{
                                                sx: {
                                                    fontSize: '1.1rem',
                                                    fontWeight: 'bold'
                                                },
                                            }}
                                            sx={{
                                                '& .MuiInputBase-input': {
                                                    height: '30px',
                                                },
                                            }}
                                        />}
                                    isOptionEqualToValue={(option, value) => option.id === value?.id}
                                    filterOptions={(options, state) => {
                                        const inputValue = state.inputValue.toLowerCase();
                                        const selectedPais = createData.pais; // Obtener el país seleccionado

                                        // Si no hay país seleccionado, mostrar todas las opciones de zona
                                        if (!selectedPais) {
                                            return options.filter((option) =>
                                                option.nombre.toLowerCase().startsWith(inputValue)
                                            );
                                        }

                                        // Filtrar las zonas para que coincidan con la entrada del usuario
                                        // y también pertenezcan al país seleccionado
                                        return options.filter((option) =>
                                            option.nombre.toLowerCase().startsWith(inputValue) &&
                                            option.nombre_pais === selectedPais.nombre
                                        );
                                    }}
                                />

                            </Grid>
                        </Grid>
                        <Grid container spacing={1}>
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    sx={{ my: 2, backgroundColor: 'rgba(204,214,204,0.17)', 
                                        '& .MuiFilledInput-root': {
                                            borderRadius: '9px',
                                            borderColor: '#C1C700',
                                            '&:hover': {
                                                backgroundColor: 'transparent', // Maintain background color on hover
                                                borderColor: '#C1C700',
                                                borderRadius: '9px',
                                            },
                                            '&.Mui-focused': {
                                                backgroundColor: 'transparent', // Maintain background color on focus
                                                borderColor: '#C1C700',
                                                borderRadius: '9px',
                                            },
                                            '&::before': {
                                                backgroundColor: 'transparent',
                                                borderColor: '#C1C700',
                                                borderRadius: '9px',
                                            },
                                            '&:hover::before': {
                                                backgroundColor: 'transparent',
                                                borderColor: '#C1C700',
                                                borderRadius: '9px',
                                            },
                                            '&.Mui-focused::before': {
                                                backgroundColor: 'transparent',
                                                borderColor: '#C1C700',
                                                borderRadius: '9px',
                                            },
                                        },
                                    }}
                                    name="descripcion"
                                    label="Descripción"
                                    value={createData.descripcion}
                                    onChange={handleInputChange}
                                    type='text'
                                    variant="filled"
                                    margin="normal"
                                    fullWidth
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
                                        backgroundColor: 'rgba(204,214,204,0.17)',
                                        '& .MuiFilledInput-root': {
                                            borderRadius: '9px',
                                            borderColor: '#C1C700',
                                            '&:hover': {
                                                backgroundColor: 'transparent', // Maintain background color on hover
                                                borderColor: '#C1C700',
                                                borderRadius: '9px',
                                            },
                                            '&.Mui-focused': {
                                                backgroundColor: 'transparent', // Maintain background color on focus
                                                borderColor: '#C1C700',
                                                borderRadius: '9px',
                                            },
                                            '&::before': {
                                                backgroundColor: 'transparent',
                                                borderColor: '#C1C700',
                                                borderRadius: '9px',
                                            },
                                            '&:hover::before': {
                                                backgroundColor: 'transparent',
                                                borderColor: '#C1C700',
                                                borderRadius: '9px',
                                            },
                                            '&.Mui-focused::before': {
                                                backgroundColor: 'transparent',
                                                borderColor: '#C1C700',
                                                borderRadius: '9px',
                                            },
                                        },

                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">

                                                <IconButton onClick={handleLogoClick}
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
                autoHideDuration={10000} // Duración en milisegundos (ajusta según tus preferencias)
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