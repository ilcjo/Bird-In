import * as React from 'react'
import {
  Alert,
  Autocomplete,
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
  TablePagination,
  TableRow,
  TextField,
  Typography,
  styled,
  tableCellClasses,
  useTheme
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useDispatch, useSelector } from 'react-redux';
import { addZona, eliminarZona, updateZona } from '../../../redux/actions/Options';
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
    backgroundColor: 'rgba(0, 56, 28, 0.4)', // Establece el fondo transparente deseado
    // backdropFilter: 'blur(120px)', // Efecto de desenfoque de fondo
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export const ZonasOptions = () => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const { zonas, paises } = useSelector(state => state.birdSlice.options)
  // const [page, setPage] = React.useState(0);
  // const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [nombreZona, setNombreZona] = React.useState('');
  const [paisSeleccionado, setPaisSeleccionado] = React.useState(null);
  const [showBackdrop, setShowBackdrop] = React.useState(false);
  const [loadingMessage, setLoadingMessage] = React.useState('Agregando...');
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState(null);
  const [showErrorMessages, setShowErrorMessages] = React.useState(false);
  const [showSuccessMessages, setShowSuccessMessages] = React.useState('');
  const [editMode, setEditMode] = React.useState(null);
  // Estados para rastrear la selección de país, la zona que se edita y el nuevo nombre
  const [selectedPaisId, setSelectedPaisId] = React.useState(null);
  const [editingZonaId, setEditingZonaId] = React.useState(null);
  const [newZonaName, setNewZonaName] = React.useState({
    idZona: 0,
    zona: ''
  });
  // console.log('soy pais selected', selectedPaisId)
  // console.log('soy zona editada', newZonaName)
  // console.log('soy zona id', editingZonaId)

  const handleDelete = (id) => {
    if (window.confirm('¿Seguro que deseas eliminar esta zona?')) {
      try {
        // Lógica para eliminar el elemento
        dispatch(eliminarZona(id))
        setShowSuccessMessages('Zona eliminada')
        setOpenSnackbar(true);
        dispatch(getOptionsData())

      } catch (error) {
        setErrorMessage(String(error));
        setErrorSnackbarOpen(true);
      }
    }
  };
  const handleEditClick = (index, zona) => {
    // Habilita el modo de edición para la fila correspondiente al índice 'index'
    setEditMode(index);
    setEditingZonaId(zona.id);
  };

  const handleCancelEdit = () => {
    // Cancela el modo de edición
    setEditMode(null);
  };

  // Función para manejar la selección de un país en Autocomplete
  const handlePaisSelection = (event, newValue) => {
    if (newValue) {
      setSelectedPaisId(newValue);
    }
  };

  // Función para manejar la edición de una zona
  const handleEditZona = (index, newValue) => {
    setNewZonaName((prevValues) => ({
      ...prevValues,
      idZona: index, // Asigna el valor de item.id al idZona
      zona: newValue, // Asigna el nuevo valor al campo zona
    }));
  };

  // Función para guardar los cambios en una zona
  const saveChanges = async () => {
    try {

      // Define los valores a enviar, inicialmente con los valores existentes
      const valuesToUpdate =
      {
        idZona: editingZonaId,
        zona: newZonaName.zona !== null ? newZonaName.zona : null, // Si no se cambió el nombre, envía null
        paisId: selectedPaisId ? selectedPaisId.id : 0, // Si no se cambió el país, envía 0
      };

      // Realiza la acción para enviar los cambios al backend (dispatch, fetch, etc.)
      await dispatch(updateZona(valuesToUpdate));
      setShowBackdrop(true);
      setLoadingMessage('Actualizando...');
      setShowBackdrop(false);
      setShowSuccessMessages('Zona actualizada correctamente')
      setOpenSnackbar(true);
      dispatch(getOptionsData());
      setEditMode(null);

      // Reiniciar los estados después de guardar los cambios
      setSelectedPaisId(null);
      setNewZonaName('');

    } catch (error) {
      console.log(error);
      setErrorMessage(String(error));
      setErrorSnackbarOpen(true);
    }
  };



  const handleAgregar = async () => {
    if (!nombreZona || !paisSeleccionado) {
      // Si alguno de los campos está vacío, muestra una notificación de error
      setErrorSnackbarOpen(true);
      setErrorMessage('Por favor, completa todos los campos.');
      setShowErrorMessages(true);
      return;
    }
    try {
      // Aquí puedes enviar los datos al servidor o realizar otras acciones
      setShowErrorMessages(false)
      const response = await dispatch(addZona({ zona: nombreZona, pais: paisSeleccionado.id }));
      setShowBackdrop(true);
      setLoadingMessage('Agregando..');
      setShowBackdrop(false)
      setShowSuccessMessages('Zona creada correctamente')
      setOpenSnackbar(true);
      // Limpia el formulario o realiza otras acciones necesarias
      setNombreZona('');
      setPaisSeleccionado(null);
      dispatch(getOptionsData())
      // Puedes procesar la respuesta del servidor si es necesario
    } catch (error) {
      // Maneja el error a nivel superior
      setErrorMessage(String(error));
      setErrorSnackbarOpen(true)
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
  const sortedZonas = sortAlphabetically(zonas);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
    setShowSuccessMessages('')
  };
  return (
    <React.Fragment>
      <Grid container spacing={5} sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '90%',
        minWidth: '1200x',
        margin: '0 auto',
        backgroundColor: 'rgba(0, 56, 28, 0.1)', // Establece el fondo transparente deseado
        backdropFilter: 'blur(2px)', // Efecto de desenfoque de fondo
        padding: '0px 40px 30px 0px',
        borderRadius: '20px 20px 20px 20px',
        mb: 10,
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
              Agregar Nueva Zona
              <Divider sx={{ my: 1, borderColor: theme.palette.primary.main, }} />
            </Typography>
          </Grid>
          <Grid item xs={12} md={5} >

            <TextField
              fullWidth
              label="Nombre de Zona"
              value={nombreZona}
              onChange={(e) => setNombreZona(e.target.value)}
              InputLabelProps={{
                sx: labelStyles,
              }}
              InputProps={{
                sx: inputStyles,
              }}
              error={showErrorMessages && !nombreZona}
              helperText={showErrorMessages && !nombreZona ? 'Este campo es obligatorio' : ''}
            />
          </Grid>

          <Grid item xs={12} md={5}>
            <Autocomplete
              disablePortal
              id="combo-box-paises"
              options={paises}
              getOptionLabel={(option) => option.nombre}
              value={paisSeleccionado}
              onChange={(event, newValue) => setPaisSeleccionado(newValue)}
              renderInput={(params) =>
                <TextField {...params}
                  label="País"
                  InputLabelProps={{
                    sx: labelStyles,
                  }}
                  InputProps={{
                    ...params.InputProps,
                    sx: inputStyles,
                  }}
                  error={showErrorMessages && !paisSeleccionado}
                  helperText={showErrorMessages && !paisSeleccionado ? 'Este campo es obligatorio' : ''}
                />}
              isOptionEqualToValue={(option, value) => option.nombre === value?.nombre}
              filterOptions={(options, state) => {
                // Filtra las opciones para que coincidan solo al principio de las letras
                const inputValue = state.inputValue.toLowerCase();
                return options.filter((option) =>
                  option.nombre.toLowerCase().startsWith(inputValue)
                );
              }}
            />
          </Grid>
          <Grid item xs={12} md={1}>
            <Button
              sx={{
                mt: -1.5,
              }}
              variant="contained"
              color="secondary"
              startIcon={<AddIcon />}
              onClick={handleAgregar}
            >
              Agregar
            </Button>
          </Grid>
        </Grid>

        <Grid item sx={12} md={12}>
          <Typography variant='h5' color='primary.light' sx={{ mb: 1 }}>
            Lista Zonas - Países
            <Divider sx={{ my: 2, borderColor: theme.palette.primary.main, }} />
          </Typography>
          <TableContainer sx={{ maxHeight: 450 }}>

            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center" colSpan={2}>ZONA</StyledTableCell>
                  <StyledTableCell align="center" colSpan={2}>PAÍS</StyledTableCell>
                  <StyledTableCell align="center" colSpan={2}>Acción</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* {zonas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                  <TableRow key={item.index}>
                    <TableCell align="center" colSpan={3}>{item.nombre}</TableCell>
                    <TableCell align="center" colSpan={2}>{item.nombre_pais}</TableCell>
                  </TableRow>
                ))} */}
                {zonas.map((item, index) => (
                  <StyledTableRow key={index}>
                    <TableCell align="center" colSpan={2} style={{ color: 'white', }}>
                      {editMode === index ? (
                        // Modo de edición
                        <>
                          <TextField
                            fullWidth
                            value={newZonaName.idZona === item.id ? newZonaName.zona : item.nombre}
                            onChange={(e) => handleEditZona(item.id, e.target.value)}
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
                        <Autocomplete
                          disablePortal
                          options={paises}
                          getOptionLabel={(option) => option.nombre}
                          value={selectedPaisId ? selectedPaisId : paises.find((p) => p.nombre === item.nombre_pais) || null}
                          onChange={handlePaisSelection}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              InputProps={{
                                ...params.InputProps,
                                sx: inputStyles,
                              }}
                              isOptionEqualToValue={(option, value) => option.id === value?.id}
                            />
                          )}
                        />
                      ) : (
                        // Modo de visualización
                        item.nombre_pais
                      )}

                    </TableCell>
                    <TableCell align="center" colSpan={2}>
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
                        <Grid container >
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
          {/* <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={zonas.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          /> */}
        </Grid>

      </Grid>
      {/* Backdrop para mostrar durante la carga */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showBackdrop}
      >
        <>
          <CircularProgress color="inherit" />
          <Typography variant="h5" color="inherit" sx={{ ml: 2 }}>
            {loadingMessage}
          </Typography>
        </>

      </Backdrop>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000} // Duración en milisegundos (ajusta según tus preferencias)
        onClose={handleCloseSnackbar}
        message={showSuccessMessages}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
      </Snackbar>
      {/* Snackbar for error message */}
      <Snackbar
        open={errorSnackbarOpen}
        autoHideDuration={5000} // Adjust the duration as needed
        onClose={() => setErrorSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <Alert
          elevation={6}
          variant="filled"
          severity="error"
          onClose={() => setErrorSnackbarOpen(false)}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </React.Fragment>
  )
};


