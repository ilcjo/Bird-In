
import * as React from 'react'
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { CreateBird } from '../Forms/CreateBird';
import { UpdateBirds } from '../Forms/UpdateBirds';
import { SearchBird } from './SearchBird';
import { useDispatch } from 'react-redux';
import { setEstateInfo } from '../../redux/slices/createSlice';


export const IndexD = () => {
  const dispatch = useDispatch();
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

      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        textColor='primary'
        indicatorColor="primary"
        aria-label="tabsAdmin"
        selectionfollowsfocu='true'
      >
        <Tab label={
          <Typography variant='h5' >
            Actualizar
          </Typography>
        }>

        </Tab>
        <Tab label={<Typography variant='h5' >
          Crear
        </Typography>}>
        </Tab>

        <Tab 
        label={<Typography variant='h5' color='white'>
          .
        </Typography>
      }
      disabled={!isFormEnabled}
      >

        </Tab>

      </Tabs>
      <div>
        {selectedTab === 1 && (
          <Box>
            <CreateBird />
          </Box>
        )}
        {selectedTab === 0 && (
          <Box>
            <SearchBird changeTab={(newValue) => setSelectedTab(newValue) } isEnable={setIsFormEnabled}/>
          </Box>
        )}
        {selectedTab === 2 && (
          <Box>
            {/* <UpdateBirds isEnable={setIsFormEnabled} /> */}
          </Box>
        )}

      </div>
    </>
  );
};

