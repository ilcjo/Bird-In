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
    IconButton,
    InputLabel,
    Snackbar,
    TextField,
    Typography
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@emotion/react';
import { UpdateAveImage, actualizarAve } from '../../redux/actions/createBirds';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import wikipediaLogo from '../../assets/images/wikilogo.png'
import ebirdLogo from '../../assets/images/cornell-lab-logo.svg'
import { useNavigate } from 'react-router-dom';

export const UpdateBirds = ({ isEnable }) => {
    const theme = useTheme()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { paises, familias, grupos } = useSelector(state => state.birdSlice.options)
    const { infoAveForUpdate } = useSelector(state => state.createBird)
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

    const initialCreateData = {
        grupo: infoAveForUpdate.grupo || null,
        familia: infoAveForUpdate.familia || null,
        pais: infoAveForUpdate.paises || [],
        zona: infoAveForUpdate.zonas || '',
        cientifico: infoAveForUpdate.nombre_cientifico || '',
        ingles: infoAveForUpdate.nombre_ingles || '',
        comun: infoAveForUpdate.nombre_comun || '',
        urlWiki: infoAveForUpdate.url_wiki || '',
        urlBird: infoAveForUpdate.url_bird || '',
        idAve: infoAveForUpdate.id_ave || 0,
        urlImagen: infoAveForUpdate.imagenes_aves || [],
    }

    const [createData, setCreateData] = React.useState(initialCreateData)
    const [imageURL, setImageURL] = React.useState([]); // Para mostrar la imagen seleccionada
    const [imageFile, setImageFile] = React.useState([]); // Para almacenar el Blob de la imagen
    const [showBackdrop, setShowBackdrop] = React.useState(false);
    const [loadingMessage, setLoadingMessage] = React.useState('Cargando...');
    const [openSnackbar, setOpenSnackbar] = React.useState(false);

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };
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
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setCreateData({
            ...createData,
            [name]: value,
        });
    };

    const handleRemoveImage = () => {
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
        setShowBackdrop(true);
        setLoadingMessage('Actualizando ave...');

        try {
            let imageUrl = '';

            if (imageFile && imageFile.length > 0) {
                const formData = new FormData();
                for (let i = 0; i < imageFile.length; i++) {
                    formData.append('images', imageFile[i]); // El nombre 'images' debe coincidir con el nombre del campo en el servidor
                }
                imageUrl = await saveImageFtpWithMessage(formData);

                setLoadingMessage('Actualizando ave...'); // Restaura el mensaje después de subir la imagen
            }
            if (createData.ingles) {
                localStorage.setItem('nombreIngles', createData.ingles);
            }

            await createBirdWithMessage(createData, imageUrl);

            setShowBackdrop(false);
            setLoadingMessage('Cargando...');
            setOpenSnackbar(true);
            // Borra los datos del formulario
            setCreateData({
                grupo: null,
                familia: null,
                pais: [],
                zona: '',
                cientifico: '',
                ingles: '',
                comun: '',
                urlWiki: '',
                urlBird: '',
                idAve: 0,
                urlImagen: [],
            });
            setImageURL([]);
            setImageFile([]);
        } catch (error) {
            console.error('Error:', error);
            setShowBackdrop(false);
        }
    };


    const saveImageFtpWithMessage = async (formData) => {
        return new Promise(async (resolve, reject) => {
            try {
                // Realiza la carga de la imagen y espera la respuesta
                const response = await dispatch(UpdateAveImage(formData));
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
        return new Promise((resolve, reject) => {
            dispatch(actualizarAve({ ...createData, urlImagen: imageUrl }))
                .then(() => {
                    resolve(); // Solo resuelve la Promesa si la actualización del ave tiene éxito.
                })
                .catch((error) => {
                    console.error('Error al actualizar el ave:', error);
                    reject("Error al actualizar el ave"); // Si hay un error, resuelve la Promesa con un mensaje.
                });
        });
    };


    React.useEffect(() => {

        setCreateData(initialCreateData);


    }, [infoAveForUpdate]); //
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
                    backgroundColor: theme.palette.secondary.light,
                    padding: '0px 40px 30px 0px',
                    borderRadius: '20px'
                }} >
                    <Grid item xs={12} sm={12}>
                        <Typography variant='h2' color='primary' sx={{ mb: 2 }}>
                            Formulario de Actualización
                        </Typography>

                        <Typography variant='h5' color='primary.light' sx={{}}>
                            Imágenes Existente
                            <Divider sx={{ my: 1 }} />
                        </Typography>

                        <Typography variant='h5' color='primary.light' sx={{ mb: 3 }} >
                            Subir imágenes a la Galería
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
                                variant="outlined" // Cambia el estilo del botón a "contained" para un aspecto diferente
                                color="primary"
                                component="span" // Indica que es un botón para seleccionar archivo
                                sx={{
                                    fontSize: '1.2rem', padding: '5px 10px', fontWeight: 'bold', textTransform: 'none',
                                    '&:hover': {
                                        backgroundColor: theme.palette.primary.dark, // Cambia el color de fondo en hover
                                        color: theme.palette.primary.light, // Cambia el color del texto en hover
                                        textTransform: 'none',
                                    },
                                }} // Estilo personalizado
                                onChange={handleImageChange}
                            >
                                Subir Imágenes
                            </Button>
                            
                        </label>
                     
                        <Button onClick={handleSubmit}
                            sx={{
                                fontSize: '1.3rem', padding: '5px 10px', fontWeight: 'bold', ml: 5,textTransform: 'none',
                                '&:hover': {
                                    backgroundColor: theme.palette.primary.main, // Cambia el color de fondo en hover
                                    color: theme.palette.primary.light, // Cambia el color del texto en hover
                                    textTransform: 'none',
                                    
                                },
                            }}
                            variant="contained"
                            color="primary"
                        >Hecho</Button>
                  
                        {/* Mostrar imagen cargada */}
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
                            label="Nombre en Ingles"
                            value={createData.ingles}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            variant="filled"
                            name="comun"
                            label="Nombre común"
                            value={createData.comun}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            variant="filled"
                            name="cientifico"
                            label="Nombre cientifico"
                            value={createData.cientifico}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} sx={{ mt: -5.5 }}>
                        <Autocomplete
                            disablePortal
                            id="combo-box-grupos"
                            options={sortedGrupos}
                            getOptionLabel={(option) => option.nombre}
                            value={createData.grupo}
                            onChange={(event, newValue) => setCreateData({ ...createData, grupo: newValue })}
                            renderInput={(params) => <TextField {...params} label="Grupo" />}
                            isOptionEqualToValue={(option, value) => option.id === value?.id}
                            sx={{ mb: 3, mt: 1 }}
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
                            renderInput={(params) => <TextField {...params} label="Familia" />}
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
                            renderInput={(params) => <TextField {...params} label="Países" />}
                            isOptionEqualToValue={(option, value) => option.id === value?.id}
                            multiple
                            filterOptions={(options, state) => {
                                // Filtra las opciones para que coincidan solo al principio de las letras
                                const inputValue = state.inputValue.toLowerCase();
                                return options.filter((option) =>
                                    option.nombre.toLowerCase().startsWith(inputValue)
                                );
                            }}
                        />

                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <TextField
                            variant="filled"
                            multiline
                            name="zona"
                            label="Zonas"
                            rows={3}
                            value={createData.zona}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            helperText='En este campo siempre separar cada zonas por ,  y no espacios'
                            sx={{ mt: -3, mb: 2 }}

                        />
                        <Typography variant='h5' color='primary.light' sx={{}}>
                            Información adicional
                            <Divider sx={{ my: 2 }} />
                        </Typography>
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
                            InputProps={{
                                startAdornment: (
                                    <InputLabel htmlFor="urlWiki" sx={{ display: 'flex', alignItems: 'center' }}>
                                        <img src={wikipediaLogo} alt="Wikipedia Logo" style={{
                                            paddingRight: '5px',
                                            marginTop: '10px',
                                            width: '39px', // Ajusta el ancho de la imagen
                                            height: '39px', // Ajusta la altura de la imagen
                                        }} />
                                        URL
                                    </InputLabel>
                                ),
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
                            InputProps={{
                                startAdornment: (
                                    <InputLabel htmlFor="urlBird" sx={{ display: 'flex', alignItems: 'center' }}>
                                        <img src={ebirdLogo} alt="EBird Logo" style={{
                                            paddingRight: '5px',
                                            marginTop: '10px',
                                            width: '130px', // Ajusta el ancho de la imagen
                                            height: '39px', // Ajusta la altura de la imagen
                                        }} />
                                        URL
                                    </InputLabel>
                                ),
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
                autoHideDuration={5000} // Duración en milisegundos (ajusta según tus preferencias)
                onClose={handleCloseSnackbar}
            >
                <Alert
                    elevation={6}
                    variant="filled"
                    severity="success"
                    onClose={handleCloseSnackbar}
                >
                    El ave se ha creado correctamente.
                    <Button
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
                        Ver Ave
                    </Button>
                </Alert>
            </Snackbar>
        </React.Fragment>
    );
};