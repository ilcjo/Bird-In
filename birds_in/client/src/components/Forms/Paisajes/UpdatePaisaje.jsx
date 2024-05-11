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
    Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@emotion/react';
import { UpdateAveImage, actualizarAve, getInfoForUpdate } from '../../../redux/actions/createBirds';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import wikipediaLogo from '../../../assets/images/wikilogo.png'
import ebirdLogo from '../../../assets/images/Logo_ebird.png'
import { Link, useNavigate } from 'react-router-dom';
import { getOptionsData } from '../../../redux/actions/fetchOptions';
import SaveIcon from '@mui/icons-material/Save';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import SearchIcon from '@mui/icons-material/Search';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { deleteBird } from '../../../redux/actions/fetchAllBirds';


export const UpdatePaisaje = ({ isEnable, changeTab, showUpdateBird, showSearchBird, selectedBird, changeImagenExist }) => {

    const theme = useTheme()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const labelStyles = {
        color: theme.palette.primary.main, // Color del texto del label
        marginTop: '-10px',
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
            // height: '50px',
            // marginTop: '100px',
            // width: '180px' // Ejemplo: cambia el color del texto a azul
        },

    };

    const { paises, zonas } = useSelector(state => state.birdSlice.options)
    const { infoAveForUpdate } = useSelector(state => state.createBird)
    const { infoLandForUpdate } = useSelector(state => state.createLand);

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
    const sortedZonas = sortAlphabetically(zonas)

    const initialCreateData = {
        pais: infoAveForUpdate.paise || [],
        zona: infoAveForUpdate.zona || [],
        descripcion: infoAveForUpdate.descripcion || '',
        link: infoAveForUpdate.url || '',
        ImgDescatada: infoAveForUpdate.destacada || '',
        idAve: infoAveForUpdate.id|| 0,
        urlImagen: infoAveForUpdate.imagenes_paisajes || [],
    }

    const [createData, setCreateData] = React.useState(initialCreateData)
    const [imageURL, setImageURL] = React.useState([]); // Para mostrar la imagen seleccionada
    const [imageFile, setImageFile] = React.useState([]); // Para almacenar el Blob de la imagen
    const [allImageURLs, setAllImageURLs] = React.useState([]); // Nuevo estado para mantener todas las URLs de las imágenes
    const [showBackdrop, setShowBackdrop] = React.useState(false);
    const [loadingMessage, setLoadingMessage] = React.useState('Cargando...');
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [errorSnackbarOpen, setErrorSnackbarOpen] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState(null);
    const [snackBarMessage, setSnackBarMessage] = React.useState('El ave se ha Actualizado correctamente.');

    const handleDeleteRegistro = async () => {
        try {
            setShowBackdrop(true);
            setLoadingMessage('Eliminando...');

            // Dispatch the action to delete the bird
            await dispatch(deleteBird(infoAveForUpdate.id_ave));

            // If the delete operation is successful
            setOpenSnackbar(true);
            setSnackBarMessage('El Registro del Ave se ha eliminado correctamente');
        } catch (error) {
            console.error('Error al eliminar el registro:', error);
            setErrorMessage(`Ocurrió un error: ${error.message}`);
            setErrorSnackbarOpen(true);
        } finally {
            // This block will be executed whether there's an error or not
            setShowBackdrop(false);
            handleReturnSearch()
        }
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    const handleImageChange = (event) => {
        const selectedImages = event.target.files;
        if (selectedImages.length > 0) {
            // Crear un array para almacenar las URLs de las imágenes (para mostrarlas en el formulario)
            const imageUrls = [];
            // Recorrer todas las imágenes seleccionadas
            for (let i = 0; i < selectedImages.length; i++) {
                const selectedImage = selectedImages[i];
                // Crear una URL para cada imagen seleccionada
                const imageUrl = URL.createObjectURL(selectedImage)
                // Agregar la URL al array
                imageUrls.push(imageUrl);
                // Opcionalmente, puedes guardar los archivos en el estado
            }
            // Actualizar el estado con el array de URLs de imágenes
            setImageURL(imageUrls);
            // Actualizar el estado que almacena todas las URL de las imágenes seleccionadas
            setAllImageURLs((prevImageURLs) => [...prevImageURLs, ...imageUrls]);
            // Actualizar el estado con los archivos de imagen
            setImageFile((prevImageFiles) => [...prevImageFiles, ...selectedImages]);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setCreateData({
            ...createData,
            [name]: value,
        });
    };

    const handleRemoveImage = (index) => {
        // Obtener el índice de la imagen destacada antes de eliminarla
        // const isRemovingDestacada = index === destacadaIndex;

        // Revocar la URL de la imagen eliminada
        URL.revokeObjectURL(imageURL[index]);

        // Crear una copia del array de URLs de imágenes
        const updatedImageURLs = [...imageURL];

        // Eliminar la URL de la imagen en la posición 'index'
        updatedImageURLs.splice(index, 1);

        // Actualizar el estado con el nuevo array de URLs
        setImageURL(updatedImageURLs);

        // Si la imagen eliminada era la destacada, desmarcarla
        // if (isRemovingDestacada) {
        //     setDestacadaIndex(null);
        // }

        // Actualizar el estado que almacena todas las URL de las imágenes seleccionadas
        setAllImageURLs((prevAllImageURLs) => prevAllImageURLs.filter((_, i) => i !== index))
        // setAllImageURLs(updatedImageURLs);

        // Crear una copia del array de archivos de imágenes
        const updatedImageFiles = [...imageFile];

        // Eliminar el archivo de imagen en la posición 'index'
        updatedImageFiles.splice(index, 1);

        // Actualizar el estado con el nuevo array de archivos de imágenes
        setImageFile(updatedImageFiles);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setShowBackdrop(true);

        try {

            let imageUrl = '';
            if (imageFile && imageFile.length > 0) {
                const formData = new FormData();
                for (let i = 0; i < imageFile.length; i++) {
                    formData.append('images', imageFile[i]);
                }
                setLoadingMessage('Subiendo imágenes...');
                imageUrl = await saveImageFtpWithMessage(formData);
                setLoadingMessage('Actualizando ave...');
            }

            if (createData.ingles) {
                localStorage.setItem('nombreIngles', createData.ingles);
            }

            await createBirdWithMessage(createData, imageUrl);

            setShowBackdrop(false);
            setLoadingMessage('Cargando...');
            setOpenSnackbar(true);

            setImageURL([]);
            setImageFile([]);
            setAllImageURLs([])
            if (imageUrl) {
                setSnackBarMessage('El ave se ha Actualizado correctamente.');
                dispatch(getInfoForUpdate(infoAveForUpdate.id_ave));
                changeImagenExist();
            } else {
                setSnackBarMessage('El ave se ha Actualizado correctamente.');
                dispatch(getInfoForUpdate(infoAveForUpdate.id_ave));
            }
            // setSnackBarMessage('El ave se ha Actualizado correctamente.')
            // dispatch(getInfoForUpdate(infoAveForUpdate.id_ave))
            // changeImagenExist()
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

    const saveImageFtpWithMessage = async (formData) => {
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

    const createBirdWithMessage = async (createData, imageUrl) => {
        try {
            await dispatch(actualizarAve({ ...createData, urlImagen: imageUrl }));
        } catch (error) {
            console.error('Error al actualizar el ave en la base de datos:', error);
            throw new Error('Error al actualizar el ave.');
        }
    };

    React.useEffect(() => {
        setCreateData(initialCreateData);
    }, [infoAveForUpdate]);

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
                    width: '80%',
                    margin: 'auto',
                    backgroundColor: 'rgba(0, 56, 28, 0.1)', // Establece el fondo transparente deseado
                    backdropFilter: 'blur(2px)', // Efecto de desenfoque de fondo
                    padding: '0px 40px 30px 0px',
                    borderRadius: '0px 0px 20px 20px',

                }} >

                    <Grid item xs={12} sm={12}>
                        <Button
                            sx={{
                                mt: 5,
                                mb: -8,
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                ml: '75%',
                                color: theme.palette.primary.light,
                                backgroundColor: 'rgba(0, 56, 28, 0.1)', // Establece el fondo transparente deseado
                                backdropFilter: 'blur(2px)', // Efecto de desenfoque de fondo
                            }}
                            variant="outline"
                            onClick={handleReturnSearch}
                            startIcon={<SearchIcon />}
                        >
                            Buscar Nuevo Registro
                        </Button>

                        <Typography variant='h2' color='primary' sx={{ mb: 3 }}>
                            Formulario de Actualización
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
                        <Button onClick={handleSubmit}
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
                        {/* Mostrar imagen cargada */}
                        {allImageURLs.length > 0 && (
                            <Grid container spacing={1}>
                                {allImageURLs.map((imageUrl, index) => (
                                    <Grid item key={index}>
                                        <div style={{ position: 'relative' }}>
                                            <img
                                                src={imageUrl}
                                                alt={`Imagen seleccionada ${index + 1}`}
                                                style={{ maxWidth: '200px', maxHeight: '100px', marginTop: '10px' }}
                                            />
                                            {/* <Checkbox
                                                color="primary"
                                                checked={index === destacadaIndex}
                                                onChange={() => handleSetDestacada(index)}
                                            /> */}
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
                        <TextField
                            variant="filled"
                            name="cientifico"
                            label="Nombre cientifico"
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
                    </Grid>
                    <Grid item xs={12} sm={6} sx={{ mt: -5.5 }}>
                        <Autocomplete
                            disablePortal
                            id="combo-box-grupos"
                            options={sortedGrupos}
                            getOptionLabel={(option) => option.nombre}
                            value={createData.grupo}
                            onChange={(event, newValue) => setCreateData({ ...createData, grupo: newValue })}
                            renderInput={(params) =>
                                <TextField {...params}
                                    label="Grupo"
                                    InputLabelProps={{
                                        sx: labelStyles, // Estilo del label
                                    }}
                                    InputProps={{
                                        ...params.InputProps,
                                        sx: inputStyles, // Estilo del input

                                    }}
                                />}
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
                            renderInput={(params) =>
                                <TextField {...params}
                                    label="Familia"
                                    InputLabelProps={{
                                        sx: labelStyles, // Estilo del label
                                    }}
                                    InputProps={{
                                        ...params.InputProps,
                                        sx: inputStyles, // Estilo del input

                                    }}
                                />}
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
                                <TextField {...params}
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
                            // filterOptions={(options, state) => {
                            //     const inputValue = state.inputValue.toLowerCase();
                            //     const selectedPaises = createData.pais || []; // Asegúrate de que selectedPaises sea un array

                            //     return options.filter((option) => {
                            //         if (selectedPaises.length === 0) {
                            //             return true; // No hay paises seleccionados, muestra todas las zonas
                            //         }
                            //         return selectedPaises.some((pais) => option.nombre_pais === pais.nombre);
                            //     });
                            // }}
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
                                        <Link to={createData.urlWiki} target="_blank" >
                                            <img src={wikipediaLogo} alt="Wikipedia Logo" style={{
                                                paddingLeft: '10px',
                                                marginTop: '-4px',
                                                width: '45px', // Ajusta el ancho de la imagen
                                                height: '35px', // Ajusta la altura de la imagen
                                            }} />
                                        </Link>

                                    </InputLabel>

                                ),
                                sx: inputStyles, // Establece el estilo del input
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
                                        <Link to={createData.urlBird} target="_blank" >
                                            <img src={ebirdLogo} alt="EBird Logo" style={{
                                                paddingRight: '0px',
                                                // marginTop: '10px',
                                                width: '110px', // Ajusta el ancho de la imagen
                                                height: '39px', // Ajusta la altura de la imagen
                                            }} />
                                        </Link>

                                    </InputLabel>
                                ),
                                sx: inputStyles, // Establece el estilo del input
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            sx={{
                                ml: '78%',
                                mb: 0,
                                fontSize: '1.2rem', padding: '5px 10px', fontWeight: 'bold', textTransform: 'none', color: 'white',
                                '&:hover': {
                                    backgroundColor: theme.palette.primary.light, // Cambia el color de fondo en hover
                                    color: 'black', // Cambia el color del texto en hover
                                    textTransform: 'none',
                                },
                            }}
                            endIcon={<DeleteForeverIcon />}
                            variant="contained"
                            color='secondary'
                            onClick={handleDeleteRegistro}

                        >
                            Eliminar Registro
                        </Button>
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