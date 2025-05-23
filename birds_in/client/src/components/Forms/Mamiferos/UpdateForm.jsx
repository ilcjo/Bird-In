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
    useTheme,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
//ICONS
import wikipediaLogo from '../../../assets/images/icons8-wikipedia-50.png'
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
//COMPONENTS
import { ImageUploader } from '../../utils/ImageUploader';
import { StyledTextField } from '../../../assets/styles/MUIstyles';
import { Loading } from '../../utils/Loading';
//redux
import { actualizarRegistro, deleteRegistro, getInfoForUpdate } from '../../../redux/mamiferos/actions/crudAction';
import { UpdateImage } from '../../../redux/mamiferos/actions/photosAction';
import { clasesFamilia, clasesOrder } from '../../../redux/mamiferos/actions/fetchOptions';


export const UpdateForm = ({ isEnable, changeTab, showUpdate, showSearch, selected, changeImagenExist }) => {

    const theme = useTheme()
    const dispatch = useDispatch()

    const { paises, familias, orden, grupos, zonas } = useSelector(state => state.filters.options)
    const { infoForUpdate } = useSelector(state => state.updateSlice)
    const initialCreateData = {
        order: infoForUpdate.order_mamifero || null,
        familia: infoForUpdate.familias_mamifero || null,
        grupo: infoForUpdate.grupos_mamifero || null,
        pais: infoForUpdate.paises || [],
        zona: infoForUpdate.zonasMamiferos || [],
        cientifico: infoForUpdate.nombre_cientifico || '',
        ingles: infoForUpdate.nombre_ingles || '',
        comun: infoForUpdate.nombre_comun || '',
        urlWiki: infoForUpdate.url_wiki || '',
        ImgDestacada: infoForUpdate.destacada || '',
        id: infoForUpdate.id_mamifero || 0,
        urlImagen: infoForUpdate.imagenes_mamiferos || [],
    }
    // console.log(initialCreateData)
    const [createData, setCreateData] = React.useState(initialCreateData)
    const [imageLink, setImageLink] = React.useState([]); // Para mostrar la imagen seleccionada
    const [imageFiles, setImageFiles] = React.useState([]); // Para almacenar el Blob de la imagen
    const [allImageURLs, setAllImageURLs] = React.useState([]); // Nuevo estado para mantener todas las URLs de las imágenes
    const [showBackdrop, setShowBackdrop] = React.useState(false);
    const [loadingMessage, setLoadingMessage] = React.useState('Cargando...');
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [errorSnackbarOpen, setErrorSnackbarOpen] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState(null);
    const [snackBarMessage, setSnackBarMessage] = React.useState('El Registro se ha Actualizado correctamente.');
    const [combinedOptionsFamilias, setCombinedOptionsFamilias] = React.useState(familias);
    const [combinedOptionsOrders, setCombinedOptionsOrders] = React.useState(orden);
    const [combinedOptionsGrupos, setCombinedOptionsGrupos] = React.useState(grupos);

    React.useEffect(() => {
        setShowBackdrop(true); // Mostrar el backdrop al inicio
        setLoadingMessage('Cargando..'); // Ejemplo de mensaje de carga completada (ajusta según necesites)

        const timer = setTimeout(() => {
            setShowBackdrop(false); // Cerrar el backdrop después de 5 segundos
        }, 1000);

        return () => {
            clearTimeout(timer); // Limpiar el temporizador al desmontar el componente
        };
    }, []);

    React.useEffect(() => {
        setCreateData(initialCreateData);
    }, [infoForUpdate]);


    const handleFamiliaChange = async (event, newValue) => {
        setCreateData(prevState => ({
            ...prevState,
            familia: newValue,
        }));
        if (newValue) {
            try {
                // Aquí llamas a la función que genera datos extra y actualizas el estado
                const extraData = await dispatch(clasesFamilia(newValue.id));
                // console.log(extraData)
                console.log(extraData, 'datos que llegan'); // Verificar qué datos llegan

                // Verificar si extraData contiene familias y grupos
                const extraOrder = extraData.orders ? extraData.orders.map(o => ({ ...o, type: 'extra' })) : [];
                const extraGrupos = extraData.grupos ? extraData.grupos.map(g => ({ ...g, type: 'extra' })) : [];

                // Combinar familias y grupos con las opciones originales
                const newCombinedOptionsOrders = [
                    ...extraOrder, // Agregar las familias extra
                    ...orden,      // Mantener las familias originales
                ];
                const newCombinedOptionsGrupos = [
                    ...extraGrupos, // Agregar las familias extra
                    ...grupos,      // Mantener las familias originales
                ];

                setCombinedOptionsOrders(newCombinedOptionsOrders);
                setCombinedOptionsGrupos(newCombinedOptionsGrupos)
            } catch (error) {
                console.error("Error al obtener datos adicionales:", error);
            }
        }
    };
    const handleOrderChange = async (event, newValue) => {
        console.log(newValue)
        if (!newValue) {
            // Si el usuario borra la selección, limpiar el estado
            setCreateData(prevState => ({
                ...prevState,
                order: null,
            }));
            setCombinedOptionsFamilias(familias);
            setCombinedOptionsGrupos(grupos);
            return;
        }

        setCreateData(prevState => ({
            ...prevState,
            order: newValue ?? null,
        }));

        try {
            // Obtener datos adicionales (familias y grupos)
            const extraData = await dispatch(clasesOrder(newValue.id));

            console.log(extraData, 'datos que llegan'); // Verificar datos recibidos

            // Verificar si extraData contiene familias y grupos
            const extraFamilias = extraData?.familias?.map(f => ({ ...f, type: 'extra' })) || [];
            const extraGrupos = extraData?.grupos?.map(g => ({ ...g, type: 'extra' })) || [];

            // Combinar con opciones originales
            setCombinedOptionsFamilias([...extraFamilias, ...familias]);
            setCombinedOptionsGrupos([...extraGrupos, ...grupos]);
        } catch (error) {
            console.error("Error al obtener datos adicionales:", error);
        }
    };

    // const handleOrderChange = async (event, newValue) => {
    //     setCreateData(prevState => ({
    //         ...prevState,
    //         order: newValue,
    //     }));

    //     if (newValue) {
    //         try {
    //             // Llamar a la función para obtener datos adicionales (familias y grupos)
    //             const extraData = await dispatch(clasesOrder(newValue.id));

    //             console.log(extraData, 'datos que llegan'); // Verificar qué datos llegan

    //             // Verificar si extraData contiene familias y grupos
    //             const extraFamilias = extraData.familias ? extraData.familias.map(f => ({ ...f, type: 'extra' })) : [];
    //             const extraGrupos = extraData.grupos ? extraData.grupos.map(g => ({ ...g, type: 'extra' })) : [];

    //             // Combinar familias y grupos con las opciones originales
    //             const newCombinedOptionsFamilia = [
    //                 ...extraFamilias, // Agregar las familias extra
    //                 ...familias,      // Mantener las familias originales
    //             ];
    //             const newCombinedOptionsGrupos = [
    //                 ...extraGrupos, // Agregar las familias extra
    //                 ...grupos,      // Mantener las familias originales
    //             ];

    //             setCombinedOptionsFamilias(newCombinedOptionsFamilia);
    //             setCombinedOptionsGrupos(newCombinedOptionsGrupos)
    //         } catch (error) {
    //             console.error("Error al obtener datos adicionales:", error);
    //         }
    //     }
    // };


    const handleGruposChange = async (event, newValue) => {
        setCreateData(prevState => ({
            ...prevState,
            grupo: newValue,
        }));

        if (newValue) {
            try {
                // Llamar a la función para obtener datos adicionales (familias y grupos)
                const extraData = await dispatch(clasesGrupos(newValue.id));

                console.log(extraData, 'datos que llegan'); // Verificar qué datos llegan

                // Verificar si extraData contiene familias y grupos
                const extraFamilias = extraData.familias ? extraData.familias.map(f => ({ ...f, type: 'extra' })) : [];
                const extraOrders = extraData.orders ? extraData.orders.map(o => ({ ...o, type: 'extra' })) : [];

                // Combinar familias y grupos con las opciones originales
                const newCombinedOptionsFamilia = [
                    ...extraFamilias, // Agregar las familias extra
                    ...familias,      // Mantener las familias originales
                ];
                const newCombinedOptionsOrders = [
                    ...extraOrders, // Agregar las familias extra
                    ...grupos,      // Mantener las familias originales
                ];

                setCombinedOptionsFamilias(newCombinedOptionsFamilia);
                setCombinedOptionsOrders(newCombinedOptionsOrders)
            } catch (error) {
                console.error("Error al obtener datos adicionales:", error);
            }
        }
    };

    // Usar React.useEffect para manejar el valor inicial cuando se carga el formulario
    React.useEffect(() => {
        const loadInitialData = async () => {
            if (infoForUpdate.familia) {
                const extraDataOrders = await dispatch(clasesFamilia(infoForUpdate.familia.id));
                const newCombinedOptionsOrders = [
                    ...extraDataOrders.map(extra => ({ ...extra, type: 'extra' })), // Agrega los datos extra
                    ...orden, // Mantén las opciones originales
                ];
                setCombinedOptionsOrders(newCombinedOptionsOrders);
            }

            if (infoForUpdate.order) {
                const extraDataFamilias = await dispatch(clasesOrder(infoForUpdate.order.id));
                const newCombinedOptionsFamilias = [
                    ...extraDataFamilias.map(extra => ({ ...extra, type: 'extra' })), // Agrega los datos extra
                    ...familias, // Mantén las opciones originales
                ];
                setCombinedOptionsFamilias(newCombinedOptionsFamilias);
            }
        };

        loadInitialData();
    }, [infoForUpdate, orden, familias]);


    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setCreateData({
            ...createData,
            [name]: value,
        });
    };

    const handleDeleteRegistro = async () => {
        try {
            setShowBackdrop(true);
            setLoadingMessage('Eliminando Registro del servidor...');
            await dispatch(deleteRegistro(infoForUpdate.id_mamifero));
            setOpenSnackbar(true);
            setSnackBarMessage('El Registro se ha eliminado correctamente');
            setTimeout(() => {
                handleReturnSearch()
            }, 2000);
        } catch (error) {
            console.error('Error al eliminar el registro:', error);
            setErrorMessage(`Ocurrió un error: ${error.message}`);
            setErrorSnackbarOpen(true);

        } finally {
            setShowBackdrop(false);
        }
    };

    const handleImageChange = (event) => {
        const selectedImages = event.target.files;
        if (selectedImages.length > 0) {
            const imageUrls = Array.from(selectedImages).map(image => URL.createObjectURL(image));
            setAllImageURLs((prevImageURLs) => [...prevImageURLs, ...imageUrls]);
            setImageFiles((prevImageFiles) => [...prevImageFiles, ...selectedImages]);
        }
    };

    const handleRemoveImage = (index) => {
        URL.revokeObjectURL(imageLink[index]);
        const updatedImageURLs = [...imageLink];
        updatedImageURLs.splice(index, 1);
        setImageLink(updatedImageURLs);
        setAllImageURLs((prevAllImageURLs) => prevAllImageURLs.filter((_, i) => i !== index));
        const updatedImageFiles = [...imageFiles];
        updatedImageFiles.splice(index, 1);
        setImageFiles(updatedImageFiles);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setShowBackdrop(true);
        try {
            let imageUrl = '';
            if (imageFiles && imageFiles.length > 0) {
                const formData = new FormData();
                for (let i = 0; i < imageFiles.length; i++) {
                    formData.append('images', imageFiles[i]);
                }
                setLoadingMessage('Subiendo Imágenes al Servidor...');
                imageUrl = await uploadImagesFtpAndSaveLinks(formData);
                setLoadingMessage('Actualizando Registro...');
            }

            if (createData.ingles) {
                localStorage.setItem('nombreIngles', createData.ingles);
            }

            await createFullEntry(createData, imageUrl);

            setShowBackdrop(false);
            setLoadingMessage('Actualización en proceso...');
            setOpenSnackbar(true);

            setImageLink([]);
            setImageFiles([]);
            setAllImageURLs([])
            if (imageUrl) {
                setSnackBarMessage('El  se ha Actualizado correctamente.');
                dispatch(getInfoForUpdate(infoForUpdate.id_mamifero));
                changeImagenExist();
            } else {
                setSnackBarMessage('El  se ha Actualizado correctamente.');
                dispatch(getInfoForUpdate(infoForUpdate.id_mamifero));
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage(`Ocurrió un error: ${error.message}`);
            setErrorSnackbarOpen(true);
        } finally {
            setShowBackdrop(false);
        }
    };

    const handleReturnSearch = () => {
        showUpdate(false)
        showSearch(true)
        selected(null)
    };

    const uploadImagesFtpAndSaveLinks = async (formData) => {
        try {
            const response = await dispatch(UpdateImage(formData));
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

    const createFullEntry = async (createData, imageUrl) => {
        try {
            await dispatch(actualizarRegistro({ ...createData, urlImagen: imageUrl }));
        } catch (error) {
            console.error('Error al actualizar el registro en la base de datos:', error);
            throw new Error('Error al actualizar el registro.');
        }
    };


    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };


    const handleLogoClickW = () => {
        if (createData.urlWiki) {
            window.open(createData.urlWiki, '_blank');
        }
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
                    width: 'auto',
                    margin: 'auto',
                    backgroundColor: 'rgba(0, 56, 28, 0.1)', // Establece el fondo transparente deseado
                    backdropFilter: 'blur(3px)', // Efecto de desenfoque de fondo
                    padding: '0px 40px 30px 0px',
                    borderRadius: '0px 0px 20px 20px',
                    mb: 10,
                }} >
                    <Grid item xs={12} sm={12}>
                        <Grid container alignItems="center">
                            <Grid item xs={12} sm={9}>
                                <Typography variant='h1' color='primary' sx={{ mb: 3 }}>
                                    Formulario de Actualización
                                </Typography>
                            </Grid>

                            <Grid item xs={12} sm={3} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                <Button
                                    sx={{
                                        fontSize: '1.1rem',
                                        fontWeight: 'bold',
                                        // color: theme.palette.primary.light,
                                        backgroundColor: 'rgba(0, 56, 28, 0.1)', // Establece el fondo transparente deseado
                                        backdropFilter: 'blur(2px)', // Efecto de desenfoque de fondo
                                    }}
                                    variant="outlined"
                                    onClick={handleReturnSearch}
                                    startIcon={<SearchIcon />}
                                >
                                    Buscar Otro Registro
                                </Button>
                            </Grid>
                        </Grid>

                        <Typography variant='h4' color='primary.light' sx={{ mb: 1 }} >
                            Subir imágenes a la Galería
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
                                <Button onClick={handleSubmit}
                                    variant="contained"
                                    color="secondary"
                                    endIcon={<SaveIcon />}
                                >Grabar</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <Typography variant='h4' color='primary.light' sx={{ mb: 1 }} >
                            Datos del Registro
                            <Divider sx={{ my: 2, borderColor: theme.palette.primary.main, }} />
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="ingles"
                                    label="Nombre en Ingles"
                                    value={createData.ingles}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    margin="dense"
                                    fullWidth
                                />
                                <TextField
                                    name="comun"
                                    label="Nombre común"
                                    value={createData.comun}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    margin="dense"
                                    fullWidth
                                />
                                <TextField
                                    name="cientifico"
                                    label="Nombre científico"
                                    value={createData.cientifico}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    margin="dense"
                                    fullWidth
                                    InputProps={{
                                        style: { fontStyle: 'italic' } // Aplica estilo cursiva al texto
                                    }}
                                />
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-grupo"
                                    // options={order}
                                    groupBy={(option) => option.type === 'extra' ? 'Recomendados' : 'Grupo'}
                                    options={combinedOptionsGrupos}
                                    getOptionLabel={(option) => option.nombre}
                                    value={createData.grupo}
                                    // onChange={(event, newValue) => setCreateData({ ...createData, order: newValue })}
                                    onChange={handleGruposChange}
                                    renderInput={(params) =>
                                        <TextField {...params}
                                            label="Grupo"
                                            margin='dense'
                                        />}
                                    isOptionEqualToValue={(option, value) => option.id === value?.id}
                                    // sx={{ mb: 3, mt: 1 }}
                                    filterOptions={(options, state) => {
                                        // Filtra las opciones para que coincidan solo al principio de las letras
                                        const inputValue = state.inputValue.toLowerCase();
                                        return options.filter((option) =>
                                            option.nombre.toLowerCase().startsWith(inputValue)
                                        );
                                    }}
                                    renderGroup={(params) => (
                                        <li key={params.key}>
                                            <Divider sx={{ mt: 1, mb: 1 }} />
                                            <Typography variant="subtitle2" sx={{ pl: 2, color: 'text.secondary' }}>
                                                {params.group}
                                            </Typography>
                                            <ul style={{ padding: 0 }}>{params.children}</ul>
                                        </li>
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-order"
                                    // options={order}
                                    groupBy={(option) => option.type === 'extra' ? 'Recomendados' : 'Orden'}
                                    options={combinedOptionsOrders}
                                    getOptionLabel={(option) => option.nombre}
                                    value={createData.order ?? null}
                                    // onChange={(event, newValue) => setCreateData({ ...createData, order: newValue })}
                                    onChange={handleOrderChange}
                                    renderInput={(params) =>
                                        <TextField {...params}
                                            label="Orden"
                                            margin='dense'

                                        />}
                                    isOptionEqualToValue={(option, value) => option.id === value?.id}
                                    // sx={{ mb: 3, mt: 1 }}
                                    filterOptions={(options, state) => {
                                        // Filtra las opciones para que coincidan solo al principio de las letras
                                        const inputValue = state.inputValue.toLowerCase();
                                        return options.filter((option) =>
                                            option.nombre.toLowerCase().startsWith(inputValue)
                                        );
                                    }}
                                    renderGroup={(params) => (
                                        <li key={params.key}>
                                            <Divider sx={{ mt: 1, mb: 1 }} />
                                            <Typography variant="subtitle2" sx={{ pl: 2, color: 'text.secondary' }}>
                                                {params.group}
                                            </Typography>
                                            <ul style={{ padding: 0 }}>{params.children}</ul>
                                        </li>
                                    )}
                                />
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-order-name"
                                    options={combinedOptionsOrders} // Usa la lista combinada de órdenes
                                    getOptionLabel={(option) => option.order_comun || ''} // Mostrar el nombre común
                                    value={createData.order} // Asegurar que el valor refleje el estado
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Nombre común del orden"
                                            margin='dense'
                                        />
                                    )}
                                    isOptionEqualToValue={(option, value) => option.order_comun === value?.order_comun}

                                />
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-familias"
                                    // options={familias}
                                    groupBy={(option) => option.type === 'extra' ? 'Recomendados' : 'Familias'}
                                    options={combinedOptionsFamilias}
                                    getOptionLabel={(option) => option.nombre}
                                    value={createData.familia}
                                    // onChange={(event, newValue) => setCreateData({ ...createData, familia: newValue })}
                                    onChange={handleFamiliaChange}
                                    renderInput={(params) =>
                                        <TextField {...params}
                                            label="Familia"
                                            margin="dense"
                                        />}
                                    isOptionEqualToValue={(option, value) => option.id === value?.id}
                                    // sx={{ mb: 3 }}
                                    filterOptions={(options, state) => {
                                        // Filtra las opciones para que coincidan solo al principio de las letras
                                        const inputValue = state.inputValue.toLowerCase();
                                        return options.filter((option) =>
                                            option.nombre.toLowerCase().startsWith(inputValue)
                                        );
                                    }}
                                    renderGroup={(params) => (
                                        <li key={params.key}>
                                            <Divider sx={{ mt: 1, mb: 1 }} />
                                            <Typography variant="subtitle2" sx={{ pl: 2, color: 'text.secondary' }}>
                                                {params.group}
                                            </Typography>
                                            <ul style={{ padding: 0 }}>{params.children}</ul>
                                        </li>
                                    )}
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
                                        <TextField {...params}
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
                                <TextField
                                    name="urlWiki"
                                    label='URL Wiki'
                                    variant="outlined"
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
                            </Grid>
                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                <Button
                                    endIcon={<DeleteForeverIcon />}
                                    variant="contained"
                                    color='custom'
                                    onClick={handleDeleteRegistro}
                                    sx={{
                                        color: theme.palette.primary.light,
                                    }}
                                >
                                    Eliminar Registro
                                </Button>
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
                autoHideDuration={5000} // Duración en mili segundos (ajusta según tus preferencias)
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