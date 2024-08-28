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
import { getInfoForUpdate } from '../../../../redux/mamiferos/actions/crudAction';
//redux


export const Search = ({ changeTab }) => {
    const theme = useTheme();
    const dispatch = useDispatch()
    const [showBackdrop, setShowBackdrop] = React.useState(false);
    const [loadingMessage, setLoadingMessage] = React.useState('Cargando...');
    const [selected, setSelected] = React.useState(null);
    const [Data, setData] = React.useState([]);
    const [showUpdate, setShowUpdate] = React.useState(false);
    const [showSearch, setShowSearch] = React.useState(true);

    const handleSelect = (item) => {
        localStorage.setItem('nombreIngles', JSON.stringify(item.nombre_ingles))
        setSelected(item);
        handleButtonClick();
    };

    const handleButtonClick = () => {
        setShowBackdrop(true)
        setLoadingMessage('Cargando...');
        if (selected) {
            // Envía la información al action

            dispatch(getInfoForUpdate(selected.id_mamifero));
            // Cambia a la pestaña deseada
            // changeTab(2);
            setShowUpdate(true);
            setShowSearch(false);

        }
    };

    React.useEffect(() => {
        if (selected) {
            handleButtonClick();
        }
    }, [selected]);

    //tengo una idea de hacer una rta 
    //donde solo busque lso nombre después busco el ave 
    //que selecciona y si pone la info, para hacerlo mas rápido
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                setShowBackdrop(true)
                setLoadingMessage('Cargando Todos los Registros Por Favor Espere...');
                const response = await axios.get('/mamiferos/filtros?page=0&perPage=0');
                const data = response.data.registrosFiltrados;
                const validData = data.filter((item) => item.nombre_ingles);

                setData(validData);

            } catch (error) {
                console.error("Error al obtener los datos:", error);

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
                                Buscar Registro
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={8}>
                            <Autocomplete
                                id="search_registro"
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
            {showUpdate && < IndexTabsUpdates
                changeTab={changeTab}
                showUpdate={setShowUpdate}
                showSearch={setShowSearch}
                selected={setSelected}
            />}
        </React.Fragment>
    );
};