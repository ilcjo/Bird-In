import * as React from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import { Link } from 'react-router-dom'


export const RegisterForm = ({ open, handleClose, data, handleChange, handleSubmit }) => {
  const theme = useTheme()

  const dialogStyles = {
    backgroundColor: 'rgba(204, 214, 204, 0.17)',
    "& .MuiDialogTitle-root": {
      variant: "h1",
      color: theme.palette.primary.light, // Establecer el color del texto utilizando el theme
      borderRadius: '18px'
    },
  };
  const containerStyles = {
    display: 'flex',
    // flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100%', // Esto asegura que el contenedor ocupe al menos toda la altura disponible
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
  const actionsStyles = {
    justifyContent: 'center', // Centrar el botón horizontalmente
    
  };

  return (
    <Box>
      <Dialog open={open} onClose={handleClose} sx={dialogStyles}>
        <DialogTitle  >
          <Typography variant="h1" color='primary.light' sx>
            Crear una Cuenta
          </Typography>

        </DialogTitle>
        <DialogContent >

          <form onSubmit={handleSubmit} >
            <Box sx={containerStyles} >

              <TextField
                label="Nombre Completo"
                name="name"
                value={data.name}
                onChange={handleChange}

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
                margin="normal"
                InputLabelProps={{
                  sx: labelStyles, // Establece el estilo del label del input
                }}
                InputProps={{
                  sx: inputStyles, // Establece el estilo del input
                }}
                required
              />
        
            
        </Box>
          </form>
          
         
        </DialogContent>
        <DialogTitle>
          <Typography variant="body1" color="primary.main" sx={{  fontSize: '14px' }}>
            Ya eres miembro ?   <Link> Log In </Link>
          </Typography>
        </DialogTitle>
           <DialogActions sx={actionsStyles}>
          <Button variant="contained" onClick={handleSubmit} color="primary">
            Crear Cuenta
          </Button>
        </DialogActions>
       
      </Dialog>
    </Box>
  )
}

