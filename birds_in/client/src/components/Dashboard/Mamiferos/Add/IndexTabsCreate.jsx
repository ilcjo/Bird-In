import * as React from 'react'
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { styled } from '@mui/system';
//COMPONENTS
import { CoverDelete } from '../Photos/CoverDelete';
import { CreateForm } from '../../../Forms/Mamiferos/CreateForm';

const StyledTabs = styled(Tabs)(({ theme }) => ({
    backgroundColor: 'rgba(0, 56, 28, 0.1)', // Establece el fondo transparente deseado
    backdropFilter: 'blur(2px)', // Efecto de desenfoque de fondo
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


export const IndexTabsCreate = ({
    isEnable,
    changeTab,
    showUpdateBird,
    showSearchBird,
    selectedBird,
    history,
    changeTabSearch }) => {
    const [selectedTab, setSelectedTab] = React.useState(0);
    const [coverSelected, setCoverSelected] = React.useState(false);
    const [imagesExistTabEnabled, setImagesExistTabEnabled] = React.useState(false);

    //si pasa a la otra pestaña que confirme el cover este 
    const handleTabChange = (event, newValue) => {
        // console.log(coverSelected, 'dentro')
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
                        disabled={!imagesExistTabEnabled} // Deshabilitar la pestaña si no hay imágenes
                    />
                    {/* Agrega más pestañas según sea necesario */}
                </StyledTabs>
                <Box sx={{ width: '100%', maxWidth: '100%', }}>
                    {selectedTab === 0 && (
                        <React.Fragment>
                            {/* Contenido de la primera pestaña */}
                            <CreateForm
                                changeTabSearch={changeTabSearch}
                                changeImagenTab={() => setSelectedTab(1)}
                                isImages={() => setImagesExistTabEnabled(true)}
                            />
                        </React.Fragment>
                    )}
                    {selectedTab === 1 && (
                        <CoverDelete
                            isCreate={true}
                            changeTab={changeTab}
                            showUpdateBird={showUpdateBird}
                            showSearchBird={showSearchBird}
                            selectedBird={selectedBird}
                            setCoverSelected={handleSetCoverSelected}
                        />
                    )}
                </Box>
            </Box>
        </React.Fragment>
    )
};