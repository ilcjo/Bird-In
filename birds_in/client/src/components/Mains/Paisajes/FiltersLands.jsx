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
import { AutocompleteFilter } from '../../utils/AutocompleteFilter'


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
        try {
            dispatch(fetchNewOptionsP(updatedSelectOption))
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
        dispatch(getOptionsDataP());
        setSelectOption({
            pais: [],
            zona: [],
        });
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
                        <AutocompleteFilter
                            label="Países"
                            value={selectOption.pais}
                            onChange={(newValue) => handleOptionChange('pais', newValue)}
                            options={paises || []}
                            loading={isFetchingOptions}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        {/* Zona */}
                        <AutocompleteFilter
                            label="Zonas"
                            value={selectOption.zona}
                            onChange={(newValue) => handleOptionChange('zona', newValue)}
                            options={zonas || []}
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

        </React.Fragment >
    )
};
