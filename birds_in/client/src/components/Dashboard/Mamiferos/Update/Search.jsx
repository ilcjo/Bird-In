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
// COMPONENTES
import { IndexTabsUpdates } from './IndexTabsUpdates';
import { Loading } from '../../../utils/Loading';
import { getInfoForUpdate, getInfoForUpdateName } from '../../../../redux/mamiferos/actions/crudAction';

export const Search = ({ changeTab }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const [showBackdrop, setShowBackdrop] = React.useState(false);
    const [loadingMessage, setLoadingMessage] = React.useState('Cargando...');
    const [selected, setSelected] = React.useState(null);
    const [Data, setData] = React.useState([]);
    const [showUpdate, setShowUpdate] = React.useState(false);
    const [showSearch, setShowSearch] = React.useState(true);

    const handleSelect = (registro) => {
        localStorage.setItem('nombreIngles', JSON.stringify(registro.nombre_ingles));
        setSelected(registro);
        handleButtonClick();
    };

    const handleButtonClick = () => {
        setShowBackdrop(true);
        setLoadingMessage('Cargando...');
        if (selected) {
            dispatch(getInfoForUpdate(selected.id_mamifero));
            setShowUpdate(true);
            setShowSearch(false);
        }
    };

    const handleButtonClickFromCreate = () => {
        let valor = localStorage.getItem('nombreIngles');
        if (valor) {
            try {
                valor = JSON.parse(valor); // Asegurarse de parsear el JSON si es necesario
            } catch (e) {
                console.error('Error al parsear nombreIngles:', e);
            }
            dispatch(getInfoForUpdateName(valor)); // Llama al action con el valor obtenido
            setShowUpdate(true); // Cambia a la vista de actualización
            setShowSearch(false); // Oculta la vista de búsqueda
        } else {
            console.error('nombreIngles no se encuentra en localStorage');
        }
    };

    React.useEffect(() => {
        let isFrom = localStorage.getItem('isFromCreateImage');
        if (isFrom) {
            handleButtonClickFromCreate()
        }
    }, []);

    React.useEffect(() => {
        if (selected) {
            handleButtonClick();
        }
    }, [selected]);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                setShowBackdrop(true);
                setLoadingMessage('Cargando Todos los Mamíferos, por favor espere...');
                const response = await axios.get('/mamiferos/nombres');
                setData(response.data);
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            } finally {
                setShowBackdrop(false);
            }
        };

        fetchData();
    }, [showUpdate]);

    return (
        <React.Fragment>
            {showSearch && (
                <React.Fragment>
                    <Loading message={loadingMessage} open={showBackdrop} />
                    <Grid container spacing={1} sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '170vh',
                        height: '40vh',
                        backgroundColor: 'rgba(0, 56, 28, 0.1)',
                        backdropFilter: 'blur(4px)',
                        marginTop: 'auto',
                        borderRadius: '10px',
                    }}>
                        <Grid item xs={12} sm={12} sx={{ mt: -5, mr: -30 }}>
                            <Typography variant="h2" color="primary">
                                Buscar Registro
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={8}>
                            <Autocomplete
                                id="search_"
                                options={Data}
                                getOptionLabel={(option) => option.nombre_ingles}
                                value={selected}
                                onChange={(event, newValue) => handleSelect(newValue)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Seleccionar Registro a Actualizar"
                                    />
                                )}
                                sx={{ mb: 3, mt: -10 }}
                            />
                        </Grid>
                    </Grid>
                </React.Fragment>
            )}
            {showUpdate && (
                <IndexTabsUpdates
                    changeTab={changeTab}
                    showUpdate={setShowUpdate}
                    showSearch={setShowSearch}
                    selected={setSelected}
                />
            )}
        </React.Fragment>
    );
};
