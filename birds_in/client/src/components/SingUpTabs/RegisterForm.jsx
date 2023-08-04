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
  MenuItem,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Link } from 'react-router-dom'
import CountryList from 'react-select-country-list';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { Boolean } from '../../redux/slices/OpenClose';
import { emailUser, nameUser, paisUser, passwordUser, resetForm } from '../../redux/slices/Register'

export const RegisterForm = ({ open }) => {

  const theme = useTheme()
  const dispatch = useDispatch()
  const [showPassword, setShowPassword] = React.useState('')
  const { name, email, pais, pass } = useSelector((state) => state.registerSlice)

  const handleClose = () => {
    dispatch(Boolean(false))
    dispatch(resetForm())
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('DAtos del formulario', name, email, pais, pass)
    handleClose()
    dispatch(resetForm())
  };

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
      <Dialog open={open} onClose={handleClose} sx={dialogStyles} PaperProps={{ sx: { padding: '11px', borderRadius: '15px' } }} >
        <DialogTitle  >
          <div>
            <Typography variant="h1" color='primary.light' sx={{ marginLeft: '2px' }}>
              Crear una Cuenta
            </Typography>
            <Typography variant="body1" color="primary.main" sx={{ marginLeft: '8px' }}>
              Ya eres miembro ?
              <MuiLink component={Link} to="/home" color="primary.light" variant='h4' underline="none" >
                LOG IN
              </MuiLink>
            </Typography>
          </div>
        </DialogTitle>
        <DialogContent >

          <Grid container component={Box}  >
            <form onSubmit={handleSubmit} >

              <TextField
                label="Nombre Completo"
                name="name"
                value={name}
                onChange={(e) => dispatch(nameUser(e.target.value))}
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
                label="E-mail"
                name="email"
                type="email"
                value={email}
                onChange={(e) => dispatch(emailUser(e.target.value))}
                margin="none"
                fullWidth
                InputLabelProps={{
                  sx: labelStyles, // Establece el estilo del label del input

                }}
                InputProps={{
                  sx: inputStyles, // Establece el estilo del input
                }}
                helperText=" Ejemplo: nombre@mail.com"
                FormHelperTextProps={{
                  sx: {
                    /* Agrega los estilos que desees para el texto del helper text */
                    /* Por ejemplo, para agregar un margen izquierdo: */
                    fontSize: '1rem',
                    color: theme.palette.primary.light,
                    /* Agrega otros estilos que desees... */
                  },
                }}
              />

              <TextField
                label="Pais (opcional)"
                name="pais"
                value={pais}
                onChange={(e) => dispatch(paisUser(e.target.value))}
                fullWidth
                select
                margin="dense"
                helperText="Seleccione su Pais de Origen"
                InputLabelProps={{
                  sx: labelStyles, // Establece el estilo del label del input
                }}
                InputProps={{
                  sx: inputStyles, // Establece el estilo del input
                }}
                SelectProps={{
                  classes: {
                    select: selectStyles['& .MuiSelect-select'], // Aplica la clase de estilos para el componente Select
                  },
                }}


                FormHelperTextProps={{
                  sx: {
                    /* Agrega los estilos que desees para el texto del helper text */
                    /* Por ejemplo, para agregar un margen izquierdo: */
                    fontSize: '1rem',
                    color: theme.palette.primary.light,
                    /* Agrega otros estilos que desees... */
                  },
                }}
              >

                {CountryList().getData().map((country) => (
                  <MenuItem key={country.label} value={country.label}>
                    {country.label}
                  </MenuItem>
                ))}
              </TextField >

              <TextField
                label="Password"
                name="passFirst"
                margin="dense"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                InputLabelProps={{
                  sx: labelStyles, // Establece el estilo del label del input
                }}
                InputProps={{
                  sx: inputStyles,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={() => setShowPassword(!showPassword)}
                        onMouseDown={(event) => event.preventDefault()}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}

                helperText="Al menos 6 caracteres y una mayuscula"
                FormHelperTextProps={{
                  sx: {
                    /* Agrega los estilos que desees para el texto del helper text */
                    /* Por ejemplo, para agregar un margen izquierdo: */
                    fontSize: '1rem',
                    color: theme.palette.primary.light,
                    /* Agrega otros estilos que desees... */
                  },
                }}
              />
              <TextField
                label="Confirme el Password"
                name="pass"
                value={pass}
                onChange={(e) => dispatch(passwordUser(e.target.value))}
                type={showPassword ? 'text' : 'password'}
                margin="dense"
                fullWidth
                InputLabelProps={{
                  sx: labelStyles, // Establece el estilo del label del input
                }}
                InputProps={{
                  sx: inputStyles, // Establece el estilo del input
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={() => setShowPassword(!showPassword)}
                        onMouseDown={(event) => event.preventDefault()}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
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

