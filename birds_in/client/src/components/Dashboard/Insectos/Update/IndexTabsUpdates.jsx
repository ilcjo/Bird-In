import * as React from 'react'
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { styled } from '@mui/system';
//components
import { CoverDelete } from '../Photos/CoverDelete'
import { UpdateForm } from '../../../Forms/Insectos/UpdateForm';

const StyledTabs = styled(Tabs)(({ theme }) => ({
    backgroundColor: 'rgba(65, 99, 69, 0.55)', // Establece el fondo transparente deseado
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
    // rgba(65, 99, 69, 0.75) 50%,
    rgba(65, 99, 69, 0.42) 100%
  )
`,
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

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const handleNavigateToCoverDelete = () => {
        setSelectedTab(1); // Cambia a la pestaña de imágenes existentes
    };

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
                    indicatorColor="primary"
                    aria-label="tabsInfoActualizar"
                >
                    <StyledTab id='info-boton' label={<Typography variant='h4' >
                        Información
                    </Typography>} />
                    <StyledTab label={<Typography variant='h4' >
                        Imágenes Existente
                    </Typography>} onClick={handleNavigateToCoverDelete} />
                </StyledTabs>
                <Box sx={{}}>
                    {selectedTab === 0 && (
                        <React.Fragment>
                            <UpdateForm
                                changeTab={changeTab}
                                showUpdate={showUpdate}
                                showSearch={showSearch}
                                selected={selected}
                                changeImagenExist={handleNavigateToCoverDelete}
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
