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
    Snackbar,
    TextField,
    Typography
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@emotion/react';
import { UpdateAveImage, actualizarAve } from '../../redux/actions/createBirds';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';

export const UpdateBirds = ({ isEnable }) => {

    const theme = useTheme()
    const dispatch = useDispatch()
    const { paises, familias, grupos } = useSelector(state => state.birdSlice.options)
    const { infoAveForUpdate } = useSelector(state => state.createBird)
    console.log('soy infoupdate actios', infoAveForUpdate)

    const initialCreateData = {
        grupo: infoAveForUpdate.grupo || null,
        familia: infoAveForUpdate.familia || null,
        pais: infoAveForUpdate.paises || [],
        zona: infoAveForUpdate.zonas || '',
        cientifico: infoAveForUpdate.nombre_cientifico || '',
        ingles: infoAveForUpdate.nombre_ingles || '',
        urlWiki: infoAveForUpdate.url_wiki || '',
        urlBird: infoAveForUpdate.url_bird || '',
        idAve: infoAveForUpdate.id_ave || 0,
        urlImagen: infoAveForUpdate.imagenes_aves || [],


    }

    console.log('soy initianstate', initialCreateData)
    const [createData, setCreateData] = React.useState(initialCreateData)
    console.log('soy formulario data', createData)
    const [imageURL, setImageURL] = React.useState(null); // Para mostrar la imagen seleccionada
    const [imageFile, setImageFile] = React.useState(null); // Para almacenar el Blob de la imagen
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
        const selectedImage = event.target.files[0];
        if (selectedImage) {
            setImageFile(selectedImage);
            const imageURL = URL.createObjectURL(selectedImage);
            setImageURL(imageURL);
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
        URL.revokeObjectURL(imageURL);
        setImageFile(null);
        setImageURL(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setShowBackdrop(true);
        setLoadingMessage('Actualizando ave...');

        try {
            let imageUrl = '';

            if (imageFile) {
                const formData = new FormData();
                formData.append('image', imageFile);

                imageUrl = await saveImageFtpWithMessage(formData);

                setLoadingMessage('Actualizando ave...'); // Restaura el mensaje después de subir la imagen
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
                urlWiki: '',
                urlBird: '',
                idAve: 0,
                urlImagen: '',
            });
            setImageURL(null);
            setImageFile(null);
            isEnable(false);
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
                if (response && response.data && response.data.imageUrl) {
                    const imageUrlString = response.data.imageUrl;
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
                                variant="contained" // Cambia el estilo del botón a "contained" para un aspecto diferente
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

                        {/* Mostrar imagen cargada */}
                        <Grid container spacing={2}>
                            {imageURL && (
                                <Grid item >
                                    <div style={{ position: 'relative' }}>
                                        <img
                                            src={imageURL}
                                            alt="Imagen seleccionada"
                                            style={{ maxWidth: '200px', maxHeight: '100px', marginTop: '10px' }}
                                        />
                                        <IconButton
                                            color="primary"
                                            onClick={handleRemoveImage}
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
                            )}
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <Typography variant='h5' color='primary.light' sx={{ mb: 3 }} >
                            Datos del Ave
                            <Divider sx={{ my: 2 }} />
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} sx={{ mt: -4 }}>

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
                            name="cientifico"
                            label="Nombre cientifico"
                            value={createData.cientifico}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            variant="filled"
                            name="Comun"
                            label="Nombre común"
                            value={createData.cientifico}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} sx={{ mt: -4 }}>
                        <Autocomplete
                            disablePortal
                            id="combo-box-grupos"
                            options={grupos}
                            getOptionLabel={(option) => option.nombre}
                            value={createData.grupo}
                            onChange={(event, newValue) => setCreateData({ ...createData, grupo: newValue })}
                            renderInput={(params) => <TextField {...params} label="Grupos" />}
                            isOptionEqualToValue={(option, value) => option.id === value?.id}
                            sx={{ mb: 3, mt: 1 }}
                        />
                        <Autocomplete
                            disablePortal
                            id="combo-box-familias"
                            options={familias}
                            getOptionLabel={(option) => option.nombre}
                            value={createData.familia}
                            onChange={(event, newValue) => setCreateData({ ...createData, familia: newValue })}
                            renderInput={(params) => <TextField {...params} label="Familias" />}
                            isOptionEqualToValue={(option, value) => option.id === value?.id}
                            sx={{ mb: 3 }}
                        />

                        <Autocomplete
                            disablePortal
                            id="combo-box-pais"
                            options={paises}
                            getOptionLabel={(option) => option.nombre}
                            value={createData.pais}
                            onChange={(event, newValue) => setCreateData({ ...createData, pais: newValue })}
                            renderInput={(params) => <TextField {...params} label="Pais" />}
                            isOptionEqualToValue={(option, value) => option.id === value?.id}
                            multiple
                            
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
                            label="Url Wiki"
                            multiline
                            rows={1}
                            variant="filled"
                            value={createData.urlWiki}
                            onChange={handleInputChange}
                            sx={{ my: 2 }}
                            fullWidth
                            margin="normal"
                        />

                        <TextField
                            name="urlBird"
                            label="Url Bird"
                            multiline
                            rows={1}
                            variant="filled"
                            value={createData.urlBird}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} >
                        <Button onClick={handleSubmit}
                            sx={{
                                fontSize: '1.3rem', padding: '5px 10px', fontWeight: 'bold', textTransform: 'none',
                                '&:hover': {
                                    backgroundColor: theme.palette.primary.dark, // Cambia el color de fondo en hover
                                    color: theme.palette.primary.light, // Cambia el color del texto en hover
                                    textTransform: 'none',
                                },
                            }}
                            variant="contained"
                            color="primary"
                        >Enviar</Button>
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
            >
                <Alert
                    elevation={6}
                    variant="filled"
                    severity="success"
                    onClose={handleCloseSnackbar}
                >
                    El ave se ha creado correctamente.
                </Alert>
            </Snackbar>
        </React.Fragment>
    );
};