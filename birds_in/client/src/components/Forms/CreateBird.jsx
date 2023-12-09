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
    InputLabel,
    Snackbar,
    TextField,
    Typography
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@emotion/react';
import { createBird, getInfoForUpdateName, saveImageFtp } from '../../redux/actions/createBirds';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import wikipediaLogo from '../../assets/images/wikilogo.png'
import ebirdLogo from '../../assets/images/Logo_ebird.png'
import { getOptionsData } from '../../redux/actions/fetchOptions';
import SaveIcon from '@mui/icons-material/Save';
import UploadFileIcon from '@mui/icons-material/UploadFile';


export const CreateBird = ({ showUpdateBird, showSearchBird, selectedBird,changeImagenExist}) => {
    const theme = useTheme()
    const dispatch = useDispatch()
    const { infoAveForUpdate } = useSelector(state => state.createBird)
    const { paises, familias, grupos, zonas } = useSelector(state => state.birdSlice.options)
    const [imageURL, setImageURL] = React.useState([]); // Para mostrar la imagen seleccionada
    const [imageFile, setImageFile] = React.useState([]); // Para almacenar el Blob de la imagen
    const [showBackdrop, setShowBackdrop] = React.useState(false);
    const [loadingMessage, setLoadingMessage] = React.useState('Cargando...');
    const [birdCreated, setBirdCreated] = React.useState(false);
    const [openSnackbar, setOpenSnackbar] = React.useState(false);

    const sortAlphabetically = (array) => {
        return array.slice().sort((a, b) => {
            // Comprobamos si 'a' y 'b' son objetos válidos y tienen una propiedad 'nombre'
            if (a && a.nombre && b && b.nombre) {
                const nameA = a.nombre.charAt(0).toUpperCase() + a.nombre.slice(1);
                const nameB = b.nombre.charAt(0).toUpperCase() + b.nombre.slice(1);
                return nameA.localeCompare(nameB);
            }
            // Si 'a' o 'b' no tienen la propiedad 'nombre', no hacemos nada
            return 0;
        });
    };
    const sortedPaises = sortAlphabetically(paises);
    const sortedFamilias = sortAlphabetically(familias);
    const sortedGrupos = sortAlphabetically(grupos);
    const sortedZonas = sortAlphabetically(zonas);

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
    const [formSubmitted, setFormSubmitted] = React.useState(false);
    // const handleImageChange = (event) => {
    //     const selectedImage = event.target.files[0];
    //     if (selectedImage) {
    //         setImageFile(selectedImage);
    //         const imageURL = URL.createObjectURL(selectedImage);
    //         setImageURL(imageURL);
    //     }
    // };
    const handleImageChange = (event) => {
        const selectedImages = event.target.files;
        if (selectedImages.length > 0) {
            // Opcionalmente, puedes guardar los archivos en el estado
            setImageFile(selectedImages);

            // Crear un array para almacenar las URLs de las imágenes (para mostrarlas en el formulario)
            const imageUrls = [];

            // Recorrer todas las imágenes seleccionadas
            for (let i = 0; i < selectedImages.length; i++) {
                const selectedImage = selectedImages[i];

                // Crear una URL para cada imagen seleccionada
                const imageUrl = URL.createObjectURL(selectedImage);

                // Agregar la URL al array
                imageUrls.push(imageUrl);
            }

            // Actualizar el estado con el array de URLs de imágenes
            setImageURL(imageUrls);

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

    const handleRemoveImage = (index) => {
        // Revocar la URL de la imagen eliminada
        URL.revokeObjectURL(imageURL[index]);

        // Crear una copia del array de URLs de imágenes
        const updatedImageURLs = [...imageURL];

        // Eliminar la URL de la imagen en la posición 'index'
        updatedImageURLs.splice(index, 1);

        // Actualizar el estado con el nuevo array de URLs
        setImageURL(updatedImageURLs);
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
        if (!imageFile || imageFile.length === 0) {
            // Show an alert indicating that images are required
            alert("Debes cargar al menos una imagen antes de enviar el formulario.");
            return;
        }

        if (imageFile && imageFile.length > 0) {
            const formData = new FormData();
            // Agregar las imágenes al formulario FormData
            for (let i = 0; i < imageFile.length; i++) {
                formData.append('images', imageFile[i]); // El nombre 'images' debe coincidir con el nombre del campo en el servidor
            }

            setShowBackdrop(true);
            setLoadingMessage('Subiendo imagen...');

            try {
                // Espera a que la imagen se suba y obtén la URL
                const imageUrl = await saveImageFtpWithMessage(formData);
                // Restaurar el mensaje de carga si es necesario
                setLoadingMessage('Creando ave...');
                await createBirdWithMessage(createData, imageUrl);
                setShowBackdrop(false);
                setLoadingMessage('Cargando...');
                setBirdCreated(true);

                // Abre el Snackbar
                setOpenSnackbar(true);
                // Borra los datos del formulario
                // setCreateData({
                //     grupo: null,
                //     familia: null,
                //     pais: [],
                //     zona: [],
                //     cientifico: '',
                //     ingles: '',
                //     comun: '',
                //     urlWiki: '',
                //     urlBird: '',
                //     urlImagen: [],
                // });
                setImageURL([]);
                setImageFile([]);
                setFormSubmitted(false)
                dispatch(getInfoForUpdateName(createData.ingles))
                // changeImagenExist()
            } catch (error) {
                setShowBackdrop(false);
                // Muestra el mensaje de error en caso de que ocurra un error en cualquiera de las dos promesas.
                console.error(error);
                // Muestra el mensaje de error al usuario
                alert(`Error: ${error.message}`); // Puedes personalizar cómo muestras el mensaje de error al usuario.
            }
        }
    };

    const saveImageFtpWithMessage = async (formData) => {
        return new Promise(async (resolve, reject) => {
            try {
                // Realiza la carga de la imagen y espera la respuesta
                const response = await dispatch(saveImageFtp(formData));

                // Verifica si la respuesta contiene la URL de la imagen
                if (response && response.data && response.data.imageUrls) {
                    const imageUrlString = response.data.imageUrls;
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

    const createBirdWithMessage = async (createData, imageUrl) => {
        console.log('dentro de dispatch', imageUrl)
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

    React.useEffect(() => {
        // Aquí despachas la acción para cargar las opciones al montar el componente
        dispatch(getOptionsData());
    }, []);


    const labelStyles = {
        color: theme.palette.primary.main, // Color del texto del label
        marginTop: '-9px',
    };

    const inputStyles = {
        // Aquí puedes agregar los estilos que desees para los inputs
        color: theme.palette.primary.light,
        backgroundColor: 'rgba(204,214,204,0.17)',
        borderRadius: '9px',
        height: '80px',
        '& .MuiInputBase-input': {
            padding: '0px',
            paddingLeft: '10px',
        },
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'none',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.main, // Color del borde en el hover
            backgroundColor: 'rgba(0,56,28,0.22) ',
        },
        '& .css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.MuiSelect-select': {
            // Agrega los estilos que desees para el Select
            height: '50px',
            // width: '180px' // Ejemplo: cambia el color del texto a azul
        },

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
                    width: '80%',
                    margin: '0px 0px 0px 150px',
                    backgroundColor: 'rgba(0, 56, 28, 0.1)', // Establece el fondo transparente deseado
                    backdropFilter: 'blur(2px)', // Efecto de desenfoque de fondo
                    padding: '0px 40px 30px 0px',
                    borderRadius: '0px 0px 20px 20px'
                }} >
                    <Grid item xs={12} sm={12}>
                        <Typography variant='h2' color='primary' sx={{ mb: 2 }}>
                            Formulario de Creación
                        </Typography>
                        <Typography variant='h5' color='primary.light' sx={{ mb: 3 }} >
                            Subir imágenes Galería
                            <Divider sx={{ my: 1 }} />
                        </Typography>
                        {/* Input para cargar imágenes */}
                        <input
                            type="file"
                            accept="image/*"
                            multiple  // Permite la selección de múltiples imágenes
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                            id="image-upload-input"
                        />
                        <label htmlFor="image-upload-input"> {/* Utiliza el atributo "for" para asociar el label al input */}
                            <Button
                                variant="contained" // Cambia el estilo del botón a "contained" para un aspecto diferente
                                color="primary"
                                component="span" // Indica que es un botón para seleccionar archivo
                                sx={{
                                    fontSize: '1.2rem', padding: '5px 10px', fontWeight: 'bold', textTransform: 'none',
                                    '&:hover': {
                                        backgroundColor: theme.palette.primary.main, // Cambia el color de fondo en hover
                                        color: theme.palette.primary.light, // Cambia el color del texto en hover
                                        textTransform: 'none',
                                    },
                                }} // Estilo personalizado
                                onChange={handleImageChange}
                                endIcon={<UploadFileIcon />}
                            >
                                Cargar Imágenes
                            </Button>
                        </label>
                        <Button
                            onClick={handleSubmit}
                            sx={{
                                fontSize: '1.3rem', padding: '5px 10px', fontWeight: 'bold', ml: 5, textTransform: 'none',
                                backgroundColor: theme.palette.primary.dark,
                                color: theme.palette.primary.light,
                                '&:hover': {
                                    backgroundColor: theme.palette.primary.dark, // Cambia el color de fondo en hover
                                    color: theme.palette.primary.light, // Cambia el color del texto en hover
                                    textTransform: 'none',
                                },
                            }}
                            variant="contained"
                            color="primary"
                            endIcon={<SaveIcon />}
                        >Grabar</Button>
                        {/* Mostrar imágenes seleccionadas */}
                        {imageURL.length > 0 && (
                            <Grid container spacing={1}>
                                {imageURL.map((imageUrl, index) => (
                                    <Grid item key={index}>
                                        <div style={{ position: 'relative' }}>
                                            <img
                                                src={imageUrl}
                                                alt={`Imagen seleccionada ${index + 1}`}
                                                style={{ maxWidth: '200px', maxHeight: '100px', marginTop: '10px' }}
                                            />
                                            <IconButton
                                                color="primary"
                                                onClick={() => handleRemoveImage(index)}
                                                style={{
                                                    position: 'absolute',
                                                    top: '8px',
                                                    right: '0px',
                                                }}
                                            >
                                                <DisabledByDefaultIcon />
                                            </IconButton>
                                        </div>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </Grid>

                    <Grid item xs={12} sm={12}>
                        <Typography variant='h5' color='primary.light' sx={{ mb: 3 }} >
                            Datos del Ave
                            <Divider sx={{ my: 2 }} />
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} sx={{ mt: -6 }}>
                        <TextField
                            variant="filled"
                            name="ingles"
                            label="Nombre en Inglés"
                            value={createData.ingles}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            error={formSubmitted && createData.ingles.trim() === ''} // Check if the field is empty when the form is submitted
                            helperText={formSubmitted && createData.ingles.trim() === '' ? 'El campo "Nombre en Inglés" es obligatorio.' : ''}
                            InputLabelProps={{
                                sx: labelStyles, // Establece el estilo del label del input

                            }}
                            InputProps={{
                                sx: inputStyles, // Establece el estilo del input
                            }}
                        />

                        <TextField
                            variant="filled"
                            name="cientifico"
                            label="Nombre científico"
                            value={createData.cientifico}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                                sx: labelStyles, // Establece el estilo del label del input

                            }}
                            InputProps={{
                                sx: inputStyles, // Establece el estilo del input
                            }}
                        />
                        <TextField
                            variant="filled"
                            name="comun"
                            label="Nombre común"
                            value={createData.comun}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                                sx: labelStyles, // Establece el estilo del label del input

                            }}
                            InputProps={{
                                sx: inputStyles, // Establece el estilo del input
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} sx={{ mt: -4.5 }}>
                        <Autocomplete
                            disablePortal
                            id="combo-box-grupos"
                            options={sortedGrupos}
                            getOptionLabel={(option) => option.nombre}
                            value={createData.grupo}
                            onChange={(event, newValue) => setCreateData({ ...createData, grupo: newValue })}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Grupos"
                                    error={formSubmitted && !createData.grupo} // Add error state to the TextField
                                    helperText={formSubmitted && !createData.grupo ? 'El campo "Familia" es obligatorio.' : ''}
                                    InputLabelProps={{
                                        sx: labelStyles, // Estilo del label
                                    }}
                                    InputProps={{
                                        ...params.InputProps,
                                        sx: inputStyles, // Estilo del input

                                    }}
                                />
                            )}
                            isOptionEqualToValue={(option, value) => option.id === value?.id}
                            sx={{ mb: 3, }}
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
                            options={sortedFamilias}
                            getOptionLabel={(option) => option.nombre}
                            value={createData.familia}
                            onChange={(event, newValue) => setCreateData({ ...createData, familia: newValue })}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Familia"
                                    error={formSubmitted && !createData.familia} // Add error state to the TextField
                                    helperText={formSubmitted && !createData.familia ? 'El campo "Familia" es obligatorio.' : ''}
                                    InputLabelProps={{
                                        sx: labelStyles, // Estilo del label
                                    }}
                                    InputProps={{
                                        ...params.InputProps,
                                        sx: inputStyles, // Estilo del input

                                    }}
                                />
                            )}
                            isOptionEqualToValue={(option, value) => option.id === value?.id}
                            sx={{ mb: 3 }}
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
                            id="combo-box-pais"
                            options={sortedPaises}
                            getOptionLabel={(option) => option.nombre}
                            value={createData.pais}
                            onChange={(event, newValue) => setCreateData({ ...createData, pais: newValue })}
                            renderInput={(params) =>
                                <TextField
                                    {...params}
                                    label="Países"
                                    InputLabelProps={{
                                        sx: labelStyles, // Estilo del label
                                    }}
                                    InputProps={{
                                        ...params.InputProps,
                                        sx: inputStyles, // Estilo del input

                                    }}

                                />}
                            isOptionEqualToValue={(option, value) => option.id === value?.id}
                            multiple
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
                                    InputLabelProps={{
                                        sx: labelStyles, // Estilo del label
                                    }}
                                    InputProps={{
                                        ...params.InputProps,
                                        sx: inputStyles, // Estilo del input
                                    }}
                                />}
                            isOptionEqualToValue={(option, value) => option.id === value?.id}
                            multiple
                            filterOptions={(options, state) => {
                                const inputValue = state.inputValue.toLowerCase();
                                const selectedPaises = createData.pais || []; // Asegúrate de que selectedPaises sea un array

                                return options.filter((option) => {
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

                        <TextField
                            name="urlWiki"
                            multiline
                            rows={1}
                            variant="filled"
                            value={createData.urlWiki}
                            onChange={handleInputChange}
                            sx={{ my: 2 }}
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                                sx: labelStyles, // Establece el estilo del label del input

                            }}

                            InputProps={{
                                startAdornment: (
                                    <InputLabel htmlFor="urlWiki" sx={{ display: 'flex', alignItems: 'center' }}>
                                        <img src={wikipediaLogo} alt="Wikipedia Logo" style={{
                                            paddingLeft: '10px',
                                            marginTop: '-4px',
                                            width: '40px', // Ajusta el ancho de la imagen
                                            height: '30px', // Ajusta la altura de la imagen
                                        }} />
                                    </InputLabel>
                                ),
                                sx: inputStyles
                            }}
                        />

                        <TextField
                            name="urlBird"
                            multiline
                            rows={1}
                            variant="filled"
                            value={createData.urlBird}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                                sx: labelStyles, // Establece el estilo del label del input

                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputLabel htmlFor="urlBird" sx={{ display: 'flex', alignItems: 'center' }}>
                                        <img src={ebirdLogo} alt="Wikipedia Logo" style={{
                                            paddingRight: '0px',
                                            // marginTop: '10px',
                                            width: '110px', // Ajusta el ancho de la imagen
                                            height: '39px', // Ajusta la altura de la imagen
                                        }} />
                                    </InputLabel>
                                ),
                                sx: inputStyles
                            }}
                        />
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
                autoHideDuration={6000} // Duración en milisegundos (ajusta según tus preferencias)
                onClose={handleCloseSnackbar}
                message={'El ave se ha creado correctamente.'}
            >
            </Snackbar>
        </React.Fragment>
    );
};