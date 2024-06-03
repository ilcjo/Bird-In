import * as React from 'react'
import { Box, Button, Grid } from '@mui/material'
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LogoutIcon from '@mui/icons-material/Logout';
import { backInfo, getInfoBirds } from '../../redux/actions/fetchAllBirds';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import { clearToken } from '../../redux/slices/Auth';
import { getOptionsData } from '../../redux/actions/fetchOptions';
import HomeIcon from '@mui/icons-material/Home';
import { isOneBird } from '../../redux/slices/BirdsSlice';
import { Link } from 'react-router-dom';

export const MenuBar = ({ isFilterOpen, setIsFilterOpen, ShowFilterButton, ShowBackButton, showAllButton, showAdmin }) => {
    const dispatch = useDispatch()
    const theme = useTheme()
    const navigate = useNavigate()
    const admin = localStorage.getItem('tipoCliente')
    const isAdmin = admin === 'admin'
    const [selectedButton, setSelectedButton] = React.useState('todo');
    // const [showFilterButton, setShowFilterButton] = React.useState(true)
    const { allCustom } = useSelector((state) => state.customizesSlice);
    const parameter = useSelector(state => state.birdSlice.filters)

    const handleButtonTodos = (button) => {
        console.log('Button clicked:', button);
        setSelectedButton(button);

        if (button === 'todo') {
            console.log('Fetching all birds...');
            dispatch(getInfoBirds());
        }
    };

    const handleFilterButtonClick = () => {
        // Cambiar el estado del filtro al hacer clic en el botón del filtro
        setIsFilterOpen(!isFilterOpen);
        // dispatch(isOneBird(false))
    };

    const onLogoutClick = () => {
        localStorage.clear();
        navigate('/')
        dispatch(clearToken())
        dispatch(getOptionsData())

    };

    const returnMenuClick = () => {
        localStorage.removeItem('nombreIngles')
        navigate('/menu')
        dispatch(getOptionsData())
        dispatch(isOneBird(false))
    };

    return (

        <React.Fragment>
            <Grid
                container
                component={Box}
                sx={{
                    position: 'fixed', // Establece la posición fija
                    top: 0, // Lo coloca en la parte superior de la pantalla
                    left: 0, // Lo coloca en la parte izquierda de la pantalla
                    width: '100%', // Ocupa todo el ancho de la pantalla
                    zIndex: 999, // Asegura que esté por encima del contenido
                    // backgroundColor: 'rgba(32,60,18, 0.8)',
                    backdropFilter: 'blur(9px)',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    height: '5.5vh',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }}
            >
                <Link to="/menu" style={{ marginLeft: '30px', width: 'auto', height: '110%', marginBottom: '52px', backgroundColor: '#004E37', borderRadius: ' 0px 0px 50px 50px', }}>
                    <img src={allCustom.logo} alt="Logo"
                        style={{ width: 'auto', height: '220%', marginBottom: '52px', backgroundColor: '#103300', borderRadius: ' 0px 0px 50px 50px', }}
                        loading="lazy" />
                </Link>
                <Grid item sx={{ display: 'flex', alignItems: 'flex-start', mt: -13, mr: 1, gap: '10px', }}>
                    {ShowFilterButton && (
                        <Button
                            sx={{
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                color: 'white'
                            }}
                            variant="text"
                            onClick={handleFilterButtonClick}
                            startIcon={<FilterAltIcon />}
                        >
                            Abrir Filtro
                        </Button>
                    )}
                    {ShowBackButton && (
                        <Button
                            sx={{
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                color: 'white'
                            }}
                            variant="text"
                            onClick={returnMenuClick}
                            startIcon={<HomeIcon />}
                        >
                            Menu Principal
                        </Button>
                    )}
                    <Button
                        sx={{
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            color: 'red'
                        }}
                        variant="text"
                        onClick={onLogoutClick}
                        endIcon={<LogoutIcon />}
                    >
                        Cerrar Sesión
                    </Button>
                </Grid>
            </Grid>

        </React.Fragment>
    );
};
