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
  TextField,
  Typography,
  styled,
  tableCellClasses,
  useTheme
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useDispatch, useSelector } from 'react-redux';
import { addGrupo, eliminarGrupo, updateGrupo } from '../../../redux/actions/Options';
import { getOptionsData } from '../../../redux/actions/fetchOptions';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

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

export const GruposOptions = () => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const { grupos } = useSelector(state => state.birdSlice.options)
  const [nombreGrupos, setNombreGrupos] = React.useState({
    nombreG: '',
    idGrupo: 0
  });
  const [showDrop, setShowDrop] = React.useState(false);
  const [loadingMess, setLoadingMess] = React.useState('Agregando...');
  const [openSnackb, setOpenSnackb] = React.useState(false);
  const [errorSnackbOpen, setErrorSnackbOpen] = React.useState(false);
  const [errorMess, setErrorMess] = React.useState(null);
  const [showSuccessMessages, setShowSuccessMessages] = React.useState('');
  const [editMode, setEditMode] = React.useState(null);

  const handleEditGrupo = (index, newValue) => {
    setNombreGrupos((prevValues) => ({
      ...prevValues,
      nombreG: newValue, // Asigna el nuevo valor al campo zona
      idGrupo: index, // Asigna el valor de item.id al idZona
    }));
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este Grupo?')) {
      try {
        // Lógica para eliminar el elemento
        await dispatch(eliminarGrupo(id))
        setShowSuccessMessages('Grupo eliminado')
        setOpenSnackb(true);
        await dispatch(getOptionsData())

      } catch (error) {
        setErrorMess(String(error));
        setErrorSnackbOpen(true);
      }
    }
  };

  const handleEditClick = (index, zona) => {
    // Habilita el modo de edición para la fila correspondiente al índice 'index'
    setEditMode(index);
  };

  const handleCancelEdit = () => {
    // Cancela el modo de edición
    setEditMode(null);
  };

  // Función para guardar los cambios en una zona
  const saveChanges = async () => {
    try {

      // Realiza la acción para enviar los cambios al backend (dispatch, fetch, etc.)
      await dispatch(updateGrupo(nombreGrupos));
      setShowDrop(true);
      setLoadingMess('Actualizando...');
      setShowDrop(false);
      setShowSuccessMessages('Zona actualizada correctamente')
      setOpenSnackb(true);
      await dispatch(getOptionsData());
      setEditMode(null);

      // Reiniciar los estados después de guardar los cambios

      setNombreGrupos({
        nombreG: '',
        idGrupo: 0

      });

    } catch (error) {
      console.log(error);
      setErrorMess(String(error));
      setErrorSnackbOpen(true);
    }
  };

  const handleAgregar = async () => {
    try {
      // Aquí puedes enviar los datos al servidor o realizar otras acciones

      const response = await dispatch(addGrupo(nombreGrupos));
      setShowDrop(true);
      setLoadingMess('Agregando..');
      setShowDrop(false)
      setShowSuccessMessages('Grupo creado correctamente')
      setOpenSnackb(true);
      // Limpia el formulario o realiza otras acciones necesarias
      setNombreGrupos({
        nombreG: '',
        idGrupo: 0
      });
      await dispatch(getOptionsData())
      // Puedes procesar la respuesta del servidor si es necesario
    } catch (error) {
      // Maneja el error a nivel superior
      setErrorMess(String(error));
      setErrorSnackbOpen(true)
    }
  };

  const labelStyles = {
    color: theme.palette.primary.main, // Color del texto del label
    marginTop: '-10px',
  };

  const inputStyles = {
    // Aquí puedes agregar los estilos que desees para los inputs
    color: theme.palette.primary.light,
    backgroundColor: 'rgba(204,214,204,0.17)',
    borderRadius: '9px',
    height: '60px',
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
      // height: '50px',
      // marginTop: '100px',
      // width: '180px' // Ejemplo: cambia el color del texto a azul
    },

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
  const sortedGrupos = sortAlphabetically(grupos);

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
        width: '80%',
        minWidth: '170vh',
        backgroundColor: 'rgba(0, 56, 28, 0.1)', // Establece el fondo transparente deseado
        backdropFilter: 'blur(2px)', // Efecto de desenfoque de fondo
        margin: 'auto',
        padding: '40px 40px 40px 40px',
        borderRadius: '20px 20px 20px 20px'
      }} >
        <Grid item sx={12} md={12}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">GRUPOS</StyledTableCell>
                  <StyledTableCell align="center" ></StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedGrupos.map((item, index) => (
                  <StyledTableRow key={item.index}>
                    <TableCell align="center" style={{ color: 'white' }}>
                      {editMode === index ? (
                        // Modo de edición
                        <>
                          <TextField
                            fullWidth
                            value={nombreGrupos.idGrupo === item.id ? nombreGrupos.nombreG : item.nombre}
                            onChange={(e) => handleEditGrupo(item.id, e.target.value)}
                            InputLabelProps={{
                              sx: labelStyles, // Establece el estilo del label del input

                            }}
                            InputProps={{
                              sx: inputStyles, // Establece el estilo del input
                            }}
                          />
                        </>
                      ) : (
                        // Modo de visualización
                        item.nombre
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {editMode === index ? (
                        // Modo de edición
                        <>
                          <Button onClick={saveChanges} sx={{
                            fontSize: '1rem', padding: '5px 10px', fontWeight: 'bold', ml: 2, mt: 0.7, textTransform: 'none',
                            backgroundColor: theme.palette.primary.dark,
                            color: theme.palette.primary.light,
                            '&:hover': {
                              backgroundColor: theme.palette.primary.dark, // Cambia el color de fondo en hover
                              color: theme.palette.primary.main, // Cambia el color del texto en hover
                              textTransform: 'none',
                            },
                          }}
                            variant="outlined"
                            color="primary"
                          >Grabar</Button>
                          <Button onClick={handleCancelEdit}
                            sx={{
                              fontSize: '1rem', padding: '5px 10px', fontWeight: 'bold', ml: 2, mt: 0.7, textTransform: 'none',
                              // backgroundColor: theme.palette.primary.main,
                              color: theme.palette.primary.light,
                              '&:hover': {
                                backgroundColor: 'red', // Cambia el color de fondo en hover
                                color: theme.palette.primary.light, // Cambia el color del texto en hover
                                textTransform: 'none',
                              },
                            }}
                            variant="contained"
                            color="secondary"
                          >Cancelar</Button>
                        </>
                      ) : (
                        <Grid container >
                          <Grid item xs={12} md={6}>
                            <Button onClick={() => handleEditClick(index, item)}
                              sx={{
                                fontSize: '1rem', padding: '5px 10px', fontWeight: 'bold', ml: 7, mr: -7, mt: 0.7, textTransform: 'none',
                                // backgroundColor: theme.palette.primary.main,
                                color: theme.palette.primary.main,
                                '&:hover': {
                                  // backgroundColor: theme.palette.primary.dark, // Cambia el color de fondo en hover
                                  color: theme.palette.primary.light, // Cambia el color del texto en hover
                                  textTransform: 'none',
                                },
                              }}
                              variant="outlined"
                              color="primary"
                            >Editar</Button>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Button onClick={() => handleDelete(item.id)}
                              color="secondary"
                              startIcon={<DeleteForeverIcon />}
                            ></Button>
                          </Grid>
                        </Grid>
                      )}
                    </TableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid container spacing={1} sx={{
          margin: 3,

        }}>

          <Grid item xs={12} md={11}>

            <TextField
              fullWidth
              label="Nombre de Grupo"
              value={nombreGrupos.nombreG}
              onChange={(e) => setNombreGrupos({ ...nombreGrupos, nombreG: e.target.value })}
              InputLabelProps={{
                sx: labelStyles,
              }}
              InputProps={{
                sx: inputStyles,
              }}
            />
          </Grid>
          <Grid item xs={12} md={1}>
            <Button
              sx={{
                fontSize: '1.3rem', padding: '5px 10px', fontWeight: 'bold', ml: 2, mt: 0.7, textTransform: 'none',
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.dark,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark, // Cambia el color de fondo en hover
                  color: theme.palette.primary.light, // Cambia el color del texto en hover
                  textTransform: 'none',
                },
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


