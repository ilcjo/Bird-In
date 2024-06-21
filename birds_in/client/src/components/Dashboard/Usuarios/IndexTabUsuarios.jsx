import * as React from 'react'
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { AllUsers } from './AllUsers';
import { UserApprove } from './UserApprove';


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

export const IndexTabsUsuarios = ({ }) => {
    const [selectedTab, setSelectedTab] = React.useState(0);

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
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
                    Todos
                </Typography>} />
                <StyledTab label={<Typography variant='h5' >
                    Pendiente
                </Typography>} />
                {/* Agrega más pestañas según sea necesario */}
            </StyledTabs>
            <Box>
                {selectedTab === 0 && (
                    <React.Fragment>
                        {/* Contenido de la primera pestaña */}
                        <AllUsers
                            changeTab={handleTabChange}
                        />
                    </React.Fragment>
                )}
                {selectedTab === 1 && (
                    <UserApprove changeTab={handleTabChange} />
                )}
            </Box>
        </React.Fragment>
    )
};
