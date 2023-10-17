import * as React from 'react'
import { Backdrop, Button, CircularProgress, Divider, Grid, Snackbar, SnackbarContent, TextField, Typography, useTheme } from '@mui/material'
import { SectionCovers } from '../SectionCovers'
import { useDispatch, useSelector } from 'react-redux'
import { UpdateCustomizesText } from '../../../redux/actions/Custome';


export const CoverLogin = () => {
    const theme = useTheme()
    const dispatch = useDispatch()
    const { allCustom } = useSelector(state => state.customizesSlice)
    const [textLogin, setTextLogin] = React.useState(allCustom.text_login || '');
    const [loadingMessage, setLoadingMessage] = React.useState('Actualizando...'); // Nuevo estado para el indicador de carga
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const handleTextChange = (e) => {
        const { target: { value } } = e;
        setTextLogin(value);
    };

    // Maneja el envío de datos al backend
    const handleSendToBackend = async () => {
        setLoading(true);

        const text = {
            text: {
                text_login: textLogin,
            },
        };

        try {
            // Simula una solicitud asíncrona al backend
            // En una aplicación real, reemplaza esto con tu lógica de solicitud al backend
            await dispatch(UpdateCustomizesText(text));

            setSnackbarOpen(true); // Muestra el Snackbar si la actualización es exitosa
        } catch (error) {
            // Maneja errores si es necesario
        } finally {
            setLoading(false);
        }
    };
    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnackbarOpen(false);
    };
    return (
        <React.Fragment>
            <Grid container spacing={5} sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '80%',
                margin: 'auto',
                backgroundColor: theme.palette.secondary.light,
                padding: '0px 40px 30px 0px',
                borderRadius: '0px 0px 20px 20px'
            }} >

                <Grid item xs={6} sm={6}>
                    <Typography variant='h5' color='primary.light' sx={{ mt: -8 }} >
                        Portada Inicio de sesión
                        <Divider sx={{ my: 1 }} />
                    </Typography>
                    <SectionCovers title="Inicio Portada" coverKey="cover_login" />
                </Grid>
                <Grid item xs={6} sm={6}>
                    <Typography variant='h5' color='primary.light' sx={{ mb: 3 }} >
                        Info foto portada Inicio de sesión
                        <Divider sx={{ my: 1 }} />
                    </Typography>
                    <TextField
                        value={textLogin}
                        onChange={handleTextChange}
                        multiline
                        rows={2}
                        fullWidth
                    />
                    <Button
                        sx={{
                            fontSize: '1.3rem', padding: '5px 10px', fontWeight: 'bold', m: 1, textTransform: 'none',
                            color: theme.palette.primary.main,
                            '&:hover': {
                                backgroundColor: theme.palette.primary.main, // Cambia el color de fondo en hover
                                color: theme.palette.primary.dark, // Cambia el color del texto en hover
                                textTransform: 'none',
                            },
                        }}
                        variant="outlined"
                        color="primary"
                        onClick={handleSendToBackend}>
                        Actualizar
                    </Button>
                </Grid>
            </Grid>
            <Backdrop open={loading} onClick={() => { }} style={{ zIndex: 1, color: '#fff' }}>
                <>
                    <CircularProgress color="inherit" />
                    <Typography variant="h5" color="inherit" sx={{ ml: 2 }}>
                        {loadingMessage}
                    </Typography>
                </>
            </Backdrop>
            {/* <Snackbar
                open={!!uploadError}
                autoHideDuration={6000}
                onClose={() => setUploadError(null)}
            >
                <SnackbarContent
                    message={uploadError}
                    style={{ backgroundColor: '#d32f2f' }}
                />
            </Snackbar> */}

            {/* Snackbar para mostrar el éxito */}
            {snackbarOpen && (
                <Snackbar
                    open={true}
                    autoHideDuration={6000}
                    onClose={handleSnackbarClose}
                >
                    <SnackbarContent
                        message="Texto actualizado."
                        style={{ backgroundColor: '#43a047' }}
                    />
                </Snackbar>
            )}
        </React.Fragment>
    )
};
