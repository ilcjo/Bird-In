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
          height: '50px',
          zIndex: 1400,
          backdropFilter: 'blur(9px)',
          // background: 'rgba(0, 0, 0, 0.35)',
          borderBottom: '2px solid rgba(255,255,255,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          // boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* <Link to="/menu" style={{ display: 'flex', alignItems: 'center', height: '100%',
    paddingLeft: '16px', }}>
          <img src={allCustom.logo} alt="Logo"
            style={{  backgroundColor: '#103300', width: 'auto', height: '30px', borderRadius: '50%', border: '1px solid #f7fff7' }}
            loading="lazy" />
        </Link> */}
        <Link
          to="/menu"
          style={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            paddingLeft: '20px',
            paddingTop: '0px'
          }}
        >
          <Box
            sx={{
              paddingTop:5,
              height: 80,        
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '0px 0px 50px 50px',
              backgroundColor: '#103300',
              border: '1px solid #f7fff7',
              flexShrink: 0,    
            }}
          >
            <img
              src={allCustom.logo}
              alt="Logo"
              style={{
                height: '90%',
                width: '90%',
                objectFit: 'contain',
              }}
              loading="lazy"
            />
          </Box>
        </Link>

        <Grid item sx={{ display: 'flex', alignItems: 'flex-start', mr: 1, gap: 2 }}>
          {ShowMantButton && isAdmin && (
            <Button
              sx={{
                fontSize: '1rem',
                // textTransform: 'none',
                // fontWeight: 'bold',
                color: theme.palette.secondary.main,
                '&:hover': {
                  color: theme.palette.secondary.main,
                  borderBottom: '1px solid #f0f67d',
                  borderRadius: '0px',
                  borderWidth: '1px'
                },
              }}
              variant="text"
              onClick={mantClick}
              startIcon={<SettingsIcon />}
            >
              {!isMobile && 'Mantenimiento'}
            </Button>
          )}
          {ShowBackButton && (
            <Button
              sx={{
                fontSize: '1rem',
                color: theme.palette.secondary.main,
                '&:hover': {
                  color: theme.palette.secondary.main,
                  borderBottom: '1px solid #f0f67d',
                  borderRadius: '0px',
                  borderWidth: '1px'
                },
              }}
              variant="text"
              onClick={returnMenuClick}
              startIcon={<HomeIcon />}
            >
              {!isMobile && 'Menu Principal'}
            </Button>
          )}
          {ShowFilterButton && (
            <Button
              sx={{
                fontSize: '1rem',
                color: theme.palette.secondary.main,
                '&:hover': {
                  color: theme.palette.secondary.main,
                  borderBottom: '1px solid #f0f67d',
                  borderRadius: '0px',
                  borderWidth: '1px'
                },
              }}
              variant="text"
              onClick={handleFilterButtonClick}
              startIcon={<FilterAltIcon />}
            >
              {!isMobile && 'Abrir Filtro'}
            </Button>
          )}

          <Button
            sx={{
              fontSize: '1rem',
              color: theme.palette.secondary.main,
              '&:hover': {
                color: theme.palette.secondary.main,
                borderBottom: '1px solid #f0f67d',
                borderRadius: '0px',
                borderWidth: '1px'
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
