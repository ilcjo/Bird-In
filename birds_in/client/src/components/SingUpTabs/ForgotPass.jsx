import * as React from 'react'
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { recoverPass } from '../../redux/actions/userLoginRegister';
import { useDispatch } from 'react-redux';


export const ForgotPass = () => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const [formRecover, setFormRecover] = React.useState({
    email: ''
  })

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(recoverPass());
  }

  return (
    <Box sx={{ margin: '10px' }}>
      <div>
        <Typography variant="h2" color='primary.light' sx={{ marginLeft: '2px', mb: 2 }}>
          ¿Olvidaste tu contraseña?
        </Typography>
        <Typography variant="body1" color='primary.main' sx={{ marginLeft: '2px', mb: 2 }}>
          Ingresa tu correo, recibirás un correo electrónico con los pasos para recuperar tu cuenta.
        </Typography>
      </div>

      <form onSubmit={handleLogin} >
        <TextField
          label="E-mail"
          name="email"
          type="email"
          value={formRecover.email}
          onChange={(e) => {
            setFormRecover({ ...formRecover, email: e.target.value });
          }}
          margin="normal"
          fullWidth
        />


      </form>
      <Grid container component={Box} justifyContent="center" size="medium">

        <Button variant="contained" onClick={handleLogin} color="primary">
          Recuperar Contraseña
        </Button>
      </Grid>

    </Box>
  )
}

