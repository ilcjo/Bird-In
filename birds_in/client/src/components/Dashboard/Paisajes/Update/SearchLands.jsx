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
//COMPONENTS
import { IndexTabsUpdates } from './IndexTabsUpdates';
//REDUX
import { getInfoForUpdateP } from '../../../../redux/paisaje/actionsP/createLands';


export const SearchLands = ({ changeTab }) => {
    const theme = useTheme();
    const dispatch = useDispatch()
    const [showBackdrop, setShowBackdrop] = React.useState(true);
    const [selectedRegister, setSelectedRegister] = React.useState(null);
    const [registerData, setRegisterData] = React.useState([]);
    console.log('soy register data', registerData)
    const [showUpdateRegister, setShowUpdateRegister] = React.useState(false);
    const [showSearchRegister, setShowSearchRegister] = React.useState(true);

    const handleRegisterSelect = (bird) => {
        setSelectedRegister(bird);
        handleButtonClick();
    };

    const handleButtonClick = () => {
        if (selectedRegister) {
            // Envía la información al action
            dispatch(getInfoForUpdateP(selectedRegister.id));
            // Cambia a la pestaña deseada
            // changeTab(2);
            setShowUpdateRegister(true);
            setShowSearchRegister(false);
        }
    };
    React.useEffect(() => {
        if (selectedRegister) {
            handleButtonClick();
        }
    }, [selectedRegister]);


    React.useEffect(() => {
        const fetchData = async () => {
            try {
                setShowBackdrop(true)
                const response = await axios.get('/paisajes/filtros?page=0&perPage=0');
                const data = response.data.RegistrosFiltrados;
                const validData = data.filter((item) => item.zona);
                // Ordenar los datos válidos por nombre de zona
                validData.sort((a, b) => a.zona.nombre_zona.localeCompare(b.zona.nombre_zona));

                const zoneSet = new Set();
                validData.forEach(item => {
                    zoneSet.add(item.zona.nombre_zona);
                });

                // Convertir el conjunto a un array y agregar un ID único a cada zona
                const zoneOptions = Array.from(zoneSet).map((zone, index) => ({
                    id: index,
                    nombre_zona: zone
                }));

                // Guardar en el estado y en el almacenamiento local
                setRegisterData(zoneOptions);
                localStorage.setItem('LandsData', JSON.stringify(data));
            } catch (error) {
                console.error("Error al obtener los datos:", error);
            } finally {
                setShowBackdrop(false);
            }
        };

        fetchData();
    }, [showUpdateRegister]);

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
            {showSearchRegister && (
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
                                Buscar Paisaje
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={8}>
                            <Autocomplete
                                id="search_Paisaje"
                                options={registerData}
                                getOptionLabel={(option) => option.nombre_zona}
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
                                //     const inputValue = state.inputValue.toLowerCase(); // Convertir a minúsculas
                                //     const inputWords = inputValue.split(' '); // Dividir la entrada en palabras

                                //     return options.filter((option) => {
                                //         const name = option.nombre_zona.toLowerCase(); // Convertir a minúsculas
                                //         const words = name.split(' '); // Dividir el nombre en palabras

                                //         // Filtrar las opciones que coinciden con al menos una palabra
                                //         const matches = inputWords.filter(word => words.some(pWord => pWord.startsWith(word) && pWord[0] === word[0]));

                                //         // Organizar las coincidencias: primeras palabras primero, luego las segundas
                                //         const sortedMatches = [];
                                //         inputWords.forEach(word => {
                                //             const index = matches.findIndex(match => words.some(pWord => pWord.startsWith(match)) && match === word);
                                //             if (index !== -1) sortedMatches.push(matches.splice(index, 1)[0]);
                                //         });
                                //         sortedMatches.push(...matches);

                                //         return sortedMatches.length > 0; // Devolver true si hay al menos una coincidencia
                                //     });
                                // }}


                                // filterOptions={(options, state) => {
                                //     const inputValue = state.inputValue.toLowerCase();
                                //     return options.filter((option) => {
                                //         const birdName = option.descripcion.toLowerCase();
                                //         const sanitizedInput = inputValue.replace(/[^a-z0-9\s]/g, ''); // Eliminar caracteres especiales
                                //         const sanitizedBirdName = birdName.replace(/[^a-z0-9\s]/g, ''); // Eliminar caracteres especiales

                                //         return sanitizedBirdName.includes(sanitizedInput);
                                //     });
                                // }}
                                // filterOptions={(options, state) => {
                                //     // Filtra las opciones para que coincidan en el primer, segundo o tercer nombre
                                //     const inputValue = state.inputValue.toLowerCase();
                                //     return options.filter((option) => {
                                //         const birdName = option.nombre_ingles.toLowerCase();
                                //         const birdNamesArray = birdName.split(' ');

                                //         // Check if any of the names (first, second, or third) start with the inputValue
                                //         return birdNamesArray.some(
                                //             (name) => name.startsWith(inputValue)
                                //         );
                                //     });
                                // }}
                                // filterOptions={(options, state) => {
                                //     // Filtra las opciones para que coincidan solo en el primer nombre
                                //     const inputValue = state.inputValue.toLowerCase();
                                //     return options.filter((option) => {
                                //         const firstWord = option.descripcion.split(' ')[0].toLowerCase();
                                //         return firstWord.startsWith(inputValue);
                                //     });
                                // }}
                                // filterOptions={(options, state) => {
                                //     // Filtra las opciones para que coincidan en el primer o segundo nombre
                                //     const inputValue = state.inputValue.toLowerCase();
                                //     return options.filter((option) => {
                                //         const birdNamesArray = option.nombre_ingles.split(' ').map(name => name.toLowerCase());

                                //         // Busca en el primer nombre
                                //         const firstBirdName = birdNamesArray[0];
                                //         if (firstBirdName.startsWith(inputValue)) {
                                //             return true;
                                //         }

                                //         // Si no se encuentra en el primer nombre, busca en el segundo nombre
                                //         const secondBirdName = birdNamesArray[1];
                                //         return secondBirdName && secondBirdName.startsWith(inputValue);
                                //     });
                                // }}
                                value={selectedRegister}
                                onChange={(event, newValue) => handleRegisterSelect(newValue)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Seleccionar Paisaje a actualizar"
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
            {showUpdateRegister && < IndexTabsUpdates
                changeTab={changeTab}
                showUpdateRegister={setShowUpdateRegister}
                showSearchRegister={setShowSearchRegister}
                selectedRegister={setSelectedRegister}
            />}
        </React.Fragment>
    );
};