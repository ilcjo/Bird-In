import * as React from 'react'
import {
  Alert,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  styled,
  tableCellClasses,
  useTheme
} from '@mui/material';
import { useDispatch, useSelector, } from 'react-redux';
//REDUX
import { borrarUsuario, changePassDirect, getUsers, } from '../../../../redux/settings/actions/userLoginRegister'
//COMPONENTS
import { Loading } from '../../../utils/Loading';
//ICONS
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.main,
    ...theme.typography.h5,


  },
  [`&.${tableCellClasses.body}`]: {
    fontFamily: theme.typography.fontFamily,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: 'rgba(0, 56, 28, 0.3)', // Establece el fondo transparente deseado
    // backdropFilter: 'blur(120px)', // Efecto de desenfoque de fondo
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export const AllUsers = () => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const { users } = useSelector(state => state.authSlice)
  const [showDrop, setShowDrop] = React.useState(false);
  const [loadingMess, setLoadingMess] = React.useState('Agregando...');
  const [openSnackb, setOpenSnackb] = React.useState(false);
  const [errorSnackbOpen, setErrorSnackbOpen] = React.useState(false);
  const [errorMess, setErrorMess] = React.useState(null);
  const [showSuccessMessages, setShowSuccessMessages] = React.useState('');
  const [editingUserId, setEditingUserId] = React.useState(null); // Estado para manejar la edición de contraseña
  const [newPassword, setNewPassword] = React.useState(''); // Estado para manejar la nueva contraseña
  const [showPassword, setShowPassword] = React.useState(false);

  React.useEffect(() => {
    // Disparar la acción para obtener todos los usuarios pending al montar el componente
    dispatch(getUsers('approved'));
  }, []);

  const handleApprove = async (id, nombreUsuario) => {
    try {
      // Muestra una ventana de confirmación con información del usuario
      const isConfirmed = window.confirm(`¿Estás seguro de eliminar al usuario ${nombreUsuario}?`);

      // Si el usuario confirma, procede con la eliminación
      if (isConfirmed) {
        setShowDrop(true)
        setLoadingMess('Eliminando Usuario')
        // Lógica para eliminar el elemento
        await dispatch(borrarUsuario(id));
        setShowDrop(false)
        setShowSuccessMessages(`Usuario ${nombreUsuario} eliminado`);
        setOpenSnackb(true);
        await dispatch(getUsers('approved'));
      } else {
        // Si el usuario cancela, no hagas nada o muestra un mensaje opcional
        console.log('Eliminación cancelada por el usuario');
      }
    } catch (error) {
      setShowDrop(false)
      setErrorMess(String(error));
      setErrorSnackbOpen(true);

    }
  };

  const handleUpdatePasswordClick = (userId) => {
    setEditingUserId(userId);
  };

  const handlePasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleUpdatePasswordSubmit = async (userId) => {
    setShowDrop(true)
    setLoadingMess('Actualizando Contraseña')
    try {
      await dispatch(changePassDirect(newPassword, userId,));
      setShowSuccessMessages('Contraseña actualizada correctamente');
      setShowDrop(false)
      setOpenSnackb(true);
      setEditingUserId(null);
      setNewPassword('');
      await dispatch(getUsers('approved')); // Actualizar la lista de usuarios después de cambiar la contraseña
    } catch (error) {
      setShowDrop(false)
      setErrorMess(String(error));
      setErrorSnackbOpen(true);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackb(false);
    setShowSuccessMessages('')
  };
  const handleCancelEdit = () => {
    setEditingUserId(null);
    setNewPassword('');
  };
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div>
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
        <Grid item sx={12} md={12}>
          <TableContainer sx={{}}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">NOMBRE</StyledTableCell>
                  <StyledTableCell align="center">CORREO</StyledTableCell>
                  <StyledTableCell align="center">TIPO USUARIO</StyledTableCell>
                  {/* <StyledTableCell align="center">Fecha Registro</StyledTableCell> */}
                  <StyledTableCell align="center">ACTUALIZAR CONTRASEÑA</StyledTableCell>
                  <StyledTableCell align="center" >ELIMINAR</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((item, index) => (
                  <StyledTableRow key={item.index}>
                    <TableCell align="center" style={{ color: 'white' }}>
                      {item.nombre}
                    </TableCell>
                    <TableCell align="center" style={{ color: 'white' }}>
                      {item.email}
                    </TableCell>
                    <TableCell align="center" style={{ color: 'white' }}>
                      {item.tipo}
                    </TableCell>
                    {/* <TableCell align="center" style={{ color: 'white' }}>
                      {item.createdAt}
                    </TableCell> */}

                    <TableCell align="center">
                      {editingUserId === item.id ? (
                        <>
                          <TextField
                            type={showPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={handlePasswordChange}
                            placeholder="Nueva Contraseña"
                            size="small"
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={toggleShowPassword}
                                    edge="end"
                                  >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />
                          <Button
                            onClick={() => handleUpdatePasswordSubmit(item.id)}
                            color="primary"
                            variant="contained"
                            size="small"
                            sx={{ ml: 1 }}
                          >
                            Enviar
                          </Button>
                          <Button
                            onClick={handleCancelEdit}
                            color="error"
                            variant="contained"
                            size="small"
                            sx={{ ml: 1 }}
                          >
                            Cancelar
                          </Button>
                        </>
                      ) : (
                        <Button
                          onClick={() => handleUpdatePasswordClick(item.id)}
                          color="primary"
                          variant="contained"
                          size="small"
                        >
                          Actualizar
                        </Button>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Grid item xs={12} md={6}>
                        <Button onClick={() => handleApprove(item.id, item.nombre)}
                          color="error"
                          startIcon={<DeleteForeverIcon />}
                        ></Button>
                      </Grid>
                    </TableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
      {/* Backdrop para mostrar durante la carga */}
      <Loading
        message={loadingMess}
        open={showDrop}
      />

      <Snackbar
        open={openSnackb}
        autoHideDuration={5000} // Duración en milisegundos (ajusta según tus preferencias)
        onClose={handleCloseSnackbar}
        message={showSuccessMessages}
      >
      </Snackbar>

      {/* Snackbar for error message */}
      <Snackbar
        open={errorSnackbOpen}
        autoHideDuration={5000} // Adjust the duration as needed
        onClose={() => setErrorSnackbOpen(false)}
      >
        <Alert
          elevation={6}
          variant="filled"
          severity="error"
          onClose={() => setErrorSnackbOpen(false)}
        >
          {errorMess}
        </Alert>
      </Snackbar>
    </div>
  )
};


