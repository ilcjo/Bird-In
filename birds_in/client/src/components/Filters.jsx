import * as React from 'react'
import {
    Box,
    Button,
    FormControl,
    Grid,
    Typography,
    useTheme,
    Autocomplete,
    TextField,
    Backdrop,
    CircularProgress,
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { getInfoBirds, sendParameter } from '../redux/actions/fetchAllBirds'
import { saveFilters } from '../redux/slices/BirdsSlice'
import { fetchNewOptions, getOptionsData } from '../redux/actions/fetchOptions'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom'
import CloseIcon from '@mui/icons-material/Close';


export const Filters = ({ isFilterOpen, setIsFilterOpen }) => {
    const theme = useTheme()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const nombreIngles = localStorage.getItem('nombreIngles');

    React.useEffect(() => {
        if (nombreIngles) {
            // El localStorage tiene el nombre, así que envía el parámetro y cierra el filtro
            const selectOption = { ingles: [{ nombre: nombreIngles }] };
            dispatch(sendParameter(selectOption));
            localStorage.removeItem('nombreIngles')
            setIsFilterOpen(false)

        }
    }, [nombreIngles]);

    const labelStyles = {
        color: theme.palette.primary.main, // Color del texto del label
        marginTop: '-9px',
    };

    const inputStyles = {
        // Aquí puedes agregar los estilos que desees para los inputs
        color: theme.palette.primary.light,
        backgroundColor: 'rgba(204,214,204,0.17)',
        borderRadius: '9px',

        '& .MuiInputBase-input': {
            padding: '0px',
            paddingLeft: '10px',
        },
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'none',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.main, // Color del borde en el hover
            backgroundColor: 'rgba(204,214,204,0.17)',
        },
        '& .css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.MuiSelect-select': {
            // Agrega los estilos que desees para el Select
            height: '50px',
            // width: '180px' // Ejemplo: cambia el color del texto a azul
        },

    };

    const actionsStyles = {
        justifyContent: 'center', // Centrar el botón horizontalmente
        margin: '0px',
        marginTop: '20px',
        gap: '20px',
        fontWeight: 500,
        textAlign: 'center',


        '& .MuiButton-contained': {
            fontSize: '1.3rem', // Aumentar el tamaño del texto a 1.2 rem
            fontWeight: 'bold', // Hacer el texto negrita
            textTransform: 'none',
            '&:hover': {
                backgroundColor: theme.palette.primary.dark, // Cambia el color de fondo en hover
                color: theme.palette.primary.light, // Cambia el color del texto en hover
                textTransform: 'none',
            },
        },

        '& .MuiButton-outlined': {
            fontSize: '1.3rem', // Aumentar el tamaño del texto a 1.2 rem
            fontWeight: 'bold', // Hacer el texto negrita
            textTransform: 'none',
        },
    };

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
    const selectOptionFromSlice = useSelector((state) => state.birdSlice.currentFilters);
    const { nIngles, nCientifico, paises, familias, grupos, zonas } = useSelector(state => state.birdSlice.options)

    const sortedPaises = sortAlphabetically(paises);
    const sortedFamilias = sortAlphabetically(familias);
    const sortedGrupos = sortAlphabetically(grupos);
    const sortedZonas = sortAlphabetically(zonas);
    const sortedNCientifico = sortAlphabetically(nCientifico);
    const sortedNIngles = sortAlphabetically(nIngles);

    const [selectOption, setSelectOption] = React.useState({
        grupo: [],
        familia: [],
        pais: [],
        zona: [],
        cientifico: [],
        ingles: [],
        ...selectOptionFromSlice,
    });
    const [isLoading, setIsLoading] = React.useState(true);
    const [isFetchingOptions, setIsFetchingOptions] = React.useState(false);

    // React.useEffect(() => {
    //     if (isFilterOpen) {
    //         setIsLoading(true); // Set loading to true when filters are open
    //         // Actualiza selectOption solo si isFilterOpen es true
    //         setSelectOption((prevSelectOption) => ({
    //             ...prevSelectOption,
    //             ...selectOptionFromSlice,
    //         }));
    //         setIsLoading(false); // Set loading to false after options are loaded
    //     }
    // }, [isFilterOpen, selectOptionFromSlice]);

    const handleOptionChange = (category, newValue) => {
        setIsFetchingOptions(true); // Activa el indicador de carga

        const updatedSelectOption = {
            ...selectOption,
            [category]: newValue.map((option) => ({
                id: option.id,
                nombre: option.nombre,
            })),
        };

        setSelectOption(updatedSelectOption);
        // Realiza la solicitud para obtener las opciones
        dispatch(fetchNewOptions(updatedSelectOption))
            .then(() => {
                setIsFetchingOptions(false); // Desactiva el indicador de carga cuando la solicitud se completa
            })
            .catch(() => {
                setIsFetchingOptions(false); // Desactiva el indicador de carga en caso de error
            });
    };


    const handleClickFiltrar = () => {
        dispatch(saveFilters(selectOption))
        dispatch(sendParameter(selectOption))
        setIsFilterOpen(false);
    };

    const handleBack = () => {
        setIsFilterOpen(!isFilterOpen);
    };

    const handleReset = () => {
        setIsFetchingOptions(true); // Activa el indicador de carga
        // Realiza la solicitud para obtener las opciones completas
        dispatch(getOptionsData())
            .then(() => {
                setIsFetchingOptions(false); // Desactiva el indicador de carga cuando la solicitud se completa
            })
            .catch(() => {
                setIsFetchingOptions(false); // Desactiva el indicador de carga en caso de error
            });
        setSelectOption({
            grupo: [],
            familia: [],
            pais: [],
            zona: [],
            cientifico: [],
            ingles: []
        });

    };

    const returnMenuClick = () => {
        setSelectOption({
            grupo: [],
            familia: [],
            pais: [],
            zona: [],
            cientifico: [],
            ingles: []
        });
        localStorage.removeItem('nombreIngles')
        dispatch(getOptionsData())
        dispatch(getInfoBirds())
        navigate('/menu')
    };

    React.useEffect(() => {
        return () => {
            setSelectOption({
                grupo: [],
                familia: [],
                pais: [],
                zona: [],
                cientifico: [],
                ingles: []
            });
            dispatch(getOptionsData())
        };
    }, []);

    return (
        <React.Fragment>
            {/* <Backdrop
                sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, color: '#fff' }}
                open={isLoading} // Show the backdrop when loading is true
            >
                <CircularProgress color="inherit" />
            </Backdrop> */}
            <Grid component={Box}
                sx={{
                    height: 'auto',
                    width: '80%',
                    borderRadius: '20px 20px 20px 20px',
                    backgroundColor: 'rgba(0, 61, 21, 0.2)',
                    padding: 2,
                    marginLeft: '90px'
                }} >
                {/* <Grid item >
                    <Typography variant="h2" color='primary.light' sx={{ m: 1 }}>
                        Filtros
                    </Typography>
                </Grid> */}
                <Grid item container alignItems="center">
                    <Grid xs={12} >
                        {/* Grupo */}
                        <FormControl sx={{ m: 1, width: '95%' }}>
                            <Autocomplete
                                multiple
                                id='grupoUnico'
                                value={selectOption.grupo}
                                onChange={(event, newValue) => handleOptionChange('grupo', newValue)}
                                options={sortedGrupos}
                                getOptionLabel={(option) => option.nombre}
                                filterOptions={(options, state) => {
                                    // Filtra las opciones para que coincidan en el primer, segundo o tercer nombre
                                    const inputValue = state.inputValue.toLowerCase();
                                    return options.filter((option) => {
                                        const birdName = option.nombre.toLowerCase();
                                        const birdNamesArray = birdName.split(' ');

                                        // Check if any of the names (first, second, or third) start with the inputValue
                                        return birdNamesArray.some(
                                            (name) => name.startsWith(inputValue)
                                        );
                                    });
                                }}
                                loading={isFetchingOptions}
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
                                renderTags={(value, getTagProps) =>
                                    value.map((option, index) => (
                                        <Typography
                                            key={option.id}
                                            variant="body2" // Elige el variant y otros estilos según tus necesidades
                                            sx={{
                                                display: 'inline-block',
                                                padding: '4px 8px',
                                                color: 'white', // Color del texto de la etiqueta
                                                marginRight: '8px', // Espacio entre etiquetas
                                            }}
                                        >
                                            {option.nombre}
                                        </Typography>
                                    ))
                                }
                                isOptionEqualToValue={(option, value) => option.id === value?.id}
                                disabled={grupos.length === 0}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        {/* Familia */}
                        <FormControl sx={{ m: 1, width: '95%' }}>
                            <Autocomplete
                                multiple
                                value={selectOption.familia}
                                onChange={(event, newValue) => handleOptionChange('familia', newValue)}
                                options={sortedFamilias}
                                getOptionLabel={(option) => option.nombre}
                                loading={isFetchingOptions}
                                filterOptions={(options, state) => {
                                    // Filtra las opciones para que coincidan en el primer, segundo o tercer nombre
                                    const inputValue = state.inputValue.toLowerCase();
                                    return options.filter((option) => {
                                        const birdName = option.nombre.toLowerCase();
                                        const birdNamesArray = birdName.split(' ');

                                        // Check if any of the names (first, second, or third) start with the inputValue
                                        return birdNamesArray.some(
                                            (name) => name.startsWith(inputValue)
                                        );
                                    });
                                }}
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
                                renderTags={(value, getTagProps) =>
                                    value.map((option, index) => (
                                        <Typography
                                            key={option.id}
                                            variant="body2" // Elige el variant y otros estilos según tus necesidades
                                            sx={{
                                                display: 'inline-block',
                                                padding: '4px 8px',
                                                color: 'white', // Color del texto de la etiqueta
                                                marginRight: '8px', // Espacio entre etiquetas
                                            }}
                                        >
                                            {option.nombre}
                                        </Typography>
                                    ))
                                }
                                isOptionEqualToValue={(option, value) => option.id === value?.id}
                                disabled={familias.length === 0}
                            />
                        </FormControl>
                        <Grid />
                        <Grid item xs={12}>
                            {/*Pais */}
                            <FormControl sx={{ m: 1, width: '95%' }}>
                                <Autocomplete
                                    multiple
                                    value={selectOption.pais}
                                    onChange={(event, newValue) => handleOptionChange('pais', newValue)}
                                    options={sortedPaises}
                                    getOptionLabel={(option) => option.nombre}
                                    loading={isFetchingOptions}
                                    filterOptions={(options, state) => {
                                        // Filtra las opciones para que coincidan en el primer, segundo o tercer nombre
                                        const inputValue = state.inputValue.toLowerCase();
                                        return options.filter((option) => {
                                            const birdName = option.nombre.toLowerCase();
                                            const birdNamesArray = birdName.split(' ');

                                            // Check if any of the names (first, second, or third) start with the inputValue
                                            return birdNamesArray.some(
                                                (name) => name.startsWith(inputValue)
                                            );
                                        });
                                    }}
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
                                    renderTags={(value, getTagProps) =>
                                        value.map((option, index) => (
                                            <Typography
                                                key={option.id}
                                                variant="body2" // Elige el variant y otros estilos según tus necesidades
                                                sx={{
                                                    display: 'inline-block',
                                                    padding: '4px 8px',
                                                    color: 'white', // Color del texto de la etiqueta
                                                    marginRight: '8px', // Espacio entre etiquetas
                                                }}
                                            >
                                                {option.nombre}
                                            </Typography>
                                        ))
                                    }
                                    isOptionEqualToValue={(option, value) => option.id === value?.id}
                                    disabled={paises.length === 0}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            {/* Zona */}
                            <FormControl sx={{ m: 1, width: '95%' }}>
                                <Autocomplete
                                    multiple
                                    value={selectOption.zona}
                                    onChange={(event, newValue) => handleOptionChange('zona', newValue)}
                                    options={sortedZonas}
                                    getOptionLabel={(option) => option.nombre}
                                    loading={isFetchingOptions}
                                    // filterOptions={(options, state) => {
                                    //     // Filtra las opciones para que coincidan en el primer, segundo o tercer nombre
                                    //     const inputValue = state.inputValue.toLowerCase();
                                    //     return options.filter((option) => {
                                    //         const birdName = option.nombre.toLowerCase();
                                    //         const birdNamesArray = birdName.split(' ');

                                    //         // Check if any of the names (first, second, or third) start with the inputValue
                                    //         return birdNamesArray.some(
                                    //             (name) => name.startsWith(inputValue)
                                    //         );
                                    //     });
                                    // }}
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
                                    renderTags={(value, getTagProps) =>
                                        value.map((option, index) => (
                                            <Typography
                                                key={option.id}
                                                variant="body2" // Elige el variant y otros estilos según tus necesidades
                                                sx={{
                                                    display: 'inline-block',
                                                    padding: '4px 8px',
                                                    color: 'white', // Color del texto de la etiqueta
                                                    marginRight: '8px', // Espacio entre etiquetas
                                                }}
                                            >
                                                {option.nombre}
                                            </Typography>
                                        ))
                                    }
                                    isOptionEqualToValue={(option, value) => option.id === value?.id}
                                    disabled={zonas.length === 0}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            {/* Cientifico */}
                            <FormControl sx={{ m: 1, width: '95%' }}>
                                <Autocomplete
                                    multiple
                                    value={selectOption.cientifico}
                                    onChange={(event, newValue) => handleOptionChange('cientifico', newValue)}
                                    options={sortedNCientifico}
                                    getOptionLabel={(option) => option.nombre}
                                    loading={isFetchingOptions}
                                    // filterOptions={(options, state) => {
                                    //     // Filtra las opciones para que coincidan en el primer, segundo o tercer nombre
                                    //     const inputValue = state.inputValue.toLowerCase();
                                    //     return options.filter((option) => {
                                    //         const birdName = option.nombre.toLowerCase();
                                    //         const birdNamesArray = birdName.split(' ');
    
                                    //         // Check if any of the names (first, second, or third) start with the inputValue
                                    //         return birdNamesArray.some(
                                    //             (name) => name.startsWith(inputValue)
                                    //         );
                                    //     });
                                    // }}
                                    renderInput={(params) =>
                                        <TextField {...params}
                                            label="Nombre Científico"
                                            InputLabelProps={{
                                                sx: labelStyles, // Estilo del label
                                            }}
                                            InputProps={{
                                                ...params.InputProps,
                                                sx: inputStyles, // Estilo del input

                                            }}
                                        />}
                                    renderTags={(value, getTagProps) =>
                                        value.map((option, index) => (
                                            <Typography
                                                key={option.id}
                                                variant="body2" // Elige el variant y otros estilos según tus necesidades
                                                sx={{
                                                    display: 'inline-block',
                                                    padding: '4px 8px',
                                                    color: 'white', // Color del texto de la etiqueta
                                                    marginRight: '8px', // Espacio entre etiquetas
                                                }}
                                            >
                                                {option.nombre}
                                            </Typography>
                                        ))
                                    }
                                    isOptionEqualToValue={(option, value) => option.id === value?.id}
                                    disabled={nCientifico.length === 0}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl sx={{ m: 1, width: '95%' }} >
                                <Autocomplete
                                    multiple
                                    value={selectOption.ingles}
                                    onChange={(event, newValue) => handleOptionChange('ingles', newValue)}
                                    options={sortedNIngles}
                                    getOptionLabel={(option) => option.nombre}
                                    loading={isFetchingOptions}
                                    filterOptions={(options, state) => {
                                        // Filtra las opciones para que coincidan en el primer, segundo o tercer nombre
                                        const inputValue = state.inputValue.toLowerCase();
                                        return options.filter((option) => {
                                            const birdName = option.nombre.toLowerCase();
                                            const birdNamesArray = birdName.split(' ');
    
                                            // Check if any of the names (first, second, or third) start with the inputValue
                                            return birdNamesArray.some(
                                                (name) => name.startsWith(inputValue)
                                            );
                                        });
                                    }}
                                    renderInput={(params) =>
                                        <TextField {...params}
                                            label="Nombre Inglés"
                                            InputLabelProps={{
                                                sx: labelStyles, // Estilo del label
                                            }}
                                            InputProps={{
                                                ...params.InputProps,
                                                sx: inputStyles, // Estilo del input
                                            }}
                                        />}
                                    renderTags={(value, getTagProps) =>
                                        value.map((option, index) => (
                                            <Typography
                                                key={option.id}
                                                variant="body2" // Elige el variant y otros estilos según tus necesidades
                                                sx={{
                                                    display: 'inline-block',
                                                    padding: '4px 8px',
                                                    color: 'white', // Color del texto de la etiqueta
                                                    marginRight: '8px', // Espacio entre etiquetas
                                                }}
                                            >
                                                {option.nombre}
                                            </Typography>
                                        ))
                                    }
                                    isOptionEqualToValue={(option, value) => option.id === value?.id}
                                    disabled={nIngles.length === 0}
                                />
                            </FormControl>
                        </Grid>
                        <Grid container sx={actionsStyles}>
                            <Button variant="contained" color="primary" onClick={handleClickFiltrar}>
                                Mostrar
                            </Button>
                            <Button variant="outlined" color="primary" onClick={handleReset}>
                                Resetear
                            </Button>
                            <Button variant="outlined" color="primary" onClick={returnMenuClick}>
                                <ArrowBackIcon /> Volver
                            </Button>
                            <Button variant="outlined" color="secondary" onClick={handleBack}>
                                < CloseIcon /> Cerrar
                            </Button>

                        </Grid>
                    </Grid>
                </Grid >
            </Grid>
        </React.Fragment>
    )
};
