import * as React from 'react'
import {
    Autocomplete,
    Backdrop,
    Box,
    Button,
    CircularProgress,
    Grid,
    TextField,
    Typography,
    useTheme
} from '@mui/material';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { getInfoForUpdate } from '../../redux/actions/createBirds';
import { UpdateBirds } from '../Forms/UpdateBirds';


export const SearchBird = ({ changeTab, isEnable }) => {
    const theme = useTheme();
    const dispatch = useDispatch()
    const [showBackdrop, setShowBackdrop] = React.useState(true);
    const [selectedBird, setSelectedBird] = React.useState(null);
    const [birdsData, setBirdsData] = React.useState([]);
    const [showUpdateBird, setShowUpdateBird] = React.useState(false);
    const [showSearchBird, setShowSearchBird] = React.useState(true);

    const handleBirdSelect = (bird) => {
        setSelectedBird(bird);
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
        const fetchData = async () => {
            try {
                const response = await axios.get('/aves/filtros?page=0&perPage=0');
                const data = response.data;
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
                        width: '100vh',
                        height: '40vh',
                        backgroundColor: theme.palette.secondary.light,
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
                                filterOptions={(options, state) => {
                                    // Filtra las opciones para que coincidan solo al inicio de la palabra
                                    const inputValue = state.inputValue.toLowerCase();
                                    return options.filter((option) =>
                                        option.nombre_ingles.toLowerCase().startsWith(inputValue)
                                    );
                                }}
                                value={selectedBird}
                                onChange={(event, newValue) => handleBirdSelect(newValue)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Seleccionar ave a actualizar"
                                    />
                                )}
                                fullWidth
                                sx={{ mb: 3, mt: -10 }}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={!selectedBird}
                                onClick={handleButtonClick}
                                sx={{
                                    fontSize: '1.3rem', padding: '5px 10px', fontWeight: 'bold', textTransform: 'none',
                                    '&:hover': {
                                        backgroundColor: theme.palette.primary.dark, // Cambia el color de fondo en hover
                                        color: theme.palette.primary.light, // Cambia el color del texto en hover
                                        textTransform: 'none'
                                    },
                                }}
                            >
                                Actualizar
                            </Button>

                        </Grid>
                    </Grid>
                </React.Fragment>
            )}
            {showUpdateBird && <UpdateBirds />}
        </React.Fragment>
    );
};