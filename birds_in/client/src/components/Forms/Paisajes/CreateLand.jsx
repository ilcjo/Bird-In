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
    Typography
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@emotion/react';
//REDUX
import { createLand, duplicateNameCheckP, duplicateNameCheckPP, getInfoForUpdateNameP, saveImageFtpLand } from '../../../redux/paisaje/actionsP/createLands';
//ICONS
import SaveIcon from '@mui/icons-material/Save';
import { ImageUploader } from '../../utils/ImageUploader';
import PlaceIcon from '@mui/icons-material/Place';
import wikipediaLogo from '../../../assets/images/icons8-wikipedia-50.png'
//COMPONENTES
import { Loading } from '../../utils/Loading';
import { StyledTextField } from '../../../assets/styles/MUIstyles';
import { getOptionsData } from '../../../redux/birds/actions/fetchOptions';


export const CreateLand = ({ changeImagenTab, changeTabSearch, isImages, }) => {

    const theme = useTheme()
    const dispatch = useDispatch()
    const { paisesAll, zonas } = useSelector(state => state.filterSlice.options)

    const [imgLink, setImgLink] = React.useState([]); // Para mostrar la imagen seleccionada
    const [imageFiles, setImageFiles] = React.useState([]); // Para almacenar el Blob de la imagen
    const [allImageURLs, setAllImageURLs] = React.useState([]);
    const [showBackdrop, setShowBackdrop] = React.useState(false);
    const [loadingMessage, setLoadingMessage] = React.useState('Cargando...');
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [errorSnackbarOpen, setErrorSnackbarOpen] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState(null);
    const [snackBarMessage, setSnackBarMessage] = React.useState('El Paisaje se a creado correctamente.');
    const [registerCreated, setRegisterCreated] = React.useState(false);
    const [formSubmitted, setFormSubmitted] = React.useState(false);

    const [createData, setCreateData] = React.useState({
        pais: null,
        zona: null,
        descripcion: '',
        urlWiki: '',
        urlImagen: [],
        map: ''
    });
    // console.log(createData)
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
    const handleMapsClick = () => {
        if (createData.map) {
            window.open(createData.map, '_blank');
        }
    };

    const handleZonaChange = (event, newValue) => {
        // console.log(newValue, 'llegando')
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
            map: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(newValue.nombre)}`,
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
                await dispatch(duplicateNameCheckP(newValue.id));
            } catch (error) {
                // Si hay un error, muestra un mensaje de error
                console.error('Error al comprobar duplicados:', String(error));
                alert('Este Registro ya existe');
                // Restablece el valor del input
                changeTabSearch();
            }
        }, 700);
    };

    const handlePaisChange = (event, newValue) => {
        if (!newValue) {
            setCreateData({
                ...createData,
                pais: null,
            });
            return;
        }

        setCreateData((prevState) => ({
            ...prevState,
            pais: newValue,
            map: !prevState.zona ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(newValue.nombre)}` : prevState.map, // Solo actualizar si zona está vacío
        }));

        setErrors({
            ...errors,
            pais: false,
        });

        setFormSubmitted(false);

        // Wait 700 milliseconds before checking for duplicates
        setTimeout(async () => {
            try {
                // Llama a la función para comprobar duplicados
                await dispatch(duplicateNameCheckPP(newValue.id));
            } catch (error) {
                // Si hay un error, muestra un mensaje de error
                console.error('Error al comprobar duplicados:', String(error));
                alert('Este Registro ya existe');
                // Restablece el valor del input
                changeTabSearch();
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
        // if (!createData.zona) {
        //     newErrors.zona = true; // Establecer un error si el campo 'zona' está vacío
        // }
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
                // localStorage.setItem('nombrePaisaje', JSON.stringify(createData.zona.nombre))
                const nombreZonaOPais = createData.zona && createData.zona.nombre
                    ? createData.zona.nombre
                    : createData.pais.nombre;
                localStorage.setItem('nombrePaisaje', JSON.stringify(nombreZonaOPais));

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
                setTimeout(() => {
                    dispatch(getInfoForUpdateNameP(createData.zona.id))
                    changeImagenTab(1);
                    isImages(true)
                }, 1500);
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
            // console.log('imágenes q llegan', imageUrl)
            dispatch(createLand({ ...createData, urlImagen: imageUrl }))
                .then(() => {
                    resolve(); // Si la creación del ave tiene éxito, resuelve la Promesa sin un mensaje.
                })
                .catch((error) => {
                    reject("Error al crear el Paisaje"); // Si hay un error, resuelve la Promesa con un mensaje.
                });
        });
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
                            Datos del Paisaje
                            <Divider sx={{ my: 2, borderColor: theme.palette.primary.main, }} />
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box"
                                    options={paisesAll}
                                    getOptionLabel={(option) => option.nombre}
                                    value={createData.pais}
                                    // onChange={handlePaisChange}
                                    onChange={(event, newValue) => setCreateData({ ...createData, pais: newValue })}
                                    renderInput={(params) =>
                                        <TextField
                                            {...params}
                                            required
                                            label="Seleccionar País"
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
                                                    // height: '30px',
                                                },
                                            }}
                                        />}
                                    isOptionEqualToValue={(option, value) => option.id === value?.id}
                                // filterOptions={(options, state) => {
                                //     const inputValue = state.inputValue.toLowerCase();
                                //     return options.filter((option) =>
                                //         option.nombre.toLowerCase().startsWith(inputValue)
                                //     );
                                // }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-zonas"
                                    options={zonas}
                                    getOptionLabel={(option) => option.nombre}
                                    value={createData.zona}
                                    onChange={handleZonaChange}
                                    renderInput={(params) =>
                                        <TextField {...params}
                                            required
                                            label="Seleccionar Zona"
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
                                                    // height: '30px',
                                                },
                                            }}
                                        />}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
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
                                <StyledTextField
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
                                <StyledTextField
                                    name="urlWiki"
                                    label='URL Wiki'
                                    variant="filled"
                                    value={createData.urlWiki}
                                    onChange={handleInputChange}
                                    fullWidth
                                    shrink='true'
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
                    </Grid>
                </Grid>
                <Loading
                    message={loadingMessage}
                    open={showBackdrop}
                />
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