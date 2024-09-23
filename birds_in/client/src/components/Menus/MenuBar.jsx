import * as React from 'react';
// Icons
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
// Library
import { Box, Button, Grid, useMediaQuery } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@emotion/react';
import { useNavigate, Link } from 'react-router-dom';
// Redux
import { clearToken } from '../../redux/settings/slices/Auth';
import { isOneBird } from '../../redux/birds/slices/InfoSlice';
import { getOptionsData } from '../../redux/birds/actions/fetchOptions';
import { getInfoBirds } from '../../redux/birds/actions/infoAction';

export const MenuBar = ({ isFilterOpen, setIsFilterOpen, ShowFilterButton, ShowBackButton, showAllButton, showAdmin, ShowMantButton }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const navigate = useNavigate();
  const admin = localStorage.getItem('tipoCliente');
  const isAdmin = admin === 'admin';
  const [selectedButton, setSelectedButton] = React.useState('todo');
  const { allCustom } = useSelector((state) => state.customizesSlice);
  const parameter = useSelector(state => state.birdSlice.filters);

  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Detecta si es móvil

  const handleButtonTodos = (button) => {
    setSelectedButton(button);

    if (button === 'todo') {
      dispatch(getInfoBirds());
    }
  };

  const handleFilterButtonClick = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const onLogoutClick = () => {
    localStorage.clear();
    navigate('/');
    dispatch(clearToken());
    dispatch(getOptionsData());
  };

  const returnMenuClick = () => {
    localStorage.removeItem('nombreIngles');
    navigate('/menu');
    dispatch(getOptionsData());
    dispatch(isOneBird(false));
  };

  const mantClick = () => {
    navigate('/mantenimiento');
    dispatch(getOptionsData());
  };

  return (
    <React.Fragment>
      <Grid
        container
        component={Box}
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 999,
          backdropFilter: 'blur(9px)',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '5.5vh',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Link to="/menu" style={{ marginLeft: '30px', width: 'auto', height: '110%', marginBottom: '100px', backgroundColor: '#004E37', borderRadius: '0px 0px 50px 50px' }}>
          <img src={allCustom.logo} alt="Logo"
            style={{ width: 'auto', height: '200%', marginBottom: '52px', backgroundColor: '#103300', borderRadius: '0px 0px 50px 50px' }}
            loading="lazy" />
        </Link>
        <Grid item sx={{ display: 'flex', alignItems: 'flex-start', mt: -13, mr: 1, gap: '10px' }}>
          {ShowMantButton && isAdmin && (
            <Button
              sx={{
                fontSize: '1rem',
                fontWeight: 'bold',
                color: 'white',
                '&:hover': {
                  borderBottom: '2px solid white',
                  borderRadius: '0px',
                },
              }}
              variant="text"
              onClick={mantClick}
              startIcon={<SettingsIcon />}
            >
              {!isMobile && 'Mantenimiento'}
            </Button>
          )}
          {ShowFilterButton && (
            <Button
              sx={{
                fontSize: '1rem',
                fontWeight: 'bold',
                color: 'white',
                '&:hover': {
                  borderBottom: '2px solid white',
                  borderRadius: '0px'
                },
              }}
              variant="text"
              onClick={handleFilterButtonClick}
              startIcon={<FilterAltIcon />}
            >
              {!isMobile && 'Abrir Filtro'}
            </Button>
          )}
          {ShowBackButton && (
            <Button
              sx={{
                fontSize: '1rem',
                fontWeight: 'bold',
                color: 'white',
                '&:hover': {
                  borderBottom: '2px solid white',
                  borderRadius: '0px',
                },
              }}
              variant="text"
              onClick={returnMenuClick}
              startIcon={<HomeIcon />}
            >
              {!isMobile && 'Menu Principal'}
            </Button>
          )}
          <Button
            sx={{
              fontSize: '1rem',
              fontWeight: 'bold',
              color: 'white',
              '&:hover': {
                borderBottom: '2px solid white',
                borderRadius: '0px',
                color: 'white'
              },
            }}
            variant="text"
            onClick={onLogoutClick}
            endIcon={<LogoutIcon />}
          >
            {!isMobile && 'Cerrar Sesión'}
          </Button>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};
