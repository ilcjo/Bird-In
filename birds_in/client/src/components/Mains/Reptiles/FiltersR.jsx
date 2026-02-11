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
import { sendParameter } from '../../../redux/reptiles/actions/filterAction';
import { fetchNewOptions, getOptionsDataR } from '../../../redux/reptiles/actions/fetchOptions';
import { saveFilters } from '../../../redux/reptiles/slices/FilterSlice';
import { cargando, isOneR } from '../../../redux/reptiles/slices/InfoSlice';
import { copingFilters } from '../../../redux/reptiles/slices/FilterSlice';
import { setNoMoreResults } from '../../../redux/reptiles/slices/FilterSlice';
import { AutocompleteFilter } from '../../utils/AutocompleteFilter';


export const FiltersR = ({ isFilterOpen, setIsFilterOpen, pages }) => {
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


    const selectOptionFromSlice = useSelector((state) => state.filterRep.currentFilters);
    const {
        familias = [],
        grupos = [],
        paises = [],
        zonas = [],
        nCientifico = [],
        nIngles = [],
    } = useSelector(state => state.filterRep.options);


    const [isFetchingOptions, setIsFetchingOptions] = React.useState(false);
    const [selectOption, setSelectOption] = React.useState({
        familia: [],
        grupo: [],
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
        // console.log(updatedSelectOption)
        try {
            dispatch(fetchNewOptions(updatedSelectOption))
        } catch (error) {
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
                dispatch(isOneR(true));
            } else {
                dispatch(isOneR(false));
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
        dispatch(getOptionsDataR())
            .then(() => {
                setIsFetchingOptions(false); // Desactiva el indicador de carga cuando la solicitud se completa
            })
            .catch(() => {
                setIsFetchingOptions(false); // Desactiva el indicador de carga en caso de error
            });
        setSelectOption({
            familia: [],
            grupo: [],
            pais: [],
            zona: [],
            cientifico: [],
            ingles: []
        });
        dispatch(isOneR(null))
        dispatch(setNoMoreResults(true))
    };


    React.useEffect(() => {
        // return () => {
        dispatch(getOptionsDataR());
        setSelectOption({
            familia: [],
            grupo: [],
            pais: [],
            zona: [],
            cientifico: [],
            ingles: []
        });
        // };
    }, []);

    return (
        <React.Fragment>
            <Grid
                component={Box}
                sx={{
                    height: 'auto',
                    borderRadius: '20px',
                    backgroundColor: 'rgba(0, 61, 21, 0.0)',
                    padding: { xs: 0, md: 1 },
                }}
            >
                <Grid item >
                    <Typography variant="h2" color='white' sx={{ m: 1, mt: -1 }}>
                        Búsqueda Avanzada
                    </Typography>
                </Grid>

                <Grid container alignItems="center">
                    {/* Familia */}
                    <Grid item xs={12}>
                        <AutocompleteFilter
                            label="Familia"
                            options={familias}
                            value={selectOption.familia}
                            onChange={(newValue) => handleOptionChange('familia', newValue)}
                            loading={isFetchingOptions}
                        />
                    </Grid>
                    {/* Grupo */}
                    <Grid item xs={12} >
                        <AutocompleteFilter
                            label="Grupo"
                            options={grupos}
                            value={selectOption.grupo}
                            onChange={(newValue) => handleOptionChange('grupo', newValue)}
                            loading={isFetchingOptions}
                        />
                    </Grid>
                    {/* País */}
                    <Grid item xs={12}>
                        <AutocompleteFilter
                            label="Países"
                            options={paises}
                            value={selectOption.pais}
                            onChange={(newValue) => handleOptionChange('pais', newValue)}
                            loading={isFetchingOptions}
                        />
                    </Grid>
                    {/* Zona */}
                    <Grid item xs={12}>
                        <AutocompleteFilter
                            label="Zona"
                            options={zonas}
                            value={selectOption.zona}
                            onChange={(newValue) => handleOptionChange('zona', newValue)}
                            getOptionLabel={(option) => option.nombre}
                            loading={isFetchingOptions}
                        />
                    </Grid>
                    {/* Nombre Científico */}
                    <Grid item xs={12}>
                        <AutocompleteFilter
                            label="Nombre científico"
                            options={nCientifico}
                            value={selectOption.cientifico}
                            onChange={(newValue) => handleOptionChange('cientifico', newValue)}
                            loading={isFetchingOptions}
                        />
                    </Grid>

                    {/* Nombre Inglés */}
                    <Grid item xs={12}>
                        <AutocompleteFilter
                            label="Nombre inglés"
                            options={nIngles}
                            value={selectOption.ingles}
                            onChange={(newValue) => handleOptionChange('ingles', newValue)}
                            loading={isFetchingOptions}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Stack
                            spacing={1}
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                            sx={{
                                margin: '20px auto', // Centrar horizontalmente el Stack
                                // width: 'fit-content', // Ajustar el ancho al contenido
                            }} >
                            <Button variant="outlined" color="error" onClick={handleBack} sx={{ fontSize: { xs: '1rem' } }}>
                                < CloseIcon /> Cerrar
                            </Button>
                            <Button variant="outlined" color="primary" onClick={handleReset} sx={{ fontSize: { xs: '1rem' } }}>
                                Resetear
                            </Button>
                            <Button variant="contained" color="secondary" onClick={handleClickFiltrar} sx={{ fontSize: { xs: '1rem' } }}>
                                Mostrar
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </Grid>
        </React.Fragment >
    );
};
