import * as React from 'react'
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { styled } from '@mui/system';
//components
import { CoverDelete } from '../Photos/CoverDelete'
import { UpdateForm } from '../../../Forms/Mamiferos/UpdateForm';

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

export const IndexTabsUpdates = ({ isEnable, changeTab, showUpdate, showSearch, selected, history }) => {
    const [selectedTab, setSelectedTab] = React.useState(0);
    const [coverSelected, setCoverSelected] = React.useState(false);
    const [imagesExistTabEnabled, setImagesExistTabEnabled] = React.useState(false);

      //función que determina si tiene cover en true
    const handleSetCoverSelected = (isSelected) => {
        setCoverSelected(isSelected);
    };

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const handleNavigateToCoverDelete = () => {
        setSelectedTab(1); // Cambia a la pestaña de imágenes existentes
    };


    React.useEffect(() => {
        let isFromImage = localStorage.getItem('isFromCreateImage');
        let isExist = localStorage.getItem('isExist');
        if (isFromImage === 'true' && isExist === 'false') {
            handleNavigateToCoverDelete();
        } else if (isFromImage === 'false' && isExist === 'true') {

        }
    }, []);

    return (
        <React.Fragment>
            <Box sx={{ width: '100%', maxWidth: '98%', margin: '0 auto', }}>
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
                <Box sx={{ width: '100%', maxWidth: '100%' }}>
                    {selectedTab === 0 && (
                        <React.Fragment>
                            <UpdateForm
                                changeTab={changeTab}
                                showUpdate={showUpdate}
                                showSearch={showSearch}
                                selected={selected}
                                changeImagenExist={handleNavigateToCoverDelete}
                                isImages={() => setImagesExistTabEnabled(true)}
                            />
                        </React.Fragment>
                    )}
                    {selectedTab === 1 && (
                        <CoverDelete
                            changeTab={changeTab}
                            showUpdate={showUpdate}
                            showSearch={showSearch}
                            selected={selected} />
                    )}
                </Box>
            </Box>
        </React.Fragment>
    )
};
