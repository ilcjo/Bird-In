import * as React from 'react'
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { styled } from '@mui/system';
//COMPONENTS
import { CreateBird } from '../../../Forms/Aves/CreateBird'
import { CoverDelete } from '../Photos/CoverDelete';
import { CoverDeleteOrigin } from '../Photos/CoverDeleteOrigin';

const StyledTabs = styled(Tabs)(({ theme }) => ({
    backgroundColor: 'rgba(65, 99, 69, 0.55)',
    backdropFilter: 'blur(2px)', // Efecto de desenfoque de fondo
    borderRadius: '10px 10px 0px 0px',
    marginTop: '0px',
    width: '100%',
    boxSizing: 'border-box',
    '& .Mui-selected': {
        backgroundColor: theme.palette.custom.light,
        background: `
  linear-gradient(
    180deg,
    rgba(242, 246, 219, 0.38) 0%,
    
  )
`,
    },
}));
const StyledTab = styled(Tab)({
    minWidth: 'auto', // Ajusta el ancho mínimo de cada pestaña
    textTransform: 'none',
    color: '#05fe05',
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


    React.useEffect(() => {
        localStorage.removeItem('isFromCreateImage');
        localStorage.removeItem('isExist');
        localStorage.removeItem('nombreIngles');
    }, [])

    return (
        <React.Fragment>
            <Box sx={{
                width: '100%', maxWidth: '98%', margin: '0 auto', minWidth: '1200px', background: `
  linear-gradient(
    180deg,
   rgba(242, 246, 219, 0.14) 0%,
    rgba(65, 99, 69, 0.75) 50%,
    rgba(65, 99, 69, 0.42) 100%
  )
`,
                borderRadius: '15px'
            }}>
                <StyledTabs
                    value={selectedTab}
                    onChange={handleTabChange}
                    textColor='primary'
                    indicatorColor="secondary"
                    aria-label="tabsInfoActualizar"
                >
                    <StyledTab label={<Typography variant='h4' >
                        Información
                    </Typography>} />
                    {/* <StyledTab
                        label={<Typography variant='h5' >
                            Imágenes Existente
                        </Typography>}
                        disabled={!imagesExistTabEnabled} // Deshabilitar la pestaña si no hay imágenes
                    /> */}
                    {/* Agrega más pestañas según sea necesario */}
                </StyledTabs>
                <Box sx={{ width: '100%', maxWidth: '100%', }}>
                    {selectedTab === 0 && (
                        <React.Fragment>
                            {/* Contenido de la primera pestaña */}
                            <CreateBird
                                changeTabSearch={changeTabSearch}
                                changeImagenTab={() => setSelectedTab(1)}
                                isImages={() => setImagesExistTabEnabled(true)}
                            />
                        </React.Fragment>
                    )}
                    {selectedTab === 1 && (
                        <React.Fragment>
                            <CoverDeleteOrigin
                                isCreate={true}
                                changeTab={changeTab}
                                showUpdateBird={showUpdateBird}
                                showSearchBird={showSearchBird}
                                selectedBird={selectedBird}
                                setCoverSelected={handleSetCoverSelected}
                            />
                        </React.Fragment>
                    )}
                </Box>
            </Box>
        </React.Fragment>
    )
};