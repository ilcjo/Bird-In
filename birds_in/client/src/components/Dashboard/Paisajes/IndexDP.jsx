
import * as React from 'react'
import { Box, Tab, Tabs, Typography, useTheme } from '@mui/material';
import { useDispatch } from 'react-redux';
import { styled } from '@mui/system';
//REDUX
import { setEstateInfo } from '../../../redux/slices/createSlice';
import { setStateInfoP } from '../../../redux/paisaje/slicesP/createLandSlice';
//COMPONENTS
import { IndexTabsCreateP } from './Add/IndexTabsCreateP';
import { SearchLands } from './Update/SearchLands';


const StyledTabs = styled(Tabs)(({ theme }) => ({
  backgroundColor: 'rgba(0, 56, 28, 0.1)', // Establece el fondo transparente deseado
  backdropFilter: 'blur(2px)', // Efecto de desenfoque de fondo
  borderRadius: '10px 10px 0px 0px',
  marginTop: '110px',
  '& .Mui-selected': {
    backgroundColor: theme.palette.custom.light,
  },
}));
const StyledTab = styled(Tab)({
  minWidth: 'auto', // Ajusta el ancho mínimo de cada pestaña
  color: '#ccd6cc',
  '&.Mui-selected .MuiTypography-root': {
    color: '#C1C700',
  },

});

export const IndexDP = () => {
  const dispatch = useDispatch();
  const theme = useTheme()
  const [selectedTab, setSelectedTab] = React.useState(1);
  const [isFormEnabled, setIsFormEnabled] = React.useState(false);

  const handleTabChange = (event, newValue) => {
    const convertNumber = Number(newValue)
    setSelectedTab(convertNumber);
    if (convertNumber === 1) {
      dispatch(setStateInfoP());
    }

  };

  const handleNavigateToSearch = () => {
    setSelectedTab(0); // Cambia a la pestaña de imágenes existentes
  };

  return (
    <>
      <StyledTabs
        value={selectedTab}
        onChange={handleTabChange}
        textColor='primary'
        indicatorColor="primary"
        aria-label="tabsAdmin"
        sx={{
          backgroundColor: 'rgba(0, 56, 28, 0.1)', // Establece el fondo transparente deseado
          backdropFilter: 'blur(5px)', // Efecto de desenfoque de fondo
          // mt: 20,
          borderRadius: '20px 20px 0px 0px',
          '& .Mui-selected': {
            backgroundColor: theme.palette.custom.light,
          }
        }}
      >
        <StyledTab label={
          <Typography variant='h5'>
            Actualizar
          </Typography>} />

        <StyledTab label={<Typography variant='h5' >
          Crear
        </Typography>}
        />

      </StyledTabs >
      <div>
        {selectedTab === 0 && (
          <Box>
            <SearchLands changeTab={(newValue) => setSelectedTab(newValue)} isEnable={setIsFormEnabled} />
          </Box>
        )}
        {selectedTab === 1 && (
          <Box>
            <IndexTabsCreateP changeTabSearch={handleNavigateToSearch} />
          </Box>
        )}
      </div>
    </>
  );
};

