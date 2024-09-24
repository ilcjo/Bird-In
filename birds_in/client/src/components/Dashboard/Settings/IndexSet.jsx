import { Alert, Box, Snackbar, styled, Tab, Tabs, Typography, useTheme } from '@mui/material';
import * as React from 'react'
import { ZonasOptions } from './ZonasOptions';
import { IndexCustoms } from './Customs/IndexCustoms';
import { IndexTabsUsuarios } from './Usuarios/IndexTabUsuarios';
import { Loading } from '../../utils/Loading';

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

    const [onloading, setOnLoading] = React.useState(false);
    const [loadingMessage, setLoadingMessage] = React.useState('Agregando...');
    const [openSnack, setOpenSnack] = React.useState(false);
    const [errorSnackOpen, setErrorSnackOpen] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState(null);
    const [showSuccessMessages, setShowSuccessMessages] = React.useState('');

    const handleTabChange = (event, newValue) => {
        const convertNumber = Number(newValue)
        setSelectedTab(convertNumber);
        if (convertNumber === 1) {
            console.log('hola')
            //   dispatch(setStateInfoP());
        }
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnack(false);
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
                        <ZonasOptions
                            onloading={setOnLoading}
                            loadingMessage={setLoadingMessage}
                            showSnackBar={setOpenSnack}
                            successMessages={setShowSuccessMessages}
                            errorMessage={setErrorMessage}
                            showErrorSnack={setErrorSnackOpen}
                        />
                    </Box>
                )}
                {selectedTab === 1 && (
                    <Box>
                        <IndexTabsUsuarios
                            onloading={setOnLoading}
                            loadingMessage={setLoadingMessage}
                            showSnackBar={setOpenSnack}
                            successMessages={setShowSuccessMessages}
                            errorMessage={setErrorMessage}
                            showErrorSnack={setErrorSnackOpen}
                        />
                    </Box>
                )}
                {selectedTab === 2 && (
                    <Box>
                        <IndexCustoms />
                    </Box>
                )}
            </div>
            <Loading
                message={loadingMessage}
                open={onloading}
            />
            <Snackbar
                open={openSnack}
                autoHideDuration={5000} // Duración en mili segundos (ajusta según tus preferencias)
                onClose={handleCloseSnackbar}
                message={showSuccessMessages}
            // anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
            </Snackbar>
            {/* Snackbar for error message */}
            <Snackbar
                open={errorSnackOpen}
                autoHideDuration={5000} // Adjust the duration as needed
                onClose={() => setErrorSnackOpen(false)}
            // anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    elevation={6}
                    variant="filled"
                    severity="error"
                    onClose={() => setErrorSnackOpen(false)}
                >
                    {errorMessage}
                </Alert>
            </Snackbar>
        </>
    )
}
