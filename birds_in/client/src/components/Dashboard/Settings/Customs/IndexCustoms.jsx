import * as React from 'react'
import { Box, Tab, Tabs, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/system';
import { About } from './About';
import { Covers } from './Covers';
import { General } from './General';
import { CoverLogin } from './CoverLogin';

const StyledTabs = styled(Tabs)(({ theme }) => ({
    backgroundColor: 'rgba(0, 56, 28, 0.1)', // Establece el fondo transparente deseado
    backdropFilter: 'blur(2px)', // Efecto de desenfoque de fondo
    borderRadius: '10px 10px 0px 0px',
    marginTop: '0px',
    width: '100%',
    // marginLeft: '150px',
    '& .Mui-selected': {
        backgroundColor: theme.palette.custom.light,
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

export const IndexCustoms = () => {
    const theme = useTheme()
    const [selectedTab, setSelectedTab] = React.useState(0);

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    return (
        <React.Fragment>
            <Box sx={{ width: '100%', maxWidth: '90%', margin: '0 auto', minWidth: '1200px' }}>
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
                </StyledTabs>
                <Box sx={{ width: '100%', maxWidth: '100%', }}>
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
            </Box>
        </React.Fragment>
    )
};
