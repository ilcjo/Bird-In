import * as React from 'react'
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { styled } from '@mui/system';
//COMPONENTS
import { CreateLand } from '../../../Forms/Paisajes/CreateLand';
import { CoverDeleteP } from './CoverDeleteP';

const StyledTabs = styled(Tabs)(({ theme }) => ({
    backgroundColor: 'rgba(0, 56, 28, 0.1)', // Establece el fondo transparente deseado
    backdropFilter: 'blur(8px)', // Efecto de desenfoque de fondo
    borderRadius: '10px 10px 0px 0px',
    marginTop: '0px',
    width: '100%',
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


export const IndexTabsCreateP = ({
    isEnable,
    changeTab,
    showUpdateRegister,
    showSearchRegister,
    selectedRegister,
    history,
    changeTabSearch }) => {
    const [selectedTab, setSelectedTab] = React.useState(0);
    const [coverSelected, setCoverSelected] = React.useState(false);
    const [imagesExistTabEnabled, setImagesExistTabEnabled] = React.useState(false);

    const handleTabChange = (event, newValue) => {
        if (newValue === 0 && !coverSelected) {
            // Si se intenta cambiar a la pestaña de imágenes existentes sin una portada seleccionada, muestra el diálogo de advertencia
            alert("Debe Seleccionar una Portada.");
        } else {
            setSelectedTab(newValue);
            setImagesExistTabEnabled(false)
            setCoverSelected(false)
        }
    };

    //función que determina si tiene cover en true
    const handleSetCoverSelected = (isSelected) => {
        setCoverSelected(isSelected);
    };

    // const handleNavigateToCoverDelet = () => {
    //     setSelectedTab(1); // Cambia a la pestaña de imágenes existentes
    // };
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
                    <StyledTab label={<Typography variant='h5' >
                        Información
                    </Typography>} />
                    <StyledTab
                        label={<Typography variant='h5' >
                            Imágenes Existente
                        </Typography>}
                        disabled={!imagesExistTabEnabled} />

                </StyledTabs>
                <Box sx={{ width: '100%', maxWidth: '100%', }}>
                    {selectedTab === 0 && (
                        <React.Fragment>
                            {/* Contenido de la primera pestaña */}
                            <CreateLand
                                changeTabSearch={changeTabSearch}
                                changeImagenTab={() => setSelectedTab(1)}
                                isImages={() => setImagesExistTabEnabled(true)}
                            />
                        </React.Fragment>
                    )}
                    {selectedTab === 1 && (
                        <CoverDeleteP
                            isCreate={true}
                            changeTab={changeTab}
                            showUpdateRegister={showUpdateRegister}
                            showSearchRegister={showSearchRegister}
                            selectedRegister={selectedRegister}
                            setCoverSelected={handleSetCoverSelected}
                        />
                    )}
                </Box>
            </Box>
        </React.Fragment>
    )
};
