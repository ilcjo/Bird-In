import * as React from 'react'
import {
  Alert,
  Backdrop,
  Button,
  CircularProgress,
  Grid,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  styled,
  tableCellClasses,
  useTheme
} from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useDispatch, useSelector, } from 'react-redux';
import { borrarUsuario, getUsers, statusChangeUser, } from '../../../redux/actions/userLoginRegister';

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
        // Lógica para eliminar el elemento
        await dispatch(borrarUsuario(id));
        setShowSuccessMessages(`Usuario ${nombreUsuario} eliminado`);
        setOpenSnackb(true);
        await dispatch(getUsers('approved'));
      } else {
        // Si el usuario cancela, no hagas nada o muestra un mensaje opcional
        console.log('Eliminación cancelada por el usuario');
      }
    } catch (error) {
      setErrorMess(String(error));
      setErrorSnackbOpen(true);
    }
  };


  const sortAlphabetically = (array) => {
    return array.slice().sort((a, b) => {
      // Comprobamos si 'a' y 'b' son objetos válidos y tienen una propiedad 'nombre'
      if (a && a.nombre && b && b.nombre) {
        const nameA = a.nombre.charAt(0).toUpperCase() + a.nombre.slice(1);
        const nameB = b.nombre.charAt(0).toUpperCase() + b.nombre.slice(1);
        return nameA.localeCompare(nameB);
      }
      // Si 'a' o 'b' no tienen la propiedad 'nombre', no hacemos nada
      return 0;
    });
  };
  const sortedNombres = sortAlphabetically(users);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackb(false);
    setShowSuccessMessages('')
  };
  return (
    <div>

      <Grid container spacing={5} sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 'auto',
        //  minWidth: '180vh',
        margin: 'auto',
        backgroundColor: 'rgba(0, 56, 28, 0.1)', // Establece el fondo transparente deseado
        backdropFilter: 'blur(2px)', // Efecto de desenfoque de fondo
        padding: '0px 40px 60px 10px',
        borderRadius: '0px 0px 20px 20px'
      }} >
        <Grid item sx={12} md={12}>
          <TableContainer sx={{ maxHeight: 440, minWidth: '160vh' }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">NOMBRE</StyledTableCell>
                  <StyledTableCell align="center">CORREO</StyledTableCell>
                  <StyledTableCell align="center">TIPO DE USUARIO</StyledTableCell>
                  <StyledTableCell align="center" ></StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedNombres.map((item, index) => (
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
                    <TableCell align="center">
                      <Grid item xs={12} md={6}>
                        <Button onClick={() => handleApprove(item.id, item.nombre)}
                          color="secondary"
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
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showDrop}
      >
        <>
          <CircularProgress color="inherit" />
          <Typography variant="h5" color="inherit" sx={{ ml: 2 }}>
            {loadingMess}
          </Typography>
        </>
      </Backdrop>

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


