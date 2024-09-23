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
//ICONS
import CloseIcon from '@mui/icons-material/Close';
//ESTADOS GLOBALES
import { fetchNewOptions, getOptionsData } from '../../../redux/birds/actions/fetchOptions';
import { saveFilters } from '../../../redux/birds/slices/FilterSlice';
import { cargando, isOneBird } from '../../../redux/birds/slices/InfoSlice';
import { copingFilters } from '../../../redux/birds/slices/FilterSlice';
import { setNoMoreResults } from '../../../redux/birds/slices/FilterSlice';
import { sendParameter } from '../../../redux/birds/actions/filterAction';
import { AutocompleteFilter } from '../../utils/AutocompleteFilter';


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


    const selectOptionFromSlice = useSelector((state) => state.filterSlice.currentFilters);
    const {
        nIngles = [],
        nCientifico = [],
        paises = [],
        familias = [],
        grupos = [],
        zonas = []
    } = useSelector(state => state.filterSlice.options);


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


    const handleOptionChange = async (category, newValue) => {
        setIsFetchingOptions(true); // Activa el indicador de carga

        const updatedSelectOption = {
            ...selectOption,
            [category]: newValue.map((option) => ({
                id: option.id,
                nombre: option.nombre,
            })),
        };

        setSelectOption(updatedSelectOption);
        // console.log(setSelectOption)
        try {
            // Realiza la solicitud para obtener las nuevas opciones
            await dispatch(fetchNewOptions(updatedSelectOption));
        } catch (error) {
            // Maneja el error, si es necesario
            console.error('Error fetching new options:', error);
        } finally {
            // Desactiva el indicador de carga cuando la solicitud se completa o hay un error
            setIsFetchingOptions(false);
        }
    };

    const handleClickFiltrar = async () => {
        setIsFilterOpen(false);
        // console.log(selectOption)
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
            // setIsFetchingOptions(true); // Activa el indicador de carga
            // // // Realiza la solicitud para obtener las opciones completas
            // // dispatch(getOptionsData())
            // //     .then(() => {
            // //         setIsFetchingOptions(false); // Desactiva el indicador de carga cuando la solicitud se completa
            // //     })
            // //     .catch(() => {
            // //         setIsFetchingOptions(false); // Desactiva el indicador de carga en caso de error
            // //     });
            // setSelectOption({
            //     grupo: [],
            //     familia: [],
            //     pais: [],
            //     zona: [],
            //     cientifico: [],
            //     ingles: []
            // });
        } catch (error) {
            console.error("Error occurred during filtering:", error);
            // Manejar el error según sea necesario
        } finally {
            dispatch(cargando(false)) // Establecer isLoading en false después de la solicitud
        }
    };

    const handleBack = () => {
        // if (isFilterOpen) {
        //     setSelectOption({
        //         grupo: [],
        //         familia: [],
        //         pais: [],
        //         zona: [],
        //         cientifico: [],
        //         ingles: []
        //     });
        // }
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
        // return () => {
        dispatch(getOptionsData());
        setSelectOption({
            grupo: [],
            familia: [],
            pais: [],
            zona: [],
            cientifico: [],
            ingles: []
        });
        // };
    }, []);

    return (
        <React.Fragment>
            <Grid component={Box}
                sx={{
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
                <Grid item xs={12}>
                    {/* Familia */}
                    <AutocompleteFilter
                        label="Familia"
                        options={familias}
                        value={selectOption.familia}
                        onChange={(newValue) => handleOptionChange('familia', newValue)}
                        loading={isFetchingOptions}
                    />
                    <Grid />
                    <Grid container alignItems="center">
                        <Grid item xs={12} >
                            <AutocompleteFilter
                                label="Grupos"
                                options={grupos}
                                value={selectOption.grupo}
                                onChange={(newValue) => handleOptionChange('grupo', newValue)}
                                loading={isFetchingOptions}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            {/*Pais */}
                            <AutocompleteFilter
                                label="Países"
                                loading={isFetchingOptions}
                                value={selectOption.pais}
                                onChange={(newValue) => handleOptionChange('pais', newValue)}
                                options={paises || []}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            {/* Zona */}
                            <AutocompleteFilter
                                label="Zonas"
                                loading={isFetchingOptions}
                                value={selectOption.zona}
                                onChange={(newValue) => handleOptionChange('zona', newValue)}
                                options={zonas || []}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            {/* Científico */}
                            <AutocompleteFilter
                                label="Nombre cientifico"
                                value={selectOption.cientifico}
                                onChange={(newValue) => handleOptionChange('cientifico', newValue)}
                                options={nCientifico || []}
                                loading={isFetchingOptions}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <AutocompleteFilter
                                label="Nombre en Ingles"
                                value={selectOption.ingles}
                                onChange={(newValue) => handleOptionChange('ingles', newValue)}
                                options={nIngles || []}
                                loading={isFetchingOptions}
                            />
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
            </Grid>
        </React.Fragment >
    )
};
