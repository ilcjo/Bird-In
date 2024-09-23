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
import { sendParameterP } from '../../../redux/paisaje/actionsP/fetchAllLands'
import { cargando, copingFilters, isOneLand, saveFilters, setNoMoreResults } from '../../../redux/paisaje/slicesP/LandscapeSlice'
import { fetchNewOptionsP, getOptionsDataP } from '../../../redux/paisaje/actionsP/fetchOptionsLand'
//ICONS
import CloseIcon from '@mui/icons-material/Close';


export const FiltersLands = ({ isFilterOpen, setIsFilterOpen, pages }) => {
    const theme = useTheme()
    const dispatch = useDispatch()
    const selectOptionFromSlice = useSelector((state) => state.landscapeSlice.currentFilters);
    const nombreLand = localStorage.getItem('nombrePaisaje');

    const {
        paises = [],
        zonas = []
    } = useSelector(state => state.landscapeSlice.optionsP);


    const [isFetchingOptions, setIsFetchingOptions] = React.useState(false);
    const [selectOption, setSelectOption] = React.useState({
        pais: [],
        zona: [],
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
        dispatch(fetchNewOptionsP(updatedSelectOption))
            .then(() => {
                setIsFetchingOptions(false); // Desactiva el indicador de carga cuando la solicitud se completa
            })
            .catch(() => {
                setIsFetchingOptions(false); // Desactiva el indicador de carga en caso de error
            });
    };

    const handleClickFiltrar = async () => {
        setIsFilterOpen(false);
        // console.log(selectOption)
        dispatch(saveFilters(selectOption));
        dispatch(cargando(true));

        try {
            const resultLength = await dispatch(sendParameterP(selectOption));

            pages(1);
            dispatch(copingFilters());

            if (resultLength === 1) {
                dispatch(isOneLand(true));
            } else {
                dispatch(isOneLand(false));
            }
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
        dispatch(getOptionsDataP())
            .then(() => {
                setIsFetchingOptions(false); // Desactiva el indicador de carga cuando la solicitud se completa
            })
            .catch(() => {
                setIsFetchingOptions(false); // Desactiva el indicador de carga en caso de error
            });
        setSelectOption({
            pais: [],
            zona: [],
        });
        dispatch(isOneLand(null))
        dispatch(setNoMoreResults(true))
    };


    React.useEffect(() => {
        return () => {
            dispatch(getOptionsDataP());
            setSelectOption({
                pais: [],
                zona: [],
            });
        };
    }, []);

    return (
        <React.Fragment>
            <Grid component={Box}
                sx={{
                    // width: '90%',
                    height: 'auto',
                    borderRadius: '20px 20px 20px 20px',
                    backgroundColor: 'rgba(0, 61, 21, 0.0)',
                    padding: { xs: 0, md: 2 },
                }} >
                <Grid item >
                    <Typography variant="h2" color='primary.light' sx={{ m: 1, mt: -1 }}>
                        Búsqueda Avanzada
                    </Typography>
                </Grid>
                <Grid container alignItems="center">
                    <Grid item xs={12}>
                        {/*Pais */}
                        <FormControl sx={{ m: 1, width: '90%' }}>
                            <Autocomplete
                                multiple
                                value={selectOption.pais}
                                onChange={(event, newValue) => handleOptionChange('pais', newValue)}
                                options={paises || []}
                                getOptionLabel={(option) => option.nombre}
                                loading={isFetchingOptions}
                                renderInput={(params) =>
                                    <TextField {...params}
                                        label="Países"
                                        sx={{
                                            '& .MuiInputBase-input': {
                                                height: '26px',
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
                                disabled={paises?.length === 0}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        {/* Zona */}
                        <FormControl sx={{ m: 1, width: '90%' }}>
                            <Autocomplete
                                multiple
                                value={selectOption.zona}
                                onChange={(event, newValue) => handleOptionChange('zona', newValue)}
                                options={zonas || []}
                                getOptionLabel={(option) => option.nombre}
                                loading={isFetchingOptions}
                                renderInput={(params) =>
                                    <TextField {...params}
                                        label="Zonas"
                                        sx={{
                                            '& .MuiInputBase-input': {
                                                height: '26px',
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
                                disabled={zonas?.length === 0}
                            />
                        </FormControl>
                    </Grid>

                    <Stack spacing={1} direction="row" justifyContent="center"
                        alignItems="center"
                        sx={{
                            margin: '20px auto', // Centrar horizontalmente el Stack
                            width: 'fit-content', // Ajustar el ancho al contenido
                        }} >
                        <Button variant="contained" color="primary" onClick={handleClickFiltrar} sx={{ fontSize: { xs: '1rem' } }}>
                            Mostrar
                        </Button>
                        <Button variant="outlined" color="primary" onClick={handleReset} sx={{ fontSize: { xs: '1rem' } }}>
                            Resetear
                        </Button>
                        <Button variant="outlined" color="error" onClick={handleBack} sx={{ fontSize: { xs: '1rem' } }}>
                            < CloseIcon /> Cerrar
                        </Button>
                    </Stack>
                </Grid>
            </Grid >

        </React.Fragment >
    )
};
