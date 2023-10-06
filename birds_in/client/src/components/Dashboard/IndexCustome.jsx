import * as React from 'react'
import { useTheme } from '@emotion/react';
import { About } from './Custome/About';
import { Covers } from './Custome/Covers';
import styled from '@emotion/styled';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { General } from './Custome/General';
import { CoverLogin } from './Custome/CoverLogin';

const StyledTabs = styled(Tabs)(({ theme }) => ({
    backgroundColor: theme.palette.secondary.light,
    borderRadius: '10px 10px 0px 0px',
    marginTop: '0px',
    width: '40%',
    marginLeft: '10%',
    '& .Mui-selected': {
        backgroundColor: theme.palette.secondary.light,
    },
}));
const StyledTab = styled(Tab)({
    minWidth: 'auto', // Ajusta el ancho mínimo de cada pestaña
    textTransform: 'none',
});

export const IndexCustome = () => {
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
                selectionfollowsfocu='true'
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
