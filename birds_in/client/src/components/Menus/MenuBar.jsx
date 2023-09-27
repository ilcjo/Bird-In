import * as React from 'react'
import { Button, Grid } from '@mui/material'
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LogoutIcon from '@mui/icons-material/Logout';
import { getInfoBirds } from '../../redux/actions/fetchAllBirds';
import { useDispatch } from 'react-redux';
import { useTheme } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import { clearToken } from '../../redux/slices/Auth';

export const MenuBar = ({ isFilterOpen, setIsFilterOpen }) => {
    const dispatch = useDispatch()
    const theme = useTheme()
    const navigate = useNavigate()
    const [selectedButton, setSelectedButton] = React.useState('todo');

    const handleButtonClick = (button) => {
        setSelectedButton(button);
        if (button === 'todo') {
            // Si se hace clic en "Todo", obtén todos los pájaros.
            dispatch(getInfoBirds());
        }
    };

    const handleFilterButtonClick = () => {
        // Cambiar el estado del filtro al hacer clic en el botón del filtro
        setIsFilterOpen(!isFilterOpen);
    };

    const onLogoutClick = () => {
        localStorage.clear();
        dispatch(clearToken())
        navigate('/')
    };

    const returnMenuClick = () => {
        // localStorage.removeItem('nombreIngles')
        // dispatch(getInfoBirds())
        // dispatch(getOptionsData())
        navigate('/menu')
    };
    return (
        <Grid container  sx={{  marginRight: '80px', marginBottom: '10px'}}>
            {/* <Grid item sx={{ marginLeft: '80px', marginBottom: '10px' }}>
                <Button
                    sx={{
                        fontSize: '1rem', // Aumentar el tamaño del texto a 1.2 rem
                        fontWeight: 'bold', // Hacer el texto negrita
                    }}
                    color="primary"
                    variant='contained'
                    onClick={() => handleButtonClick('todo')}
                >
                    Todo
                </Button>
            </Grid> */}
            <Grid item>
                <Button sx={{
                    marginBottom: '10px',
                 
                    fontSize: '1rem', // Aumentar el tamaño del texto a 1.2 rem
                    fontWeight: 'bold',
                    color: theme.palette.primary.light
                }}
                    variant='contained'
                    color="secondary"
                    onClick={handleFilterButtonClick}
                    endIcon={<FilterAltIcon />}
                >
                    Abrir Filtro
                </Button>
                <Button
                    sx={{
                        marginBottom: '10px',
                      
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        color: theme.palette.primary.light
                    }}

                    variant='outline'
                    onClick={returnMenuClick}
                    startIcon={<ArrowBackIcon />}
                >
                    volver
                </Button>
                <Button
                    sx={{
                        marginBottom: '10px',
                        
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        color: theme.palette.primary.main
                    }}
                    color="primary"
                    variant='outline'
                    onClick={onLogoutClick}
                    endIcon={<LogoutIcon />}
                >
                    Cerrar Sesión
                </Button>

            </Grid>
        </Grid>
    );
};
