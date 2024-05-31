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
    Stack,
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
//ESTADOS GLOBALES
import {  sendParameter } from '../../../redux/actions/fetchAllBirds'
import { cargando, copingFilters, isOneBird, resetCurrentFilters, saveFilters, setNoMoreResults } from '../../../redux/slices/BirdsSlice'
import { fetchNewOptions, getOptionsData } from '../../../redux/actions/fetchOptions'
//ICONS
import CloseIcon from '@mui/icons-material/Close';


export const FiltersAves = ({ isFilterOpen, setIsFilterOpen, pages }) => {
    const theme = useTheme()
    const dispatch = useDispatch()
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

    const sortAlphabetically = (data) => {
        if (Array.isArray(data)) {
            // Si es un array, ordena alfabéticamente
            return data.slice().sort((a, b) => {
                if (a && a.nombre && b && b.nombre) {
                    const nameA = a.nombre.charAt(0).toUpperCase() + a.nombre.slice(1);
                    const nameB = b.nombre.charAt(0).toUpperCase() + b.nombre.slice(1);
                    return nameA.localeCompare(nameB);
                }
                return 0;
            });
        } else if (typeof data === 'object' || data.length === 0) {
            // Si es un objeto, maneja el objeto según tus necesidades
            // Puedes convertirlo en un array antes de ordenarlo o tratarlo de otra manera
            const dataArray = Object.values(data);
            return dataArray; // Ordena según tus necesidades
        } else {
            // Maneja otros tipos de datos según sea necesario
            return [];
        }
    };

    const selectOptionFromSlice = useSelector((state) => state.birdSlice.currentFilters);
    const { nIngles, nCientifico, paises, familias, grupos, zonas } = useSelector(state => state.birdSlice.options)

    const sortedPaises = sortAlphabetically(paises);
    const sortedFamilias = sortAlphabetically(familias);
    const sortedGrupos = sortAlphabetically(grupos);
    const sortedZonas = sortAlphabetically(zonas);
    const sortedNCientifico = sortAlphabetically(nCientifico);
    const sortedNIngles = sortAlphabetically(nIngles);

    const [isFetchingOptions, setIsFetchingOptions] = React.useState(false);
    const [selectOption, setSelectOption] = React.useState({
        grupo: [],
        familia: [],
        pais: [],
        zona: [],
        cientifico: [],
        ingles: [],
        ...selectOptionFromSlice,
    });


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

    const handleClickFiltrar = async () => {
        setIsFilterOpen(false);
        dispatch(saveFilters(selectOption));
        dispatch(cargando(true));

        try {
            const resultLength = await dispatch(sendParameter(selectOption));

            pages(1);
            dispatch(copingFilters());

            if (resultLength === 1) {
                dispatch(isOneBird(true));
            } else {
                dispatch(isOneBird(false));
            }
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
        } catch (error) {
            console.error("Error occurred during filtering:", error);
            // Manejar el error según sea necesario
        } finally {
            dispatch(cargando(false)) // Establecer isLoading en false después de la solicitud
        }
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
        dispatch(isOneBird(null))
        dispatch(setNoMoreResults(true))
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
        };
    }, []);

    return (
        <React.Fragment>
            <Grid component={Box}
                sx={{
                    height: 'auto',
                    borderRadius: '20px 20px 20px 20px',
                    backgroundColor: 'rgba(0, 61, 21, 0.0)',
                    padding: 3,
                }} >
                <Grid item >
                    <Typography variant="h2" color='primary.light' sx={{ m: 1 }}>
                        Búsqueda Avanzada de Aves
                    </Typography>
                </Grid>
                <Grid item container alignItems="center">
                    <Grid xs={12} >
                        <FormControl sx={{ m: 1, width: '95%' }}>
                            <Autocomplete
                                multiple
                                id='grupoUnico'
                                value={selectOption.grupo}
                                onChange={(event, newValue) => handleOptionChange('grupo', newValue)}
                                options={sortedGrupos}
                                getOptionLabel={(option) => option.nombre}
                                loading={isFetchingOptions}
                                renderInput={(params) =>
                                    <TextField {...params}
                                        label="Grupo"
                                        sx={{
                                            '& .MuiInputBase-input': {
                                                height: '30px',
                                            },
                                        }}
                                    />}
                                renderTags={(value, getTagProps) =>
                                    value.map((option, index) => (
                                        <Typography
                                            key={option.id}
                                            variant="body2" // Elige el variant y otros estilos según tus necesidades
                                            sx={{
                                                display: 'inline-block',
                                                fontSize: { xs: '1.2rem', md: '1.5rem', lg: '1.5rem' },
                                                color: 'white',
                                                ml: 2,
                                                mt: 1
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
                                renderInput={(params) =>
                                    <TextField {...params}
                                        label="Familia"
                                        sx={{
                                            '& .MuiInputBase-input': {
                                                height: '30px',
                                            },
                                        }}
                                    />}
                                renderTags={(value, getTagProps) =>
                                    value.map((option, index) => (
                                        <Typography
                                            key={option.id}
                                            variant="body2" // Elige el variant y otros estilos según tus necesidades
                                            sx={{
                                                display: 'inline-block',
                                                fontSize: { xs: '1.2rem', md: '1.5rem', lg: '1.5rem' },
                                                color: 'white',
                                                ml: 2,
                                                mt: 1
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
                                    renderInput={(params) =>
                                        <TextField {...params}
                                            label="Países"
                                            sx={{
                                                '& .MuiInputBase-input': {
                                                    height: '30px',
                                                },
                                            }}
                                        />}
                                    renderTags={(value, getTagProps) =>
                                        value.map((option, index) => (
                                            <Typography
                                                key={option.id}
                                                variant="body2" // Elige el variant y otros estilos según tus necesidades
                                                sx={{
                                                    display: 'inline-block',
                                                    fontSize: { xs: '1.2rem', md: '1.5rem', lg: '1.5rem' },
                                                    color: 'white',
                                                    ml: 2,
                                                    mt: 1
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
                                    renderInput={(params) =>
                                        <TextField {...params}
                                            label="Zonas"
                                            sx={{
                                                '& .MuiInputBase-input': {
                                                    height: '30px',
                                                },
                                            }}
                                        />}
                                    renderTags={(value, getTagProps) =>
                                        value.map((option, index) => (
                                            <Typography
                                                key={option.id}
                                                variant="body2" // Elige el variant y otros estilos según tus necesidades
                                                sx={{
                                                    display: 'inline-block',
                                                    fontSize: { xs: '1.2rem', md: '1.5rem', lg: '1.5rem' },
                                                    color: 'white',
                                                    ml: 2,
                                                    mt: 1
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

                                    renderInput={(params) =>
                                        <TextField {...params}
                                            label="Nombre Científico"
                                            sx={{
                                                '& .MuiInputBase-input': {
                                                    height: '30px',
                                                },
                                            }}
                                        />}
                                    renderTags={(value, getTagProps) =>
                                        value.map((option, index) => (
                                            <Typography
                                                key={option.id}
                                                variant="body1"
                                                sx={{
                                                    display: 'inline-block',
                                                    fontSize: { xs: '1.2rem', md: '1.5rem', lg: '1.5rem' },
                                                    color: 'white',
                                                    ml: 2,
                                                    mt: 1
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
                                    renderInput={(params) =>
                                        <TextField {...params}
                                            label="Nombre Inglés"
                                            sx={{
                                                '& .MuiInputBase-input': {
                                                    height: '30px',
                                                },
                                            }}
                                        />}
                                    renderTags={(value, getTagProps) =>
                                        value.map((option, index) => (
                                            <Typography
                                                key={option.id}
                                                variant="body1"
                                                sx={{
                                                    display: 'inline-block',
                                                    fontSize: { xs: '1.2rem', md: '1.5rem', lg: '1.5rem' },
                                                    color: 'white',
                                                    ml: 2,
                                                    mt: 1
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
                        <Stack spacing={3} direction="row" justifyContent="center"
                            alignItems="center"
                            sx={{
                                margin: '20px auto', // Centrar horizontalmente el Stack
                                width: 'fit-content', // Ajustar el ancho al contenido
                            }} >
                            <Button variant="contained" color="primary" onClick={handleClickFiltrar}>
                                Mostrar
                            </Button>
                            <Button variant="outlined" color="primary" onClick={handleReset}>
                                Resetear
                            </Button>
                            <Button variant="outlined" color="error" onClick={handleBack}>
                                < CloseIcon /> Cerrar
                            </Button>
                        </Stack>
                    </Grid>
                </Grid >
            </Grid>
        </React.Fragment >
    )
};
