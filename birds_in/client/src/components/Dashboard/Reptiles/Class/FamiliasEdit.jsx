import * as React from 'react'
import {
  Alert,
  Backdrop,
  Button,
  CircularProgress,
  Divider,
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
import { useDispatch, useSelector } from 'react-redux';
//icons
import AddIcon from '@mui/icons-material/Add';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
//redux
import { addFamilia, eliminarFamilia, updateFamilia } from '../../../../redux/mamiferos/actions/CrudClass';
import { getOptionsDataM } from '../../../../redux/mamiferos/actions/fetchOptions';

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

export const FamiliasEdit = () => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const { familias } = useSelector(state => state.filters.options)
  const [nombreFamilia, setNombreFamilia] = React.useState({
    nombreF: '',
    idFamilia: 0
  });
  const [showBack, setShowBack] = React.useState(false);
  const [loadingMe, setLoadingMe] = React.useState('Agregando...');
  const [openSnack, setOpenSnack] = React.useState(false);
  const [errorSnackOpen, setErrorSnackOpen] = React.useState(false);
  const [errorMe, setErrorMe] = React.useState(null);
  const [showSuccessMessages, setShowSuccessMessages] = React.useState('');
  const [editMode, setEditMode] = React.useState(null);

  const handleEditFamilia = (id, newValue) => {
    setNombreFamilia((prevValues) => ({
      ...prevValues,
      nombreF: newValue, // Asigna el nuevo valor al campo zona
      idFamilia: id, // Asigna el valor de item.id al idZona
    }));
  };


  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar esta Familia?')) {
      try {
        setShowBack(true);
        setLoadingMe('Eliminando..')
        // Lógica para eliminar el elemento
        await dispatch(eliminarFamilia(id))
        await dispatch(getOptionsDataM())
        setShowBack(false);
        setShowSuccessMessages('Familia Eliminada Exitosamente')
        setOpenSnack(true);
      } catch (error) {
        setErrorMe(String(error));
        setErrorSnackOpen(true);
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
      setShowBack(true);
      setLoadingMe('Actualizando...');
      // Realiza la acción para enviar los cambios al backend (dispatch, fetch, etc.)
      await dispatch(updateFamilia(nombreFamilia));
      await dispatch(getOptionsDataM());
      setShowBack(false);
      setShowSuccessMessages('Familia actualizada correctamente')
      setOpenSnack(true);
      setEditMode(null);

      // Reiniciar los estados después de guardar los cambios
      setNombreFamilia({
        nombreF: '',
        idFamilia: 0
      });

    } catch (error) {
      setErrorMe(String(error));
      setErrorSnackOpen(true);
    }
  };

  const handleAgregar = async () => {
    try {
      // Aquí puedes enviar los datos al servidor o realizar otras acciones
      setShowBack(true);
      setLoadingMe('Agregando..');
      const response = await dispatch(addFamilia(nombreFamilia));
      await dispatch(getOptionsDataM())
      setShowBack(false)
      setShowSuccessMessages('Familia creada correctamente')
      setOpenSnack(true);
      // Limpia el formulario o realiza otras acciones necesarias
      setNombreFamilia({
        nombreF: '',
        idFamilia: 0
      });
      // Puedes procesar la respuesta del servidor si es necesario
    } catch (error) {
      // Maneja el error a nivel superior
      setErrorMe(String(error));
      setErrorSnackOpen(true)
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

  // const sortAlphabetically = (array) => {
  //   return array.slice().sort((a, b) => {
  //     // Comprobamos si 'a' y 'b' son objetos válidos y tienen una propiedad 'nombre'
  //     if (a && a.nombre && b && b.nombre) {
  //       const nameA = a.nombre.charAt(0).toUpperCase() + a.nombre.slice(1);
  //       const nameB = b.nombre.charAt(0).toUpperCase() + b.nombre.slice(1);
  //       return nameA.localeCompare(nameB);
  //     }
  //     // Si 'a' o 'b' no tienen la propiedad 'nombre', no hacemos nada
  //     return 0;
  //   });
  // };
  // const sortedFamilias = sortAlphabetically(familias);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnack(false);
  };
  return (
    <div>
      <Grid container spacing={5} sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 56, 28, 0.1)', // Establece el fondo transparente deseado
        backdropFilter: 'blur(2px)', // Efecto de desenfoque de fondo
        width: '90%',
        minWidth: '1200xp',
        margin: '0 auto',
        padding: '40px 40px 30px 40px',
        borderRadius: '20px 20px 20px 20px'
      }} >
        <Grid alignItems="center" container spacing={1} sx={{
          margin: 5,
          backgroundColor: 'rgba(0, 56, 28, 0.1)',
          p: 3,
          borderRadius: '10px',
          mb: 0
        }}>
          <Grid item xs={12} sm={9}>
            <Typography variant='h5' color='primary.light' sx={{ mb: 1 }}>
              Agregar Nueva Familia
              <Divider sx={{ my: 1, borderColor: theme.palette.primary.main, }} />
            </Typography>
          </Grid>
          <Grid item sx={12} md={10}>
            <TextField
              fullWidth
              label="Nombre de Familia"
              value={nombreFamilia.nombreF}
              onChange={(e) => setNombreFamilia({ ...nombreFamilia, nombreF: e.target.value })}
              InputLabelProps={{
                sx: labelStyles,
              }}
              InputProps={{
                sx: inputStyles,
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              sx={{
                mt: -1.5,
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
        <Grid item sx={12} md={12}>
          <Typography variant='h5' color='primary.light' sx={{ mb: 1 }}>
            Lista de Familias
            <Divider sx={{ my: 2, borderColor: theme.palette.primary.main, }} />
          </Typography>
          <TableContainer sx={{ maxHeight: 450 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center" colSpan={2}>Nombre</StyledTableCell>
                  <StyledTableCell align="center" colSpan={2}>Acción</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {familias.map((item, index) => (
                  <StyledTableRow key={item.index}>
                    <TableCell align="center" colSpan={2} style={{ color: 'white' }}>
                      {editMode === index ? (
                        // Modo de edición
                        <>
                          <TextField
                            fullWidth
                            value={nombreFamilia.idFamilia === item.id ? nombreFamilia.nombreF : item.nombre}
                            onChange={(e) => handleEditFamilia(item.id, e.target.value)}
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
                    <TableCell align="center" colSpan={2} style={{ color: theme.palette.primary.light, }}>
                      {editMode === index ? (
                        // Modo de edición
                        <>
                          <Button onClick={saveChanges}
                            sx={{
                              fontSize: '1rem', ml: 2, mt: 0.7, textTransform: 'none',
                            }}
                            variant="contained"
                            color="secondary"
                          >Grabar</Button>
                          <Button onClick={handleCancelEdit}
                            sx={{
                              fontSize: '1rem', ml: 2, mt: 0.7, textTransform: 'none',
                            }}
                            variant="contained"
                            color="error"
                          >Cancelar</Button>
                        </>
                      ) : (
                        <Grid container spacing={0} sx={{ maxHeight: 450 }} >
                          <Grid item xs={12} md={6}>
                            <Button onClick={() => handleEditClick(index, item)}
                              sx={{
                                fontSize: '1rem',
                              }}
                              variant="outlined"
                              color="primary"
                            >Editar</Button>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Button onClick={() => handleDelete(item.id)}
                              color="error"
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
      </Grid>
      {/* Backdrop para mostrar durante la carga */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showBack}
      >
        <>
          <CircularProgress color="inherit" />
          <Typography variant="h5" color="inherit" sx={{ ml: 2 }}>
            {loadingMe}
          </Typography>
        </>

      </Backdrop>

      <Snackbar
        open={openSnack}
        autoHideDuration={5000} // Duración en milisegundos (ajusta según tus preferencias)
        onClose={handleCloseSnackbar}
        message={showSuccessMessages}
      // anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
      </Snackbar>

      {/* Snackbar for error message */}
      <Snackbar
        open={errorSnackOpen}
        autoHideDuration={5000} // Adjust the duration as needed
        onClose={() => setErrorSnackOpen(false)}
      // anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          elevation={6}
          variant="filled"
          severity="error"
          onClose={() => setErrorSnackOpen(false)}
        >
          {errorMe}
        </Alert>
      </Snackbar>
    </div>
  )
};


