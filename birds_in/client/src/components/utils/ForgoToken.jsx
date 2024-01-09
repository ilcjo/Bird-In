import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Grid,
  Snackbar,
  SnackbarContent,
  TextField,
  Typography,
  useTheme
} from '@mui/material'
import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'

export const ForgoToken = () => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const { allCustom } = useSelector(state => state.customizesSlice)
  const [errorMessage, setErrorMessage] = React.useState('')
  const [successMessage, setSuccessMessage] = React.useState('');
  const [showBackdrop, setShowBackdrop] = React.useState(false);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [formData, setFormData] = React.useState({
    token: '',
  })
  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setShowBackdrop(true);
    try {
      // Simula una solicitud asíncrona al backend para registrar al usuario
      // await dispatch(registerData(formData));
      setOpenSnackbar(true)
      setSuccessMessage('Registro exitoso, esperando aprobación')
      // await dispatch(pendingEmail(formData.email, formData.name))
      setFormData({
        token: '',
      });
      close()
    } catch (error) {
      alert(`Error: ${error}`);
    } finally {
      setShowBackdrop(false);
    }
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
    height: '50px',
    '& .MuiInputBase-input': {
      padding: '0px',
      paddingLeft: '10px',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'none',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main, // Color del borde en el hover
      backgroundColor: 'rgba(0,56,28,0.22) ',
    },
    '& .css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.MuiSelect-select': {
      // Agrega los estilos que desees para el Select
      height: '50px',
      // width: '180px' // Ejemplo: cambia el color del texto a azul
    },

  };


  return (
    <Box
      component="form"
      onSubmit={handleSubmit} >
      <img alt='logo' src={allCustom.logo} style={{
        width: '130px', // Establece el ancho fijo que desees
        height: 'auto', // Permite que la altura se ajuste automáticamente para mantener la proporción
        marginLeft: '38%'
      }}
        loading="lazy"
      >
      </img>
      <Grid container spacing={2} justifyContent="center" sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100vh',
        margin: 'auto',
        backgroundColor: 'rgba(0, 56, 28, 0.5)', // Establece el fondo transparente deseado
        backdropFilter: 'blur(10px)', // Efecto de desenfoque de fondo
        padding: '40px 0px 40px 0px',
        borderRadius: '20px 20px 20px 20px',

      }}  >

        <Grid item >
          <Typography variant='h2' color='primary' sx={{}}>
            Introducir el Código 
          </Typography>

        </ Grid>
        <Grid item container xs={12} sm={12} spacing={1} justifyContent="center">
          <Grid item xs={2} sm={1.5}>
            <TextField
              name="digit1"
              value={formData.digit1}
              onChange={(e) => handleDigitChange(e, 1)}
              error={errorMessage}
              helperText={errorMessage}
              fullWidth
              margin="normal"
              InputLabelProps={{
                sx: labelStyles,
              }}
              InputProps={{
                sx: inputStyles,
              }}
            />
          </Grid>
          <Grid item xs={2} sm={1.5}>
            <TextField
              name="digit2"
              value={formData.digit2}
              onChange={(e) => handleDigitChange(e, 2)}
              error={errorMessage}
              helperText={errorMessage}
              fullWidth
              margin="normal"
              InputLabelProps={{
                sx: labelStyles,
              }}
              InputProps={{
                sx: inputStyles,
              }}
            />
          </Grid>
          <Grid item xs={2} sm={1.5}>
            <TextField
              name="digit3"
              value={formData.digit3}
              onChange={(e) => handleDigitChange(e, 3)}
              error={errorMessage}
              helperText={errorMessage}
              fullWidth
              margin="normal"
              InputLabelProps={{
                sx: labelStyles,
              }}
              InputProps={{
                sx: inputStyles,
              }}
            />
          </Grid>
          <Grid item xs={2} sm={1.5}>
            <TextField
              name="digit4"
              value={formData.digit4}
              onChange={(e) => handleDigitChange(e, 4)}
              error={errorMessage}
              helperText={errorMessage}
              fullWidth
              margin="normal"
              InputLabelProps={{
                sx: labelStyles,
              }}
              InputProps={{
                sx: inputStyles,
              }}
            />
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Typography variant='h5' color='primary.light' sx={{ mb: 2, ml: 10 }}>
            Digite el código de 4 dígitos que le llego por correo electrónico
          </Typography>
        </Grid>
        <Button
          onClick={handleSubmit}
          sx={{
            fontSize: '1.3rem', padding: '5px 10px', fontWeight: 'bold',  textTransform: 'none', mt: 4,
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.dark,
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
              color: theme.palette.primary.light,
              textTransform: 'none',
            },
          }}
          variant="contained"
          color="primary"
        >
          Verificar
        </Button>
      </Grid>
      <Backdrop open={showBackdrop} onClick={() => { }} style={{ zIndex: 1, color: '#fff' }}>
        <>
          <CircularProgress color="inherit" />
          <Typography variant="h5" color="inherit" sx={{ ml: 2 }}>
            Cargando...
          </Typography>
        </>
      </Backdrop>
      {/* Snackbar para mostrar el éxito */}
      {successMessage && (
        <Snackbar
          open={openSnackbar}
          autoHideDuration={10000}
          onClose={() => setSuccessMessage('')}
        >
          <SnackbarContent
            message={successMessage}

          />
        </Snackbar>
      )}
    </Box>

  )
}
