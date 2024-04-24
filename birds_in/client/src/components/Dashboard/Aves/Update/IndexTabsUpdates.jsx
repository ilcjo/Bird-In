import * as React from 'react'
import { UpdateBirds } from '../../../Forms/Aves/UpdateBirds'
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { CoverDelet } from '../Add/CoverDelet';

const StyledTabs = styled(Tabs)(({ theme }) => ({
    backgroundColor: 'rgba(0, 56, 28, 0.1)', // Establece el fondo transparente deseado
    backdropFilter: 'blur(2px)', // Efecto de desenfoque de fondo
    borderRadius: '10px 10px 0px 0px',
    marginTop: '0px',
    width: '80%',
    marginLeft: '150px',
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


export const IndexTabsUpdates = ({ isEnable, changeTab, showUpdateBird, showSearchBird, selectedBird, history }) => {
    const [selectedTab, setSelectedTab] = React.useState(0);

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const handleNavigateToCoverDelet = () => {
        setSelectedTab(1); // Cambia a la pestaña de imágenes existentes
    };
    return (
        <React.Fragment>
            {/* ... Otro contenido */}
            <StyledTabs
                value={selectedTab}
                onChange={handleTabChange}
                textColor='primary'
                indicatorColor="primary"
                aria-label="tabsInfoActualizar"
                selectionfollowsfocu='true'
            >
                <StyledTab label={<Typography variant='h5' >
                    Información
                </Typography>} />
                <StyledTab label={<Typography variant='h5' >
                    Imágenes Existente
                </Typography>} onClick={handleNavigateToCoverDelet} />
                {/* Agrega más pestañas según sea necesario */}
            </StyledTabs>
            <Box>
                {selectedTab === 0 && (
                    <React.Fragment>
                        {/* Contenido de la primera pestaña */}
                        <UpdateBirds changeTab={changeTab} showUpdateBird={showUpdateBird}
                            showSearchBird={showSearchBird}
                            selectedBird={selectedBird} 
                            changeImagenExist={handleNavigateToCoverDelet}
                            />
                    </React.Fragment>
                )}
                {selectedTab === 1 && (
                    <CoverDelet changeTab={changeTab} showUpdateBird={showUpdateBird}
                    showSearchBird={showSearchBird}
                    selectedBird={selectedBird} />
                )}
            </Box>
        </React.Fragment>
    )
};
