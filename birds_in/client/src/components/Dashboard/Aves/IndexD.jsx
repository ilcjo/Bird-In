import * as React from 'react';
import { Box, Tab, Tabs, Typography, useTheme, } from '@mui/material';
import { styled } from '@mui/system';
import { useDispatch } from 'react-redux';
// COMPONENTS
import { SearchBird } from './Update/SearchBird';
import { Contadores } from './Contadores';
import { IndexTabsCreate } from './Add/IndexTabsCreate';
import { FamiliasGrupos } from './Class/FamiliasGrupos';
import { Loading } from '../../utils/Loading';
// redux
import { setEstateInfo } from '../../../redux/birds/slices/UpdateSlice';
import { getExcelAves } from '../../../redux/birds/actions/crudAction';

const StyledTabs = styled(Tabs)(({ theme }) => ({
  backgroundColor: 'rgba(0, 56, 28, 0.1)',
  backdropFilter: 'blur(8px)',
  borderRadius: '10px 10px 0px 0px',
  marginTop: '110px',
  '& .Mui-selected': {
    backgroundColor: theme.palette.custom.light,
  },
}));

const StyledTab = styled(Tab)({
  minWidth: 'auto',
  color: '#ccd6cc',
  '&.Mui-selected .MuiTypography-root': {
    color: '#C1C700',
  },
});

export const IndexD = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const [selectedTab, setSelectedTab] = React.useState(1);
  const [isFormEnabled, setIsFormEnabled] = React.useState(false);
  const [onloading, setOnLoading] = React.useState(false);
  const [loadingMessage, setLoadingMessage] = React.useState('Agregando...');

  const handleTabChange = (event, newValue) => {
    const convertNumber = Number(newValue);
    setSelectedTab(convertNumber);
    if (convertNumber === 1) {
      dispatch(setEstateInfo());
    } else if (convertNumber === 4) { // Índice de la pestaña "Descargar Excel"
      handleDownload();
    }
  };

  const handleNavigateToSearch = () => {
    setSelectedTab(0);
  };

  const handleDownload = async () => {
    try {
      setOnLoading(true);
      setLoadingMessage('Generando Excel, por favor espere...');
      await dispatch(getExcelAves());
    } catch (error) {
      console.log('Este es el error:', String(error));
    } finally {
      setOnLoading(false);
      setSelectedTab(1)
    }
  };

  React.useEffect(() => {
    const query = new URLSearchParams(location.search);
    const tab = query.get('tab');
    if (tab) {
      setSelectedTab(Number(tab));
    }
  }, [location]);

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
          backdropFilter: 'blur(8px)',
          borderRadius: '20px 20px 0px 0px',
          '& .Mui-selected': {
            backgroundColor: theme.palette.custom.light,
          }
        }}
      >
        <StyledTab label={<Typography variant='h5'>Actualizar</Typography>} />
        <StyledTab label={<Typography variant='h5'>Crear</Typography>} />
        <StyledTab label={<Typography variant='h5'>Contadores</Typography>} />
        <StyledTab label={<Typography variant='h5'>Familias/Grupos</Typography>} />
        <StyledTab label={<Typography variant='h5'>Descargar Excel</Typography>} />
      </StyledTabs>

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
            <FamiliasGrupos />
          </Box>
        )}
      </div>
      <Loading
        message={loadingMessage}
        open={onloading}
      />
    </>
  );
};
