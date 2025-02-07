import * as React from 'react';
import { Button, Divider, Grid, TextField, Typography, useTheme } from '@mui/material';
import { useDispatch } from 'react-redux';
import AddIcon from '@mui/icons-material/Add';
import { getOptionsDataM } from '../../../../../redux/mamiferos/actions/fetchOptions';
import { addFamilia, checkDuplicadosFamilia } from '../../../../../redux/mamiferos/actions/CrudClass';

export const FamiliaAddForm = ({
    onloading,
    loadingMessage,
    showSnackBar,
    successMessages,
    errorMessage,
    showErrorSnack
}) => {
    const theme = useTheme();
    const dispatch = useDispatch();

    const [nombreFamilia, setNombreFamilia] = React.useState({
        nombreF: '',
        idFamilia: 0
    });

    const handleAgregar = async () => {
        const { nombreF } = nombreFamilia;

        // Verificar si el nombre de la familia está vacío
        if (!nombreF.trim()) {
            showErrorSnack(true);
            errorMessage('El nombre de la familia no puede estar vacío.');
            return;
        }
        
        try {
            onloading(true);
            loadingMessage('Chequeando...');
            // Verificar si el nombre de la familia ya existe
            const duplicateExists = await dispatch(checkDuplicadosFamilia(nombreF));
            // Continuar con el proceso de agregar la familia
            loadingMessage('Agregando...');
            await dispatch(addFamilia(nombreFamilia));
            await dispatch(getOptionsDataM());
            onloading(false);
            successMessages('Familia creada correctamente');
            showSnackBar(true);

            // Limpiar el formulario
            setNombreFamilia({
                nombreF: '',
                idFamilia: 0
            });

        } catch (error) {
            // Manejar errores
            errorMessage(String(error.response.data.error || error));
            showErrorSnack(true);
        } finally {
            onloading(false);
        }
    };

    return (
        <div>
            <Grid alignItems="center" container spacing={1} sx={{
                backgroundColor: 'rgba(0, 56, 28, 0.1)',
                p: 3,
                borderRadius: '10px',
                mb: 0
            }}>
                <Grid item xs={12} sm={9}>
                    <Typography variant='h2' color='primary.light' sx={{ mb: 1 }}>
                        Agregar Nueva Familia
                        <Divider sx={{ my: 1.5, borderColor: theme.palette.primary.main, }} />
                    </Typography>
                </Grid>
                <Grid item xs={12} md={9}>
                    <TextField
                        fullWidth
                        label="Nombre de Familia"
                        value={nombreFamilia.nombreF}
                        onChange={(e) => setNombreFamilia({ ...nombreFamilia, nombreF: e.target.value })}
                    />
                </Grid>
                <Grid item xs={12} md={2}>
                    <Button
                        sx={{ mt: -1.5 }}
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={handleAgregar}
                    >
                        Agregar
                    </Button>
                </Grid>
            </Grid>
        </div>
    );
};
