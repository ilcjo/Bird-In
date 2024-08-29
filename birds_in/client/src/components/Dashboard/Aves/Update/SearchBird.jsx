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
import { IndexTabsUpdates } from './IndexTabsUpdates';
import { Loading } from '../../../utils/Loading';
import { getInfoForUpdate } from '../../../../redux/birds/actions/crudAction';
//redux


export const SearchBird = ({ changeTab }) => {
    const theme = useTheme();
    const dispatch = useDispatch()
    const [showBackdrop, setShowBackdrop] = React.useState(false);
    const [loadingMessage, setLoadingMessage] = React.useState('Cargando...');
    const [selectedBird, setSelectedBird] = React.useState(null);
    const [birdsData, setBirdsData] = React.useState([]);
    // console.log(selectedBird)
    const [showUpdateBird, setShowUpdateBird] = React.useState(false);
    const [showSearchBird, setShowSearchBird] = React.useState(true);

    const handleBirdSelect = (bird) => {
        console.log(bird)
        localStorage.setItem('nombreIngles', JSON.stringify(bird.nombre_ingles))
        setSelectedBird(bird);
        handleButtonClick();
    };

    const handleButtonClick = () => {
        setShowBackdrop(true)
        setLoadingMessage('Cargando...');
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

    //tengo una idea de hacer una rta 
    //donde solo busque lso nombre después busco el ave 
    //que selecciona y si pone la info, para hacerlo mas rápido
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                setShowBackdrop(true)
                setLoadingMessage('Cargando Todas las Aves Por Favor Espere...');
                const response = await axios.get('/aves/nombres');
                const data = response.data;
                // const validData = data.filter((item) => item.nombre_ingles);
                // Ordenar los datos válidos por "Nombre en Inglés" (englishName)
                // validData.sort((a, b) => a.nombre_ingles.localeCompare(b.nombre_ingles));
                // localStorage.setItem('birdsData', JSON.stringify(validData));
                setBirdsData(data);
            } catch (error) {
                console.error("Error al obtener los datos:", error);

            } finally {
                setShowBackdrop(false);
            }
        };

        fetchData();
    }, [showUpdateBird]);

    return (
        <React.Fragment>
            {showSearchBird && (
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
                        backdropFilter: 'blur(2px)', // Efecto de desenfoque de fondo
                        marginTop: 'auto',
                        borderRadius: '10px',
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
                                value={selectedBird}
                                onChange={(event, newValue) => handleBirdSelect(newValue)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Seleccionar Ave a Actualizar"
                                    />
                                )}

                                sx={{ mb: 3, mt: -10 }}
                            />
                        </Grid>
                    </Grid>
                </React.Fragment>
            )}
            {showUpdateBird && < IndexTabsUpdates
                changeTab={changeTab}
                showUpdateBird={setShowUpdateBird}
                showSearchBird={setShowSearchBird}
                selectedBird={setSelectedBird}
            />}
        </React.Fragment>
    );
};