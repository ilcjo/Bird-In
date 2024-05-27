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
import { IndexTabsUpdatesPa } from './IndexTabsUpdatesPa';
//REDUX
import { getInfoForUpdatePa } from '../../../../redux/paisaje/actionsP/createLands';


export const SearchLands = ({ changeTab }) => {
    const theme = useTheme();
    const dispatch = useDispatch()
    const [showBackdrop, setShowBackdrop] = React.useState(true);
    const [selectedRegister, setSelectedRegister] = React.useState(null);
    const [registerData, setRegisterData] = React.useState([]);
    console.log('registro seleccionado', registerData)
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
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                setShowBackdrop(true)
                const response = await axios.get('/paisajes/filtros?page=0&perPage=0');
                const data = response.data.RegistrosFiltrados;
                const validData = data.filter((item) => item.zona);
                // Ordenar los datos válidos por nombre de zona
                validData.sort((a, b) => a.zona.nombre.localeCompare(b.zona.nombre));
                localStorage.setItem('LandsData', JSON.stringify(data));
                setRegisterData(validData);
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
                        backgroundColor: 'rgba(0, 56, 28, 0.10)', // Establece el fondo transparente deseado
                        backdropFilter: 'blur(8px)', // Efecto de desenfoque de fondo
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
                                getOptionLabel={(option) => option.zona.nombre}
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
                                        label="Seleccionar Paisaje a actualizar"
                                    // InputLabelProps={{
                                    //     sx: labelStyles, // Estilo del label
                                    // }}
                                    // InputProps={{
                                    //     ...params.InputProps,
                                    //     sx: inputStyles, // Estilo del input

                                    // }}
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