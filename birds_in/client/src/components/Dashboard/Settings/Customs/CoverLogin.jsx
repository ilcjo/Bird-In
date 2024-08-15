import * as React from 'react'
import { Backdrop, Button, CircularProgress, Divider, Grid, Snackbar, SnackbarContent, TextField, Typography, useTheme } from '@mui/material'
import { SectionCovers } from '../../../utils/SectionCovers'
import { useDispatch, useSelector } from 'react-redux'
import { UpdateCustomizesText } from '../../../../redux/actions/Custome';
import SaveIcon from '@mui/icons-material/Save';

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
    const labelStyles = {
        color: theme.palette.primary.main, // Color del texto del label
        marginTop: '-9px',
    };

    const inputStyles = {
        // Aquí puedes agregar los estilos que desees para los inputs
        color: theme.palette.primary.light,
        backgroundColor: 'rgba(204,214,204,0.17)',
        borderRadius: '9px',

        '& .MuiInputBase-input': {
            padding: '0px',
            paddingLeft: '10px',
        },
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'none',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.main, // Color del borde en el hover
            backgroundColor: 'rgba(204,214,204,0.17)',
        },
        '& .css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.MuiSelect-select': {
            // Agrega los estilos que desees para el Select
            height: '40px',
            // width: '180px'
        },

    };
    return (
        <React.Fragment>
            <Grid container spacing={5} sx={{
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               width: 'auto',
               margin: 'auto',
               backgroundColor: 'rgba(0, 56, 28, 0.1)', // Establece el fondo transparente deseado
               backdropFilter: 'blur(2px)', // Efecto de desenfoque de fondo
               padding: '0px 40px 30px 0px',
               borderRadius: '0px 0px 20px 20px',
               mb: 10
            }} >

                <Grid item xs={6} sm={6}>
                    <Typography variant='h5' color='primary.light' sx={{ mt: -8 }} >
                        Portada inicio de sesión
                        <Divider sx={{ my: 1 }} />
                    </Typography>
                    <SectionCovers title="Inicio Portada" coverKey="cover_login" />
                </Grid>
                <Grid item xs={6} sm={6}>
                    <Typography variant='h5' color='primary.light' sx={{ mb: 3 }} >
                        Info foto portada inicio de sesión
                        <Divider sx={{ my: 1 }} />
                    </Typography>
                    <TextField
                        value={textLogin}
                        onChange={handleTextChange}
                        multiline
                        rows={2}
                        fullWidth
                        InputLabelProps={{
                            sx: labelStyles, // Estilo del label
                        }}
                        InputProps={{
                            
                            sx: inputStyles, // Estilo del input
                        }}
                    
                    />
                    <Button
                        sx={{
                            fontSize: '1.3rem', padding: '5px 10px', fontWeight: 'bold', mt: 2, textTransform: 'none',
                            backgroundColor: theme.palette.primary.dark,
                            color: theme.palette.primary.light,
                            '&:hover': {
                                backgroundColor: theme.palette.primary.dark, // Cambia el color de fondo en hover
                                color: theme.palette.primary.light, // Cambia el color del texto en hover
                                textTransform: 'none',
                            },
                        }}
                        variant="contained"
                        color="primary"
                        endIcon={<SaveIcon />}
                        onClick={handleSendToBackend}>
                        Grabar
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
                    />
                </Snackbar>
            )}
        </React.Fragment>
    )
};
