import * as React from 'react'
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { CoverDeletP } from '../Add/CoverDeletP';
import { UpdatePaisaje } from '../../../Forms/Paisajes/UpdatePaisaje';

const StyledTabs = styled(Tabs)(({ theme }) => ({
    backgroundColor: 'rgba(0, 56, 28, 0.1)', // Establece el fondo transparente deseado
    backdropFilter: 'blur(8px)', // Efecto de desenfoque de fondo
    borderRadius: '10px 10px 0px 0px',
    marginTop: '0px',
    width: '100%',
    boxSizing: 'border-box',
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

export const IndexTabsUpdatesPa = ({ isEnable, changeTab,
    showUpdateRegister,
    showSearchRegister,
    selectedRegister,
    history }) => {
    const [selectedTab, setSelectedTab] = React.useState(0);

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const handleNavigateToCoverDelet = () => {
        setSelectedTab(1); // Cambia a la pestaña de imágenes existentes
    };
    return (
        <React.Fragment>
            <Box sx={{ width: '100%', maxWidth: '98%', margin: '0 auto', minWidth: '900px' }}>
                <StyledTabs
                    value={selectedTab}
                    onChange={handleTabChange}
                    textColor='primary'
                    indicatorColor="primary"
                    aria-label="tabsInfoActualizar"
                >
                    <StyledTab label={<Typography variant='h5' >
                        Información
                    </Typography>} />
                    <StyledTab label={<Typography variant='h5' >
                        Imágenes Existente
                    </Typography>} onClick={handleNavigateToCoverDelet} />
                    {/* Agrega más pestañas según sea necesario */}
                </StyledTabs>
                <Box sx={{ width: '100%', maxWidth: '100%' }}>
                    {selectedTab === 0 && (
                        <React.Fragment>
                            {/* Contenido de la primera pestaña */}
                            <UpdatePaisaje changeTab={changeTab}
                                showUpdateRegister={showUpdateRegister}
                                showSearchRegister={showSearchRegister}
                                selectedRegister={selectedRegister}
                                changeImagenExist={handleNavigateToCoverDelet}
                            />
                        </React.Fragment>
                    )}
                    {selectedTab === 1 && (
                        <CoverDeletP changeTab={changeTab}
                            showUpdateRegister={showUpdateRegister}
                            showSearchRegister={showSearchRegister}
                            selectedRegister={selectedRegister}
                        />
                    )}
                </Box>
            </Box>
        </React.Fragment>
    )
};
