
import * as React from 'react'
import { Box, Tab, Tabs, Typography, useTheme } from '@mui/material';
import { CreateBird } from '../Forms/CreateBird';
import { SearchBird } from './SearchBird';
import { useDispatch } from 'react-redux';
import { setEstateInfo } from '../../redux/slices/createSlice';
import { Customize } from './Customize';
import { Usuarios } from './Usuarios/Usuarios';
import { styled } from '@mui/system';
import { IndexOp } from './Options/IndexOp';
import { GruposOptions } from './Options/GruposOptions';
import { FamiliasOptions } from './Options/FamiliasOptions';
import { ZonasOptions } from './Options/ZonasOptions';
import { Contadores } from './Contadores';


const StyledTabs = styled(Tabs)(({ theme }) => ({
  backgroundColor: 'rgba(0, 56, 28, 0.1)', // Establece el fondo transparente deseado
  backdropFilter: 'blur(2px)', // Efecto de desenfoque de fondo
  borderRadius: '10px 10px 0px 0px',
  marginTop: '0px',

  '& .Mui-selected': {
    backgroundColor: theme.palette.secondary.light,
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
  const [selectedTab, setSelectedTab] = React.useState(0);
  const [isFormEnabled, setIsFormEnabled] = React.useState(false);

  const handleTabChange = (event, newValue) => {
    const convertNumber = Number(newValue)
    setSelectedTab(convertNumber);

    // Si el nuevo valor es 1 (pestaña "Buscar ave"), establece el estado de Redux
    if (convertNumber === 1) {

      dispatch(setEstateInfo()); // Reemplaza con la acción que establece el estado en Redux
    }

  };
  return (
    <>
      <StyledTabs
        value={selectedTab}
        onChange={handleTabChange}
        textColor='primary'
        indicatorColor="primary"
        aria-label="tabsAdmin"
        selectionfollowsfocu='true'
        sx={{
          backgroundColor: 'rgba(0, 56, 28, 0.1)', // Establece el fondo transparente deseado
          backdropFilter: 'blur(5px)', // Efecto de desenfoque de fondo
          mt: 4,
          borderRadius: '20px 20px 0px 0px',
          '& .Mui-selected': {
            backgroundColor: theme.palette.secondary.light,
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
            <CreateBird />
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
            <Usuarios />
          </Box>
        )}

      </div>
    </>
  );
};

