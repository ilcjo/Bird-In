import * as React from 'react'
import { useTheme } from '@emotion/react';
import { About } from './About';
import { Covers } from './Covers';
import styled from '@emotion/styled';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { General } from './General';
import { CoverLogin } from './CoverLogin';

const StyledTabs = styled(Tabs)(({ theme }) => ({
    backgroundColor: 'rgba(0, 56, 28, 0.1)', // Establece el fondo transparente deseado
    backdropFilter: 'blur(5px)', // Efecto de desenfoque de fondo
    borderRadius: '10px 10px 0px 0px',
    marginTop: '0px',
    marginRight: '10%',
    marginLeft: '10%',
    color: theme.palette.primary.main, 
    '& .Mui-selected': {
        backgroundColor: theme.palette.secondary.light,
        
    },
}));
const StyledTab = styled(Tab)({
    minWidth: 'auto', // Ajusta el ancho mínimo de cada pestaña
    textTransform: 'none',
    color: '#ccd6cc',
    '&.Mui-selected .MuiTypography-root': {
        color: '#C1C700',
      },
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
