
import * as React from 'react'
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { CreateBird } from '../Forms/CreateBird';
import { SearchBird } from '../SearchBird';
import { BirdUp } from '../Forms/BirdUp';
import { UpdateBirds } from '../Forms/UpdateBirds';


export const IndexD = () => {
  const [selectedTab, setSelectedTab] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    const convertNumber = Number(newValue)
    setSelectedTab(convertNumber);
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
            Crear ave
          </Typography>
        }></Tab>
        <Tab label={<Typography variant='h5' >
          Buscar ave
        </Typography>}></Tab>
        <Tab label={<Typography variant='h5' >
          Actualizar Aves
        </Typography>}></Tab>

      </Tabs>
      <div>
        {selectedTab === 0 && (
          <Box>
            <CreateBird />
          </Box>
        )}
        {selectedTab === 1 && (
          <Box>
            <SearchBird changeTab={(newValue) => setSelectedTab(newValue)} />
          </Box>
        )}
        {selectedTab === 2 && (
          <Box>
            <UpdateBirds />
          </Box>
        )}

      </div>
    </>
  );
};

