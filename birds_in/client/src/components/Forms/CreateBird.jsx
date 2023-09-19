import * as  React from 'react'
import { Autocomplete, Box, Button, Divider, Grid, IconButton, TextField, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@emotion/react';
import { createBirdData } from '../../redux/actions/createBirds';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import axios from 'axios';


export const CreateBird = () => {
    const theme = useTheme()
    const dispatch = useDispatch()
    const { paises, familias, grupos } = useSelector(state => state.birdSlice.options)
    const [image, setImage] = React.useState(null);
    console.log(image)
    const [createData, setCreateData] = React.useState({
        grupo: null,
        familia: null,
        pais: null,
        zona: '',
        cientifico: '',
        ingles: '',
        imagenes: [],
        descripcion: '',
        url: ''
    });
    console.log(createData)
    // const formData = new FormData();

    const handleImagenChange = (event) => {
        // Maneja el cambio de la entrada de imagen y actualiza el estado
        setImage(event.target.files[0]);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setCreateData({
            ...createData,
            [name]: value,
        });
    };

    const handleRemoveImage = (indexToRemove) => {
        const updatedImages = createData.imagenes.filter((_, index) => index !== indexToRemove);
        setCreateData({
            ...createData,
            imagenes: updatedImages,
        });
    };


    const handleImageUpload = (event) => {
        const files = event.target.files;

        // Verifica si hay archivos seleccionados
        if (files.length > 0) {
            setCreateData({
                ...createData,
                imagenes: [...createData.imagenes, ...files],
            });
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Crea un objeto FormData para enviar la imagen al servidor
        const formData = new FormData();
        formData.append('image', image);
        try {
            // Realiza la solicitud POST con Axios
            const response = await axios.post('aves/upload_image', formData, {
              headers: {
                'Content-Type': 'multipart/form-data', // Asegúrate de establecer el tipo de contenido correcto
              },
            });
      
            // Maneja la respuesta del servidor (puede ser un mensaje de éxito o error)
            console.log('Respuesta del servidor:', response.data);
          } catch (error) {
            // Maneja los errores de la solicitud
            console.error('Error al enviar la imagen:', error);
          }
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
                        onChange={handleImagenChange}
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
                            onChange={handleImageUpload}
                        >
                            Subir Imagenes
                        </Button>
                    </label>

                    {/* Mostrar imágenes cargadas */}
                    <Grid container spacing={2}>
                        {createData.imagenes.map((imageUrl, index) => (
                            <Grid item key={index}>
                                <div style={{ position: 'relative' }}>
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt="Imagen seleccionada"
                                        style={{ maxWidth: '200px', maxHeight: '100px', marginTop: '10px' }}
                                    />
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleRemoveImage(index)}
                                        style={{
                                            position: 'absolute',
                                            top: '8px',
                                            right: '0',
                                        }}
                                    >
                                        <DisabledByDefaultIcon />
                                    </IconButton>
                                </div>
                            </Grid>
                        ))}
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


                    />
                </Grid>
                <Grid item xs={12} sm={12}>
                    <Typography variant='h5' color='primary.light' sx={{}}>
                        Informacion adicional
                        <Divider sx={{ my: 1 }} />
                    </Typography>
                    <TextField
                        name="url"
                        label="Url Externa"
                        multiline
                        rows={1}
                        variant="filled"
                        value={createData.url}
                        onChange={handleInputChange}
                        sx={{ my: 2 }}
                        fullWidth
                        margin="normal"
                    />

                    <TextField
                        name="descripcion"
                        label="Descripción"
                        multiline
                        rows={4}
                        variant="filled"
                        value={createData.descripcion}
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