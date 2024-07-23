
import * as React from 'react'
import { Box, Tab, Tabs, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/system';
import { useDispatch } from 'react-redux';
//ESTADOS GLOBALES
import { setEstateInfo } from '../../../redux/slices/createSlice';
//COMPONENTS
import { SearchBird } from './Update/SearchBird';
import { Customize } from './Customs/CustomizeIndex';
import { GruposOptions } from './Options/GruposOptions';
import { FamiliasOptions } from './Options/FamiliasOptions';
import { ZonasOptions } from './Options/ZonasOptions';
import { Contadores } from './Contadores';
import { IndexTabsCreate } from './Add/IndexTabsCreate';
import { IndexTabsUsuarios } from '../Usuarios/IndexTabUsuarios';


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

export const IndexD = () => {
  const dispatch = useDispatch();
  const theme = useTheme()
  const [selectedTab, setSelectedTab] = React.useState(1);
  const [isFormEnabled, setIsFormEnabled] = React.useState(false);

  const handleTabChange = (event, newValue) => {
    const convertNumber = Number(newValue)
    setSelectedTab(convertNumber);
    if (convertNumber === 1) {
      dispatch(setEstateInfo());
    }

  };

  const handleNavigateToSearch = () => {
    setSelectedTab(0);
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
          backgroundColor: 'rgba(0, 56, 28, 0.1)',
          backdropFilter: 'blur(2px)',
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
        <StyledTab
          label={<Typography variant='h5' >
            Contadores
          </Typography>
          }
        />
        <StyledTab
          label={<Typography variant='h5' >
            Familias
          </Typography>
          }
        />
        <StyledTab
          label={<Typography variant='h5' >
            Grupos
          </Typography>
          }
        />
        <StyledTab
          label={<Typography variant='h5' >
            Zonas
          </Typography>
          }
        />
        <StyledTab
          label={<Typography variant='h5' >
            Personalizar
          </Typography>
          } />
        <StyledTab
          label={<Typography variant='h5' >
            Usuarios
          </Typography>
          }
        />
      </StyledTabs >
      <div>
        {selectedTab === 0 && (
          <Box>
            <SearchBird changeTab={(newValue) => setSelectedTab(newValue)} isEnable={setIsFormEnabled} />

          </Box>
        )}
        {selectedTab === 1 && (
          <Box>
            <IndexTabsCreate changeTabSearch={handleNavigateToSearch} />
          </Box>
        )}
        {selectedTab === 2 && (
          <Box>
            <Contadores />
          </Box>
        )}
        {selectedTab === 3 && (
          <Box>
            <FamiliasOptions />
          </Box>
        )}
        {selectedTab === 4 && (
          <Box>
            <GruposOptions />
          </Box>
        )}
        {selectedTab === 5 && (
          <Box>
            <ZonasOptions />
          </Box>
        )}
        {selectedTab === 6 && (
          <Box>
            <Customize />
          </Box>
        )}
        {selectedTab === 7 && (
          <Box>
            <IndexTabsUsuarios />
          </Box>
        )}

      </div>
    </>
  );
};

