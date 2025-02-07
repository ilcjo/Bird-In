import * as React from 'react'
import { Button, Divider, Grid, TextField, Typography, useTheme } from '@mui/material'
import { useDispatch } from 'react-redux'
//icons
import AddIcon from '@mui/icons-material/Add';
//components
import { addGrupo, checkDuplicadosGrupo } from '../../../../../redux/mamiferos/actions/CrudClass';
import { getOptionsDataM } from '../../../../../redux/mamiferos/actions/fetchOptions';

export const GeneroAddForm = ({
  onloading
  , loadingMessage
  , showSnackBar
  , successMessages
  , errorMessage
  , showErrorSnack
}) => {
  const theme = useTheme()
  const dispatch = useDispatch()

  const [nombreGrupos, setNombreGrupos] = React.useState({
    nombreG: '',
    idGrupo: 0
  });

  const handleAgregar = async () => {
    const { nombreG } = nombreGrupos;

    // Verificar si el nombre de la familia está vacío
    if (!nombreG.trim()) {
      showErrorSnack(true);
      errorMessage('El nombre del Order no puede estar vacío.');
      return;
    }

    try {
      onloading(true);
      loadingMessage('Chequeando...');
      // Verificar si el nombre de la familia ya existe
      const duplicateExists = await dispatch(checkDuplicadosGrupo(nombreG));

      loadingMessage('Agregando..');
      const response = await dispatch(addGrupo(nombreGrupos));
      await dispatch(getOptionsDataM())
      onloading(false)
      successMessages('Order creado correctamente')
      showSnackBar(true);
      // Limpia el formulario o realiza otras acciones necesarias
      setNombreGrupos({
        nombreG: '',
        idGrupo: 0
      });
      // Puedes procesar la respuesta del servidor si es necesario
    } catch (error) {
      // Maneja el error a nivel superior
      errorMessage(String(error.response.data.error || error));
      showErrorSnack(true)
    } finally {
      onloading(false)
    }
  };

  return (
    <div>
      <Grid alignItems="center" container spacing={1} sx={{
        //   margin: 5,
        backgroundColor: 'rgba(0, 56, 28, 0.1)',
        p: 3,
        borderRadius: '10px',
        mb: 0
      }}>
        <Grid item xs={12} sm={9}>
          <Typography variant='h2' color='primary.light' sx={{ mb: 1 }}>
            Agregar Nuevo Order
            <Divider sx={{ my: 1.5, borderColor: theme.palette.primary.main, }} />
          </Typography>
        </Grid>
        <Grid item xs={12} md={9}>
          <TextField
            fullWidth
            label="Nombre de Order"
            value={nombreGrupos.nombreG}
            onChange={(e) => setNombreGrupos({ ...nombreGrupos, nombreG: e.target.value })}
           
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <Button
            sx={{
              mt: -1.5,
            }}
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
  )
}
