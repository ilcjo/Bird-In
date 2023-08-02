import * as React from 'react'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography, useTheme } from '@mui/material';
import { Link } from 'react-router-dom'

export const RegisterForm = ({ open, handleClose, data, handleChange, handleSubmit }) => {
  const theme = useTheme()

  const dialogStyles = {
    backgroundColor: 'rgba(204, 214, 204, 0.17)',
    "& .MuiDialogTitle-root": {
      variant: "h1",
      color: theme.palette.primary.light, // Establecer el color del texto utilizando el theme
    },
  };

  const labelStyles = {
    fontSize: '16px', // Tamaño de texto del label
    color: theme.palette.primary.main, // Color del texto del label

  };

  const inputStyles = {
    // Aquí puedes agregar los estilos que desees para los inputs

    '& .MuiInputBase-input': {
      backgroundColor: 'rgba(204,214,204,0.17) ',
      borderRadius: '8px',
      height: '50px',
      padding: '0px',


    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'none',

    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main, // Color del borde en el hover

    },
    // Otros estilos de los inputs...
  };


  return (
    <Box>
      <Dialog open={open} onClose={handleClose} sx={dialogStyles}>
        <DialogTitle  >
          <Typography variant="h1" color='primary.light'>
            Crear una Cuenta
          </Typography>
          <Typography variant="body1" color='primary.main'>
            Ya eres miembro ?   <Link> Log In </Link>
          </Typography>
        </DialogTitle>
        <DialogContent >

          <form onSubmit={handleSubmit} >
            <TextField
              label="Nombre Completo"
              name="name"
              value={data.name}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputLabelProps={{
                sx: labelStyles, // Establece el estilo del label del input
              }}
              InputProps={{
                sx: inputStyles, // Establece el estilo del input
              }}
              required />

            <TextField
              label="Pais"
              name="pais"
              value={data.pais}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputLabelProps={{
                sx: labelStyles, // Establece el estilo del label del input
              }}
              InputProps={{
                sx: inputStyles, // Establece el estilo del input
              }}
              required
            />
            <TextField
              label="E-mail"
              name="email"
              type="email"
              value={data.email}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputLabelProps={{
                sx: labelStyles, // Establece el estilo del label del input
              }}
              InputProps={{
                sx: inputStyles, // Establece el estilo del input
              }}
              required
            />

            <TextField
              label="Nombre de Usuario"
              name="userName"
              value={data.userName}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputLabelProps={{
                sx: labelStyles, // Establece el estilo del label del input
              }}
              InputProps={{
                sx: inputStyles, // Establece el estilo del input
              }}
              required
            />

            <TextField
              label="Password"
              name="pass"
              value={data.pass}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputLabelProps={{
                sx: labelStyles, // Establece el estilo del label del input
              }}
              InputProps={{
                sx: inputStyles, // Establece el estilo del input
              }}
              required
            />

          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined" color="primary">
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleSubmit} color="primary">
            Enviar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

