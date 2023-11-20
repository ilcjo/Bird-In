import * as React from 'react'
import {
    Autocomplete,
    Backdrop,
    CircularProgress,
    Grid,
    TextField,
    Typography,
    useTheme
} from '@mui/material';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { getInfoForUpdate } from '../../redux/actions/createBirds';
import { IndexTabsUpdates } from './IndexTabsUpdates';


export const SearchBird = ({ changeTab }) => {
    const theme = useTheme();
    const dispatch = useDispatch()
    const [showBackdrop, setShowBackdrop] = React.useState(true);
    const [selectedBird, setSelectedBird] = React.useState(null);
    const [birdsData, setBirdsData] = React.useState([]);
    const [showUpdateBird, setShowUpdateBird] = React.useState(false);
    const [showSearchBird, setShowSearchBird] = React.useState(true);

    const handleBirdSelect = (bird) => {
        setSelectedBird(bird);
        handleButtonClick();
    };

    const handleButtonClick = () => {
        if (selectedBird) {
            // Envía la información al action
            dispatch(getInfoForUpdate(selectedBird.id_ave));
            // Cambia a la pestaña deseada
            // changeTab(2);
            setShowUpdateBird(true);
            setShowSearchBird(false);
        }
    };
    React.useEffect(() => {
        if (selectedBird) {
            handleButtonClick();
        }
    }, [selectedBird]);


    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/aves/filtros?page=0&perPage=0');
                const data = response.data.avesFiltradas;
                const validData = data.filter((item) => item.nombre_ingles);

                // Ordenar los datos válidos por "Nombre en Inglés" (englishName)
                validData.sort((a, b) => a.nombre_ingles.localeCompare(b.nombre_ingles));

                localStorage.setItem('birdsData', JSON.stringify(validData));
                setBirdsData(validData);
                setShowBackdrop(false);
            } catch (error) {
                console.error("Error al obtener los datos:", error);
            }
        };

        fetchData();
    }, []);

    const labelStyles = {
        color: theme.palette.primary.main, // Color del texto del label
        marginTop: '-9px',
        ml: 10
    };

    const inputStyles = {
        // Aquí puedes agregar los estilos que desees para los inputs
        color: theme.palette.primary.light,
        backgroundColor: 'rgba(204,214,204,0.17)',
        borderRadius: '9px',
        height: '70px',
        width: '70%',
        ml: 10,
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
            height: '50px',
            // width: '180px' // Ejemplo: cambia el color del texto a azul
        },

    };

    return (
        <React.Fragment>
            {showSearchBird && (
                <React.Fragment>
                    <Backdrop
                        open={showBackdrop}
                        sx={{
                            zIndex: (theme) => theme.zIndex.drawer + 1,
                            color: '#fff',
                        }}
                    >
                        <CircularProgress color="inherit" />
                    </Backdrop>
                    <Grid container spacing={1} sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '170vh',
                        height: '40vh',
                        backgroundColor: 'rgba(0, 56, 28, 0.1)', // Establece el fondo transparente deseado
                        backdropFilter: 'blur(2px)', // Efecto de desenfoque de fondo
                        marginTop: '1px',
                        borderRadius: '20px',
                    }} >
                        <Grid item xs={12} sm={12} sx={{ mt: -5, mr: -30 }}>
                            <Typography variant="h2" color="primary">
                                Buscar Ave
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={8}>
                            <Autocomplete
                                id="search_bird"
                                options={birdsData}
                                getOptionLabel={(option) => option.nombre_ingles}
                                //     filterOptions={
                                //         (options, state) => {
                                //         // Filtra las opciones para que coincidan en el primer, segundo o tercer nombre
                                //         const inputValue = state.inputValue.toLowerCase();
                                //         return options.filter((option) => {
                                //             const birdName = option.nombre_ingles.toLowerCase();
                                //             const birdNamesArray = birdName.split(' ');

                                //             // Check if any of the names (first, second, or third) start with the inputValue
                                //             return birdNamesArray.some(
                                //                 (name) => name.startsWith(inputValue)
                                //             );
                                //         });
                                //     }
                                // }
                                // filterOptions={(options, state) => {
                                //     const inputValue = state.inputValue.toLowerCase();
                                //     return options.filter((option) => {
                                //         const birdName = option.nombre_ingles.toLowerCase();
                                //         const sanitizedInput = inputValue.replace(/[^a-z0-9\s]/g, ''); // Eliminar caracteres especiales
                                //         const sanitizedBirdName = birdName.replace(/[^a-z0-9\s]/g, ''); // Eliminar caracteres especiales

                                //         return sanitizedBirdName.includes(sanitizedInput);
                                //     });
                                // }}
                                filterOptions={(options, state) => {
                                    // Filtra las opciones para que coincidan en el primer, segundo o tercer nombre
                                    const inputValue = state.inputValue.toLowerCase();
                                    return options.filter((option) => {
                                        const birdName = option.nombre_ingles.toLowerCase();
                                        const birdNamesArray = birdName.split(' ');

                                        // Check if any of the names (first, second, or third) start with the inputValue
                                        return birdNamesArray.some(
                                            (name) => name.startsWith(inputValue)
                                        );
                                    });
                                }}
                                value={selectedBird}
                                onChange={(event, newValue) => handleBirdSelect(newValue)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Seleccionar ave a actualizar"
                                        InputLabelProps={{
                                            sx: labelStyles, // Estilo del label
                                        }}
                                        InputProps={{
                                            ...params.InputProps,
                                            sx: inputStyles, // Estilo del input

                                        }}
                                    />
                                )}

                                sx={{ mb: 3, mt: -10 }}
                            />
                        </Grid>
                    </Grid>
                </React.Fragment>
            )}
            {showUpdateBird && < IndexTabsUpdates changeTab={changeTab} showUpdateBird={setShowUpdateBird}
                showSearchBird={setShowSearchBird}
                selectedBird={setSelectedBird} />}
        </React.Fragment>
    );
};