import * as React from 'react'
import { Box, Button, Grid } from '@mui/material'
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LogoutIcon from '@mui/icons-material/Logout';
import { getInfoBirds } from '../../redux/actions/fetchAllBirds';
import logoBird from '../../assets/images/Logo.png'
import { useDispatch } from 'react-redux';
import { useTheme } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import { clearToken } from '../../redux/slices/Auth';

export const MenuBar = ({ isFilterOpen, setIsFilterOpen, ShowFilterButton, ShowBackButton }) => {
    const dispatch = useDispatch()
    const theme = useTheme()
    const navigate = useNavigate()
    const [selectedButton, setSelectedButton] = React.useState('todo');
    // const [showFilterButton, setShowFilterButton] = React.useState(true)


    const handleButtonTodos = (button) => {
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
        navigate('/')
        dispatch(clearToken())
        dispatch(getInfoBirds())
        dispatch(getOptionsData())
    };

    const returnMenuClick = () => {
        localStorage.removeItem('nombreIngles')
        navigate('/menu')
        dispatch(getInfoBirds())
        dispatch(getOptionsData())
    };
    return (

        <React.Fragment>
            <Grid
                container
                component={Box}
                sx={{
                    height: '10vh',
                    position: 'relative',
                    backgroundColor: theme.palette.primary.dark, // Fondo semitransparente para mejorar la legibilidad
                    justifyContent: 'space-between', // Alinea los elementos a lo largo del eje principal (horizontal) distribuyendo el espacio sobrante entre ellos
                    alignItems: 'center', // Alinea los elementos al centro verticalmente
                    padding: '0 20px', // Agrega algún relleno para mejorar la apariencia
                }}
            >
                {/* Logo en la esquina izquierda */}
                
                <img src={logoBird} alt="Logo" style={{ width: 'auto', height: '100%', marginBottom: '50px' }} />
                
                <Grid item sx={{ mb: 4 }}>
                    {ShowFilterButton && (
                        <Button
                            sx={{
                                marginBottom: '10px',
                                fontSize: '1rem', // Aumentar el tamaño del texto a 1.2 rem
                                fontWeight: 'bold',
                                color: theme.palette.primary.light,
                            }}
                            variant="outline"
                            color="primary"
                            onClick={handleFilterButtonClick}
                            endIcon={<FilterAltIcon />}
                        >
                            Abrir Filtro
                        </Button>
                    )}
                    {ShowBackButton && (
                        <Button
                            sx={{
                                marginBottom: '10px',
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                color: theme.palette.primary.main,
                            }}
                            variant="outline"
                            onClick={returnMenuClick}
                            startIcon={<ArrowBackIcon />}
                        >
                            volver
                        </Button>
                    )}
                    <Button
                        sx={{
                            marginBottom: '10px',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            color: theme.palette.primary.main,
                        }}
                        color="primary"
                        variant="outline"
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

//         <React.Fragment>
//         <Grid container component={Box} sx={{
//       height: '6vh',
//       position: 'relative',
//       backgroundColor: theme.palette.primary.dark, // Fondo semitransparente para mejorar la legibilidad
//     }}>
//             {/* <Grid item sx={{ marginLeft: '80px', marginBottom: '10px' }}>
//                 <Button
//                     sx={{
//                         fontSize: '1rem', // Aumentar el tamaño del texto a 1.2 rem
//                         fontWeight: 'bold', // Hacer el texto negrita
//                     }}
//                     color="primary"
//                     variant='contained'
//                     onClick={() => handleButtonClick('todo')}
//                 >
//                     Todo
//                 </Button>
//             </Grid> */}
//             <Grid item  sx={{ mb: 4}}>
//                 <Button sx={{
//                     marginBottom: '10px',

//                     fontSize: '1rem', // Aumentar el tamaño del texto a 1.2 rem
//                     fontWeight: 'bold',
//                     color: theme.palette.primary.light
//                 }}
//                     variant='outline'
//                     color="primary"
//                     onClick={handleFilterButtonClick}
//                     endIcon={<FilterAltIcon />}
//                 >
//                     Abrir Filtro
//                 </Button>
//                 <Button
//                     sx={{
//                         marginBottom: '10px',
//                         fontSize: '1rem',
//                         fontWeight: 'bold',
//                         color: theme.palette.primary.main
//                     }}

//                     variant='outline'
//                     onClick={returnMenuClick}
//                     startIcon={<ArrowBackIcon />}
//                 >
//                     volver
//                 </Button>
//                 <Button
//                     sx={{
//                         marginBottom: '10px',
//                         fontSize: '1rem',
//                         fontWeight: 'bold',
//                         color: theme.palette.primary.main
//                     }}
//                     color="primary"
//                     variant='outline'
//                     onClick={onLogoutClick}
//                     endIcon={<LogoutIcon />}
//                 >
//                     Cerrar Sesión
//                 </Button>

//             </Grid>
//         </Grid>
//         </React.Fragment>
//     );
// };
