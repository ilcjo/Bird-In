import * as  React from 'react'
import { Autocomplete, Box, Button, Divider, Grid, IconButton, TextField, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@emotion/react';
import { createBird, saveImageFtp } from '../../redux/actions/createBirds';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';


export const UpdateHomes = () => {
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