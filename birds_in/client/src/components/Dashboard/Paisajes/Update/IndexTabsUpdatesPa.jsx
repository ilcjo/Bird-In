import * as React from 'react'
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { CoverDeleteP } from '../Photos/CoverDeleteP';
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

    const handleNavigateToCoverDelete = () => {
        setSelectedTab(1); // Cambia a la pestaña de imágenes existentes
    };

    React.useEffect(() => {
        const executeSequence = async () => {
            // console.log('llegue a funcion que abre la pesataña');
            let isFromImage = localStorage.getItem('isFromCreateImage');
            let isExist = localStorage.getItem('isExist');
            if (isFromImage === 'true' && isExist === 'false') {
                // await handleButtonClickFromCreate(); // Espera a que se complete el update
                setTimeout(() => {
                    handleNavigateToCoverDelete(); // Ejecuta después del retraso
                    localStorage.removeItem('nombre');
                    localStorage.removeItem('isFromCreateImage');
                    localStorage.removeItem('isExist');
                }, 10000); // Ejecuta después de completar el update
              
            } else if (isFromImage === 'false' && isExist === 'true') {
                setSelectedTab(0);
                localStorage.removeItem('nombre');
                localStorage.removeItem('isFromCreateImage');
                localStorage.removeItem('isExist');
            }
        };
        executeSequence();
    }, []);

    return (
        <React.Fragment>
            <Box sx={{ width: '100%', maxWidth: '98%', margin: '0 auto', minWidth: '1200px', }}>
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
                    </Typography>} onClick={handleNavigateToCoverDelete} />
                </StyledTabs>
                <Box sx={{}}>
                    {selectedTab === 0 && (
                        <React.Fragment>
                            <UpdatePaisaje changeTab={changeTab}
                                showUpdateRegister={showUpdateRegister}
                                showSearchRegister={showSearchRegister}
                                selectedRegister={selectedRegister}
                                changeImagenExist={handleNavigateToCoverDelete}
                            />
                        </React.Fragment>
                    )}
                    {selectedTab === 1 && (
                        <CoverDeleteP
                            changeTab={changeTab}
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
