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
    useTheme
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
//ICONS
import SaveIcon from '@mui/icons-material/Save';
import wikipediaLogo from '../../../assets/images/icons8-wikipedia-50.png'
//COMPONENTS
import { Loading } from '../../utils/Loading';
import { ImageUploader } from '../../utils/ImageUploader';
import { StyledTextField } from '../../../assets/styles/MUIstyles';
//redux
import { createRegistro, duplicateNameCheck, getInfoForUpdateName } from '../../../redux/mamiferos/actions/crudAction';
import { saveImageFtp } from '../../../redux/mamiferos/actions/photosAction';
import { clasesFamilia, clasesGrupos, clasesOrder, getOptionsDataM } from '../../../redux/mamiferos/actions/fetchOptions';
import { Search } from '../../Dashboard/Mamiferos/Update/Search';
import { IndexTabsUpdates } from '../../Dashboard/Mamiferos/Update/IndexTabsUpdates';


export const CreateForm = ({ changeImagenTab, changeTabSearch, isImages, }) => {

    const theme = useTheme()
    const dispatch = useDispatch()

    const { paises, familias, orden, grupos, zonas } = useSelector(state => state.filters.options)
    const [imageLink, setImageLink] = React.useState([]); // Para mostrar la imagen seleccionada
    const [imageFiles, setImageFiles] = React.useState([]); // Para almacenar el Blob de la imagen
    const [allImageURLs, setAllImageURLs] = React.useState([]);
    const [showBackdrop, setShowBackdrop] = React.useState(false);
    const [loadingMessage, setLoadingMessage] = React.useState('Cargando...');
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [errorSnackbarOpen, setErrorSnackbarOpen] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState(null);
    const [snackBarMessage, setSnackBarMessage] = React.useState('El Mamífero se a creado correctamente.');
    const [RegisterCreated, setRegisterCreated] = React.useState(false);
    const [formSubmitted, setFormSubmitted] = React.useState(false);
    const [combinedOptionsFamilias, setCombinedOptionsFamilias] = React.useState(familias);
    const [combinedOptionsOrders, setCombinedOptionsOrders] = React.useState(orden);
    const [combinedOptionsGrupos, setCombinedOptionsGrupos] = React.useState(grupos);
    const [isFromCreate, setIsFromCreate] = React.useState(false);
    const [isFromCreateImage, setIsFromCreateImage] = React.useState(false);
    // console.log(combinedOptionsOrders, 'combinados order')
    const [createData, setCreateData] = React.useState({
        order: null,
        orderComun: null,
        familia: null,
        grupo: null,
        pais: [],
        zona: [],
        cientifico: '',
        ingles: '',
        comun: '',
        urlWiki: '',
        urlImagen: [],
    });

    const [errors, setErrors] = React.useState({
        order: false,
        familia: false,
        grupo: false,
        ingles: false,
    });
    // console.log(createData, 'info sde ahora')
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

    const handleInputChangeIngles = (event) => {
        const newName = event.target.value;
        // Si no hay duplicados, actualiza el estado createData
        setCreateData({
            ...createData,
            ingles: newName,
        });
        // Reinicia el error al escribir
        setErrors({
            ...errors,
            ingles: false,
        });
        // Reinicia el formulario
        setFormSubmitted(false);
        // Espera 500 mili segundos antes de llamar a la función para comprobar duplicados
        setTimeout(async () => {
            try {
                // Llama a la función para comprobar duplicados
                await dispatch(duplicateNameCheck(newName));
            } catch (error) {
                // Si hay un error, muestra un mensaje de error
                console.error('Error al comprobar duplicados:', String(error));
                alert('Este Registro ya existe');
                // Restablece el valor del input
                localStorage.setItem('nombreIngles', JSON.stringify(newName))
                localStorage.setItem('isExist', JSON.stringify(isFromCreate))
                localStorage.setItem('isFromCreateImage', JSON.stringify(false))
                setIsFromCreate(true)
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
        if (!createData.order) {
            newErrors.order = true;
        }
        if (!createData.familia) {
            newErrors.familia = true;
        }
        if (!createData.grupo) {
            newErrors.grupo = true;
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
        if (!imageFiles || imageFiles.length === 0) {
            // Show an alert indicating that images are required
            alert("Debes cargar al menos una imagen antes de enviar el formulario.");
            return;
        }
        if (imageFiles && imageFiles.length > 0) {
            const formData = new FormData();
            imageFiles.forEach((file) => formData.append('images', file))
            setShowBackdrop(true);
            setLoadingMessage('Subiendo imágenes al Servidor...');
            try {
                // Espera a que la imagen se suba y obtén la URL
                const imageUrls = await uploadImagesFtpAndSaveLinks(formData);
                localStorage.setItem('nombreIngles', JSON.stringify(createData.ingles))
                await createFullEntry(createData, imageUrls);
                setLoadingMessage('Creando el Registro en la DB...');
                setShowBackdrop(false);
                setRegisterCreated(true);
                setOpenSnackbar(true);
                setLoadingMessage('Cargando...');
                setImageLink([]);
                setImageFiles([]);
                setFormSubmitted(false)
                setSnackBarMessage('El Registro se a creado correctamente.')
                setIsFromCreateImage(true)
                localStorage.setItem('isFromCreateImage', JSON.stringify(true))
                localStorage.setItem('isExist', JSON.stringify(false))
                changeTabSearch()
                // setIsFromCreate(true)
                // Añadir un retraso de 10 segundos antes de ejecutar changeImagenExist()
                // setTimeout(() => {
                //     localStorage.setItem('isFromCreateImage', JSON.stringify(isFromCreate))
                //     setIsFromCreateImage(true)
                //     changeTabSearch()
                //     // dispatch(getInfoForUpdateName(createData.ingles));
                //     // changeImagenTab(1);
                //     // isImages(true)
                // }, 1500); // 10000 mili segundos = 10 segundos
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
                const response = await dispatch(saveImageFtp(formData));
                // Verifica si la respuesta contiene la URL de la imagen
                if (response && response.data && response.data.imageUrls) {
                    const imageUrlString = response.data.imageUrls;
                    setImageLink(imageUrlString)
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
            dispatch(createRegistro({ ...createData, urlImagen: imageUrl }))
                .then(() => {
                    resolve(); // Si la creación del ave tiene éxito, resuelve la Promesa sin un mensaje.
                })
                .catch((error) => {
                    reject("Error al crear el Registro"); // Si hay un error, resuelve la Promesa con un mensaje.
                });
        });
    };

    const handleLogoClickW = () => {
        if (createData.urlWiki) {
            window.open(createData.urlWiki, '_blank');
        }
    };

    // React.useEffect(() => {
    //     // Aquí despachas la acción para cargar las opciones al montar el componente
    //     dispatch(getOptionsDataM());
    // }, [dispatch]);

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

    // const handleOrderChange = async (event, newValue) => {
    //     setCreateData(prevState => ({
    //         ...prevState,
    //         order: newValue,
    //         orderComun: newValue.comun,
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

    const handleOrderChange = async (event, newValue) => {
        if (!newValue) {
            // Si el usuario borra la selección, limpiar el estado
            setCreateData(prevState => ({
                ...prevState,
                order: null,
                orderComun: "",
            }));
            setCombinedOptionsFamilias(familias);
            setCombinedOptionsGrupos(grupos);
            return;
        }

        setCreateData(prevState => ({
            ...prevState,
            order: newValue ?? null,
            orderComun: newValue.order_comun || "", // Asegura que orderComun se actualice
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
                                <Typography variant='h1' color='primary' sx={{ mb: 1.5 }}>
                                    Formulario de Creación
                                </Typography>
                            </Grid>
                        </Grid>

                        <Typography variant='h4' color='primary.light' sx={{ mb: 1 }} >
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
                        <Typography variant='h4' color='primary.light' sx={{ mb: 1 }} >
                            Datos del Registro
                            <Divider sx={{ my: 2, borderColor: theme.palette.primary.main, }} />
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} >
                                <TextField
                                    name="ingles"
                                    label="Nombre en Inglés"
                                    value={createData.ingles}
                                    onChange={handleInputChangeIngles}
                                    type='text'
                                    variant="outlined"
                                    margin="dense"
                                    fullWidth
                                    error={formSubmitted && createData.ingles.trim() === ''} // Check if the field is empty when the form is submitted
                                    helperText={formSubmitted && createData.ingles.trim() === '' ? 'Este Campo es obligatorio *' : ''}
                                    FormHelperTextProps={{
                                        sx: {
                                            fontSize: '1.1em',
                                            fontWeight: 'bold'
                                        },
                                    }}
                                />
                                <TextField
                                    name="comun"
                                    label="Nombre común"
                                    value={createData.comun}
                                    onChange={handleInputChange}
                                    type='text'
                                    variant="outlined"
                                    margin="dense"
                                    fullWidth
                                />

                                <TextField
                                    name="cientifico"
                                    label="Nombre científico"
                                    value={createData.cientifico}
                                    onChange={handleInputChange}
                                    type='text'
                                    variant="outlined"
                                    margin="dense"
                                    fullWidth
                                />
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-grupos"
                                    // options={grupos || ''}
                                    groupBy={(option) => option.type === 'extra' ? 'Recomendados' : 'Grupo'}
                                    options={combinedOptionsGrupos}
                                    getOptionLabel={(option) => option.nombre}
                                    value={createData.grupo}
                                    // onChange={(event, newValue) => setCreateData({ ...createData, grupo: newValue })}
                                    onChange={handleGruposChange}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Grupo"
                                            margin="dense"
                                            error={formSubmitted && !createData.grupo} // Add error state to the TextField
                                            helperText={formSubmitted && !createData.grupo ? 'Este Campo es obligatorio *' : ''}
                                            FormHelperTextProps={{
                                                sx: {
                                                    fontSize: '1.1rem',
                                                    fontWeight: 'bold'
                                                },
                                            }}
                                            sx={{
                                                // mb: 1,
                                                '& .MuiInputBase-input': {
                                                },
                                            }}
                                        />
                                    )}
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
                                    id="combo-box-orders"
                                    // options={order}
                                    options={combinedOptionsOrders}
                                    groupBy={(option) => option.type === 'extra' ? 'Recomendados' : 'Orden'}
                                    getOptionLabel={(option) => option.nombre}
                                    value={createData.order ?? null}
                                    onChange={handleOrderChange}
                                    // onChange={(event, newValue) => setCreateData({ ...createData, order: newValue })}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Orden"
                                            margin='dense'
                                            error={formSubmitted && !createData.order} // Add error state to the TextField
                                            helperText={formSubmitted && !createData.order ? 'Este Campo es obligatorio *' : ''}
                                            FormHelperTextProps={{
                                                sx: {
                                                    /* Agrega los estilos que desees para el texto del helper text */
                                                    fontSize: '1.1rem',
                                                    // color: theme.palette.secondary.main,
                                                    fontWeight: 'bold'
                                                },
                                            }}
                                            sx={{
                                                // mb: 1,
                                                '& .MuiInputBase-input': {
                                                    // height: '30px',
                                                },
                                            }}
                                        />
                                    )}
                                    isOptionEqualToValue={(option, value) => option.id === value?.id}
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
                                    value={createData.order ?? null} // Asegurar que el valor refleje el estado
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Order"
                                            margin='dense'
                                            error={formSubmitted && !createData.orderComun}
                                            helperText={formSubmitted && !createData.orderComun ? 'Este Campo es obligatorio *' : ''}
                                        />
                                    )}
                                    isOptionEqualToValue={(option, value) => option.order_comun === value?.order_comun}
                                />
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-familias"
                                    // options={familias}
                                    options={combinedOptionsFamilias}
                                    groupBy={(option) => option.type === 'extra' ? 'Recomendados' : 'Familias'}
                                    getOptionLabel={(option) => option.nombre}
                                    value={createData.familia}
                                    // onChange={(event, newValue) => setCreateData({ ...createData, familia: newValue })}
                                    onChange={handleFamiliaChange}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Familia"
                                            margin="dense"
                                            error={formSubmitted && !createData.familia} // Add error state to the TextField
                                            helperText={formSubmitted && !createData.familia ? 'Este Campo es obligatorio *' : ''}
                                            FormHelperTextProps={{
                                                sx: {
                                                    fontSize: '1.1rem',
                                                    fontWeight: 'bold'
                                                },
                                            }}
                                            sx={{
                                                // mb: 1,
                                                '& .MuiInputBase-input': {
                                                },
                                            }}
                                        />
                                    )}
                                    isOptionEqualToValue={(option, value) => option.id === value?.id}
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
                                        <TextField
                                            {...params}
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
                autoHideDuration={6000} // Duración en milisegundos (ajusta según tus preferencias)
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