import * as  React from 'react'
import { Autocomplete, Box, Button, Divider, Grid, IconButton, TextField, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@emotion/react';
import { createBird, saveImageFtp } from '../../redux/actions/createBirds';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';



export const CreateBird = () => {
    const theme = useTheme()
    const dispatch = useDispatch()
    const { paises, familias, grupos } = useSelector(state => state.birdSlice.options)
    const [imageURL, setImageURL] = React.useState(null); // Para mostrar la imagen seleccionada
    const [imageFile, setImageFile] = React.useState(null); // Para almacenar el Blob de la imagen

    const [createData, setCreateData] = React.useState({
        grupo: null,
        familia: null,
        pais: [],
        zona: '',
        cientifico: '',
        ingles: '',
        urlWiki: '',
        urlBird: '',
    });
    console.log(createData)
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
        if (imageFile) {
            const formData = new FormData();
            formData.append('image', imageFile);
            try {
                // Utiliza Promise.all para esperar que ambas promesas se resuelvan
                await Promise.all([saveImageFtpWithMessage(formData), createBirdWithMessage(createData)]);
                alert("El ave se ha creado correctamente.");
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
                });
                setImageURL(null)
                setImageFile(null)
            } catch (error) {
                alert(error); // Muestra el mensaje de error en caso de que ocurra un error en cualquiera de las dos promesas.
            }
        }
    };
    const saveImageFtpWithMessage = async (formData) => {
        return new Promise((resolve, reject) => {
            dispatch(saveImageFtp(formData))
                .then(() => {
                    resolve(); // Si la carga de la imagen tiene éxito, resuelve la Promesa sin un mensaje.
                })
                .catch((error) => {
                    reject("Error al guardar la imagen en el servidor"); // Si hay un error, resuelve la Promesa con un mensaje.
                });
        });
    };
    
    const createBirdWithMessage = async (createData) => {
        return new Promise((resolve, reject) => {
            dispatch(createBird(createData))
                .then(() => {
                    resolve(); // Si la creación del ave tiene éxito, resuelve la Promesa sin un mensaje.
                })
                .catch((error) => {
                    reject("Error al crear el ave"); // Si hay un error, resuelve la Promesa con un mensaje.
                });
        });
    };
    

    return (

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
                        Formulario de Creación
                    </Typography>
                    <Typography variant='h5' color='primary.light' sx={{ mb: 3 }} >
                        Subir imagenes Galeria
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
                            Subir Imagenes
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
                <Grid item xs={12} sm={6}>

                    <Typography variant='h5' color='primary.light' sx={{ mb: 2 }} >
                        Datos del Ave
                        <Divider sx={{ my: 1 }} />
                    </Typography>

                    <TextField
                        variant="filled"
                        name="ingles"
                        label="Nombre en Ingles"
                        value={createData.ingles}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />

                    <Autocomplete
                        disablePortal
                        id="combo-box-grupos"
                        options={grupos}
                        getOptionLabel={(option) => option.nombre}
                        value={createData.grupo}
                        onChange={(event, newValue) => setCreateData({ ...createData, grupo: newValue })}
                        renderInput={(params) => <TextField {...params} label="Grupos" />}
                        isOptionEqualToValue={(option, value) => option.id === value?.id}

                    />
                    <TextField
                        variant="filled"
                        name="zona"
                        label="Zonas"
                        value={createData.zona}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"

                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography variant='h5' color='secondary.light' sx={{ mb: 3 }}>
                        1
                    </Typography>
                    <TextField
                        variant="filled"
                        name="cientifico"
                        label="Nombre cientifico"
                        value={createData.cientifico}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
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
                    <Typography variant='h5' color='primary.light' sx={{}}>
                        Informacion adicional
                        <Divider sx={{ my: 1 }} />
                    </Typography>
                    <TextField
                        name="urlWiki"
                        label="Url Externa"
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
                <Grid item xs={12} sm={12}>
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
        </Box>
    );
};