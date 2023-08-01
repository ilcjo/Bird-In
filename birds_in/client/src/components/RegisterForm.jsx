import { DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import * as React from 'react'

export const RegisterForm = () => {
  const [open, setOpen] = React.useState(false)
  const [data, setData] = React.useState({
    userName: '',
    name: '',
    pais: ''
  });

  const handleOpen = () => {
    setOpen(true)
  };

  const handleClose = () => {
    setOpen(false)
  };

  const handleChange = (event) => {
    const { name, value } = event.tagert
    setData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('DAtos del formulario', data)
    handleClose()
  };

  return (
    <React.Fragment>
      <DialogTitle>
        <Typography variant="h1" color='primary.light'>
          Crear una Cuenta
        </Typography>
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField>

          </TextField>
        </form>
      </DialogContent>
    </React.Fragment>
  )
}

