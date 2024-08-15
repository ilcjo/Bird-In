import { Box, styled, Tab, Tabs, Typography, useTheme } from '@mui/material';
import * as React from 'react'
import { ZonasOptions } from './ZonasOptions';
import { IndexCustoms } from './Customs/IndexCustoms';
import { IndexTabsUsuarios } from './Usuarios/IndexTabUsuarios';

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

export const IndexSet = () => {
    const theme = useTheme()
    const [selectedTab, setSelectedTab] = React.useState(0);

    const handleTabChange = (event, newValue) => {
        const convertNumber = Number(newValue)
        setSelectedTab(convertNumber);
        if (convertNumber === 1) {
            console.log('hola')
            //   dispatch(setStateInfoP());
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
                    backgroundColor: 'rgba(0, 56, 28, 0.1)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: '20px 20px 0px 0px',
                    '& .Mui-selected': {
                        backgroundColor: theme.palette.custom.light,
                    }
                }}
            >
                <StyledTab label={
                    <Typography variant='h5'>
                        Países/Zonas
                    </Typography>} />
                <StyledTab label={<Typography variant='h5' >
                    Usuarios
                </Typography>}
                />
                <StyledTab label={<Typography variant='h5' >
                    Personalizar
                </Typography>}
                />
            </StyledTabs >
            <div>
                {selectedTab === 0 && (
                    <Box>
                        <ZonasOptions />
                    </Box>
                )}
                {selectedTab === 1 && (
                    <Box>
                        <IndexTabsUsuarios />
                    </Box>
                )}
                {selectedTab === 2 && (
                    <Box>
                        <IndexCustoms />
                    </Box>
                )}
            </div>
        </>
    )
}
