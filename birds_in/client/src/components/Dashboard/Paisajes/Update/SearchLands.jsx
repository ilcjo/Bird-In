import * as React from 'react'
import {
    Autocomplete,
    Grid,
    TextField,
    Typography,
    useTheme
} from '@mui/material';
import axios from 'axios';
import { useDispatch } from 'react-redux';
//COMPONENTS
import { IndexTabsUpdatesPa } from './IndexTabsUpdatesPa';
//REDUX
import { getInfoForUpdatePa } from '../../../../redux/paisaje/actionsP/createLands';
import { Loading } from '../../../utils/Loading';


export const SearchLands = ({ changeTab }) => {
    const theme = useTheme();
    const dispatch = useDispatch()
    const [showBackdrop, setShowBackdrop] = React.useState(true);
    const [loadingMessage, setLoadingMessage] = React.useState('Cargando...');
    const [selectedRegister, setSelectedRegister] = React.useState(null);
    const [registerData, setRegisterData] = React.useState([]);
    console.log('registro seleccionado', selectedRegister)
    const [showUpdateRegister, setShowUpdateRegister] = React.useState(false);
    const [showSearchRegister, setShowSearchRegister] = React.useState(true);

    const handleRegisterSelect = (registro) => {
        // console.log(registro)
        setSelectedRegister(registro);
        handleButtonClick();
    };

    const handleButtonClick = () => {
        if (selectedRegister) {
            // Envía la información al action
            dispatch(getInfoForUpdatePa(selectedRegister.id));
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

    //encuentra y organiza los registros de la db
    // React.useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             setShowBackdrop(true)
    //             const response = await axios.get('/paisajes/filtros?page=0&perPage=0');
    //             const data = response.data.RegistrosFiltrados;
    //             const validData = data.filter((item) => item.zona);
    //             // Ordenar los datos válidos por nombre de zona
    //             validData.sort((a, b) => a.zona.nombre.localeCompare(b.zona.nombre));
    //             localStorage.setItem('LandsData', JSON.stringify(data));
    //             setRegisterData(validData);
    //         } catch (error) {
    //             console.error("Error al obtener los datos:", error);
    //         } finally {
    //             setShowBackdrop(false);
    //         }
    //     };

    //     fetchData();
    // }, [showUpdateRegister]);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                setShowBackdrop(true);
                const response = await axios.get('/paisajes/filtros?page=0&perPage=0');
                const data = response.data.RegistrosFiltrados;
                console.log(data);
    
                // Filtrar los registros para que incluyan solo aquellos con una zona o un país
                const validData = data.filter((item) => item.zona || item.paise); // Asegúrate de que el nombre de la propiedad sea correcto
                console.log(validData);
    
                // Mapear los datos para mostrar el nombre de la zona o el país
                const formattedData = validData.map((item) => {
                    // Verifica si hay zona y usa el nombre correspondiente
                    const nombre = item.zona ? item.zona.nombre : item.paise.nombre;
                    const id = item.id
    
                    return {
                        id: id,
                        nombre: nombre,
                        // Incluye otras propiedades necesarias aquí
                    };
                });
    
                localStorage.setItem('LandsData', JSON.stringify(formattedData)); // Guarda los datos formateados en localStorage
                setRegisterData(formattedData); // Actualiza el estado con los datos formateados
            } catch (error) {
                console.error("Error al obtener los datos:", error);
            } finally {
                setShowBackdrop(false);
            }
        };
        fetchData();
    }, [showUpdateRegister]);
    


    return (
        <React.Fragment>
            {showSearchRegister && (
                <React.Fragment>
                    <Loading
                        message={loadingMessage}
                        open={showBackdrop}
                    />
                    <Grid container spacing={1} sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '170vh',
                        height: '40vh',
                        backgroundColor: 'rgba(0, 56, 28, 0.1)', // Establece el fondo transparente deseado
                        backdropFilter: 'blur(8px)', // Efecto de desenfoque de fondo
                        marginTop: 'auto',
                        borderRadius: '10px',
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
                                getOptionLabel={(option) => option.nombre}
                                // filterOptions={(options, state) => {
                                //     const inputValue = state.inputValue.toLowerCase().trim(); // Convertir a minúsculas y quitar espacios en blanco
                                //     return options.filter((option) => {
                                //         const birdName = option.zona.nombre.toLowerCase();

                                //         // Remover caracteres especiales excepto letras, números y espacios
                                //         const sanitizedInput = inputValue.replace(/[^a-z0-9\s-]/g, '');
                                //         const sanitizedBirdName = birdName.replace(/[^a-z0-9\s-]/g, '');

                                //         // Modificar para buscar coincidencias que comiencen con la entrada del usuario
                                //         return sanitizedBirdName.startsWith(sanitizedInput);
                                //     });
                                // }}
                                value={selectedRegister}
                                onChange={(event, newValue) => handleRegisterSelect(newValue)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Seleccionar Paisaje a Actualizar"
                                    />
                                )}
                                sx={{ mb: 3, mt: -10 }}
                            />
                        </Grid>
                    </Grid>
                </React.Fragment>
            )}
            {showUpdateRegister && < IndexTabsUpdatesPa
                changeTab={changeTab}
                showUpdateRegister={setShowUpdateRegister}
                showSearchRegister={setShowSearchRegister}
                selectedRegister={setSelectedRegister}
            />}
        </React.Fragment>
    );
};