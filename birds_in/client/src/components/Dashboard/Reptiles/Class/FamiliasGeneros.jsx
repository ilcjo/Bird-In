import * as React from 'react';
import { Alert, Box, Grid, Snackbar } from '@mui/material';
import { useDispatch } from 'react-redux';
//components
import { FamiliaAddForm } from './familias/FamiliaAddForm';
import { FamiliaTable } from './familias/FamiliaTable';
import { Loading } from '../../../utils/Loading';
//redux
import { getOptionsDataR } from '../../../../redux/reptiles/actions/fetchOptions';
import { GeneroAddForm } from './grupos/GeneroAddForm';
import { GeneroTable } from './grupos/GeneroTable';

export const FamiliasGeneros = () => {
    const dispatch = useDispatch()
    const [onloading, setOnLoading] = React.useState(false);
    const [loadingMessage, setLoadingMessage] = React.useState('Agregando...');
    const [openSnack, setOpenSnack] = React.useState(false);
    const [errorSnackOpen, setErrorSnackOpen] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState(null);
    const [showSuccessMessages, setShowSuccessMessages] = React.useState('');

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnack(false);
    };

    React.useEffect(() => {
        setOnLoading(true)
        dispatch(getOptionsDataR());
        setOnLoading(false)
    }, []);

    return (
        <Box>
            <Grid container spacing={2} sx={{
                // display: 'flex',
                // alignItems: 'center',
                // justifyContent: 'center',
                backgroundColor: 'rgba(0, 56, 28, 0.1)', // Establece el fondo transparente deseado
                backdropFilter: 'blur(2px)', // Efecto de desenfoque de fondo
                width: '90%',
                // minWidth: '1200px',
                margin: '0 auto',
                padding: '40px 40px 30px 40px',
                borderRadius: '20px 20px 20px 20px',
                mb: 10
            }} >
                <Grid item xs={6}>
                    <FamiliaAddForm
                        onloading={setOnLoading}
                        loadingMessage={setLoadingMessage}
                        showSnackBar={setOpenSnack}
                        successMessages={setShowSuccessMessages}
                        errorMessage={setErrorMessage}
                        showErrorSnack={setErrorSnackOpen}
                    />
                    <FamiliaTable
                        onloading={setOnLoading}
                        loadingMessage={setLoadingMessage}
                        showSnackBar={setOpenSnack}
                        successMessages={setShowSuccessMessages}
                        errorMessage={setErrorMessage}
                        showErrorSnack={setErrorSnackOpen}
                    />
                </Grid>
                <Grid item xs={6}>
                    <GeneroAddForm
                        onloading={setOnLoading}
                        loadingMessage={setLoadingMessage}
                        showSnackBar={setOpenSnack}
                        successMessages={setShowSuccessMessages}
                        errorMessage={setErrorMessage}
                        showErrorSnack={setErrorSnackOpen}
                    />
                    <GeneroTable
                        onloading={setOnLoading}
                        loadingMessage={setLoadingMessage}
                        showSnackBar={setOpenSnack}
                        successMessages={setShowSuccessMessages}
                        errorMessage={setErrorMessage}
                        showErrorSnack={setErrorSnackOpen}
                    />
                </Grid>
            </Grid>
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
        </Box>
    );
};
