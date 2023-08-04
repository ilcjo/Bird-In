import * as React from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
  useTheme,
  Link as MuiLink,
 
} from '@mui/material';
import { Link } from 'react-router-dom'



export const RegisterForm = () => {
  const theme = useTheme()
  const [showPassword, setShowPassword] = React.useState('')

  const dialogStyles = {
    backgroundColor: 'rgba(204, 214, 204, 0.17)',
   
    "& .MuiDialogTitle-root": {
      variant: "h1",
      color: theme.palette.primary.light, // Establecer el color del texto utilizando el theme
     
    },
  };

  const labelStyles = {
    color: theme.palette.primary.main, // Color del texto del label
    marginTop: '-6px',
    
  };

  const inputStyles = {
    // Aquí puedes agregar los estilos que desees para los inputs
    color: theme.palette.primary.light,
    backgroundColor: 'rgba(204,214,204,0.17) ',
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
      backgroundColor: 'rgba(193,190,0,0.22) ',
    },
    '& .css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.MuiSelect-select': {
      // Agrega los estilos que desees para el Select
      height: '50px',
      // width: '180px' // Ejemplo: cambia el color del texto a azul
    },

  };
  const selectStyles = {
    '& .MuiSelect-select': {
      // Estilos para el select en el TextField
      color: 'red', // Cambiar color del texto
    },
    '& .css-3dzjca-MuiPaper-root-MuiPopover-paper-MuiMenu-paper': {
      // Estilos para el Paper del Menu
      backgroundColor: 'blue', // Cambiar color de fondo del Paper
      color: 'white', // Cambiar color del texto en el Paper
    },
  };
  const actionsStyles = {
    justifyContent: 'center', // Centrar el botón horizontalmente
    margin: '0px',
    marginTop: '-20px'

  };

  return (
    <Box sx={{ width: '100px' }}>
      <Dialog open={open} onClose={handleClose} sx={dialogStyles} PaperProps={{ sx: { padding: '11px', borderRadius:'25px' } }} >
        <DialogTitle  >
          <div>
            <Typography variant="h1" color='primary.light' sx={{ marginLeft: '2px' }}>
              Log In
            </Typography>
            <Typography variant="body1" color="primary.main" sx={{ marginLeft: '8px' }}>
              Aun no eres miembro ?
              <MuiLink component={Link} to="/home" color="primary.light" variant='h4' underline="none" >
                Registrar
              </MuiLink>
            </Typography>
          </div>
        </DialogTitle>
        <DialogContent >

          <Grid container component={Box}  >
            <form onSubmit={handleSubmit} >
              <TextField
                label="E-mail"
                name="usuario"
                type="email"
                // value={data.name}
                // onChange={handleChange}
                helperText=" "
                fullWidth
                margin="dense"
                InputLabelProps={{
                  sx: labelStyles, // Establece el estilo del label del input
                }}
                InputProps={{
                  sx: inputStyles, // Establece el estilo del input
                }}
              />


              <TextField
                label="Contrasena"
                name="pass" 
                // value={data.email}
                // onChange={handleChange}
                margin="none"
                fullWidth
                InputLabelProps={{
                  sx: labelStyles, // Establece el estilo del label del input

                }}
                InputProps={{
                  sx: inputStyles, // Establece el estilo del input
                }}

              />
             
            </form>
          </Grid>


        </DialogContent>
        <DialogTitle>

        </DialogTitle>
        <DialogActions sx={actionsStyles}>
          <Button variant="outlined" onClick={handleClose} color="primary">
            Cancelar
          </Button>

          <Button variant="contained" onClick={handleSubmit} color="primary">
            Crear Cuenta
          </Button>
        </DialogActions>

      </Dialog>
    </Box>
  )
}

