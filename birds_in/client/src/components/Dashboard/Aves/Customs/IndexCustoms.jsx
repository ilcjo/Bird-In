import * as React from 'react'
import { About } from './About';
import { Covers } from './Covers';
import { Box, Typography } from '@mui/material';
import { General } from './General';
import { CoverLogin } from './CoverLogin';
import { StyledTab, StyledTabs } from '../../../../assets/styles/MUIstyles'


export const IndexCustoms = () => {
    const [selectedTab, setSelectedTab] = React.useState(0);

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    return (
        <React.Fragment>
            <StyledTabs
                value={selectedTab}
                onChange={handleTabChange}
                textColor='primary'
                indicatorColor="primary"
                aria-label="tabsInfoActualizar"
            >
                <StyledTab label={<Typography variant='h5' >Portadas</Typography>} />
                <StyledTab label={<Typography variant='h5' >Inicio de Sesión</Typography>} onClick={() => setSelectedTab(1)} />
                <StyledTab label={<Typography variant='h5' >Sobre Mí</Typography>} onClick={() => setSelectedTab(2)} />
                <StyledTab label={<Typography variant='h5' >General</Typography>} onClick={() => setSelectedTab(3)} />
                {/* Agrega más pestañas según sea necesario */}
            </StyledTabs>
            <Box>
                {selectedTab === 0 && (
                    <React.Fragment>

                        <Covers />
                    </React.Fragment>
                )}
                {selectedTab === 1 && (
                    <CoverLogin />
                )}
                {selectedTab === 2 && (
                    <About />
                )}
                {selectedTab === 3 && (
                    <General />
                )}
                {/* Agrega más bloques para otras pestañas según sea necesario */}
            </Box>
        </React.Fragment>
    )
};
