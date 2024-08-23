import * as React from 'react';
import { Backdrop, Button, CircularProgress, Divider, Grid, Snackbar, SnackbarContent, TextField, Typography, useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
//icons
import SaveIcon from '@mui/icons-material/Save';
//redux
import { UpdateCustomizesText } from '../../../../redux/settings/actions/Custom';


export const About = () => {
    const theme = useTheme();
   
    const dispatch = useDispatch();
    const { allCustom } = useSelector(state => state.customizesSlice);
    const [textFirst, setTextFirst] = React.useState(allCustom.first_about || '');
    const [textAbout, setTextAbout] = React.useState(allCustom.text_about || '');
    const [textColab, setTextColab] = React.useState(allCustom.colaboradores || '');
    const [loadingMessage, setLoadingMessage] = React.useState('Actualizando...');
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const handleTextChange = (e, cover) => {
        const { target: { value } } = e;
        setTextByCover(cover, value);
    };

    const setTextByCover = (cover, value) => {
        switch (cover) {
            case 'first_about':
                setTextFirst(value);
                break;
            case 'text_about':
                setTextAbout(value);
                break;
            case 'colaboradores':
                setTextColab(value);
                break;
            // Agrega más casos según sea necesario para otros covers
            default:
                break;
        }
    };

    const handleSendToBackend = async (cover) => {
        setLoading(true);

        const text = {
            text: {
                [cover]: getTextByCover(cover),
            },
        };

        try {
            // Simula una solicitud asíncrona al backend
            // Reemplaza esto con tu lógica de solicitud al backend
            await dispatch(UpdateCustomizesText(text));

            setSnackbarOpen(true);
        } catch (error) {
            // Maneja errores si es necesario
        } finally {
            setLoading(false);
        }
    };

    const getTextByCover = (cover) => {
        switch (cover) {
            case 'first_about':
                return textFirst;
            case 'text_about':
                return textAbout;
            case 'colaboradores':
                return textColab;
            // Agrega más casos según sea necesario para otros covers
            default:
                return '';
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
                 width: 'auto',
                 margin: 'auto',
                 backgroundColor: 'rgba(0, 56, 28, 0.1)', // Establece el fondo transparente deseado
                 backdropFilter: 'blur(2px)', // Efecto de desenfoque de fondo
                 padding: '0px 40px 30px 0px',
                 borderRadius: '0px 0px 20px 20px',
                 mb: 10
            }} >
                <Grid item xs={12} sm={12}>
                    <Typography variant='h5' color='primary.light' sx={{}} >
                        Texto sobre mí
                        <Divider sx={{ my: 1 }} />
                    </Typography>
                    <Typography variant='h5' color='primary.main' sx={{ mb: 3, }} >
                        Primer Texto
                    </Typography>
                    <TextField
                        value={textFirst}
                        onChange={(e) => handleTextChange(e, 'first_about')}
                        multiline
                        rows={5}
                        fullWidth
                       
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
                        onClick={() => handleSendToBackend('first_about')}>
                        Grabar
                    </Button>
                    <Typography variant='h5' color='primary.main' sx={{ mb: 3, mt: 3 }} >
                        Texto Grande
                    </Typography>
                    <TextField
                        value={textAbout}
                        onChange={(e) => handleTextChange(e, 'text_about')}
                        multiline
                        rows={10}
                        fullWidth
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
                        onClick={() => handleSendToBackend('text_about')}>
                        Grabar
                    </Button>
                    <Typography variant='h5' color='primary.main' sx={{ mb: 3, mt: 3 }} >
                        Colaboradores
                    </Typography>
                    <TextField
                        value={textColab}
                        onChange={(e) => handleTextChange(e, 'colaboradores')}
                        multiline
                        rows={5}
                        fullWidth
                     
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
                        onClick={() => handleSendToBackend('colaboradores')}>
                        Grabar
                    </Button>
                </Grid>
                <Backdrop open={loading} onClick={() => { }} style={{ zIndex: 1, color: '#fff' }}>
                    <>
                        <CircularProgress color="inherit" />
                        <Typography variant="h5" color="inherit" sx={{ ml: 2 }}>
                            {loadingMessage}
                        </Typography>
                    </>
                </Backdrop>

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
            </Grid>
        </React.Fragment>
    )
};