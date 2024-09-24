import * as React from 'react'
import {
  Autocomplete,
  Button,
  Divider,
  Grid,
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
import { addZona, eliminarZona, updateZona } from '../../../redux/settings/actions/CrudZonaPais';
import { getOptionsData } from '../../../redux/birds/actions/fetchOptions';
//redux


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

export const ZonasOptions = ({
  onloading
  , loadingMessage
  , showSnackBar
  , successMessages
  , errorMessage
  , showErrorSnack
}) => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const { zonas, paisesAll } = useSelector(state => state.filterSlice.options)
  // const [page, setPage] = React.useState(0);
  // const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [nombreZona, setNombreZona] = React.useState('');
  const [paisSeleccionado, setPaisSeleccionado] = React.useState(null);
  const [editMode, setEditMode] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState('');
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

  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar esta zona?')) {
      try {
        onloading(true)
        loadingMessage('Eliminando Zona...')
        // Lógica para eliminar el elemento
        await dispatch(eliminarZona(id))
        await dispatch(getOptionsData())
        onloading(false)
        successMessages('Zona Eliminada Exitosamente')
        showSnackBar(true);
      } catch (error) {
        errorMessage(String(error));
        showErrorSnack(true);
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
    setSelectedPaisId(newValue || null);
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
      onloading(true)
      loadingMessage('Actualizando Zona...');
      // Define los valores a enviar, inicialmente con los valores existentes
      const valuesToUpdate =
      {
        idZona: editingZonaId,
        zona: newZonaName.zona !== null ? newZonaName.zona : null, // Si no se cambió el nombre, envía null
        paisId: selectedPaisId ? selectedPaisId.id : 0, // Si no se cambió el país, envía 0
      };
      // Realiza la acción para enviar los cambios al backend (dispatch, fetch, etc.)
      await dispatch(updateZona(valuesToUpdate));
      await dispatch(getOptionsData());
      onloading(false)
      successMessages('Zona actualizada correctamente')
      showSnackBar(true);
      setEditMode(null);
      // Reiniciar los estados después de guardar los cambios
      setSelectedPaisId(null);
      setNewZonaName('');

    } catch (error) {
      console.log(error);
      errorMessage(String(error));
      showErrorSnack(true);
    }
  };

  const handleAgregar = async () => {
    if (!nombreZona || !paisSeleccionado) {
      // Si alguno de los campos está vacío, muestra una notificación de error
      showErrorSnack(true);
      errorMessage('Los campos Pais y Zona no deben estar vacíos.');
      showErrorSnack(true);
      return;
    }
    try {
      showErrorSnack(false)
      onloading(true)
      loadingMessage('Agregando Zona..')
      // Aquí puedes enviar los datos al servidor o realizar otras acciones
      const response = await dispatch(addZona({ zona: nombreZona, pais: paisSeleccionado.id }));
      await dispatch(getOptionsData())
      onloading(false)
      showSnackBar(true);
      loadingMessage('Agregando..');
      showSnackBar(false)
      successMessages('Zona creada correctamente')
      showSnackBar(true);
      // Limpia el formulario o realiza otras acciones necesarias
      setNombreZona('');
      setPaisSeleccionado(null);
      // Puedes procesar la respuesta del servidor si es necesario
    } catch (error) {
      // Maneja el error a nivel superior
      errorMessage(String(error));
      showErrorSnack(true)
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredZonas = zonas.filter((item) => {
    // Normaliza los espacios y convierte a minúsculas
    const normalizedItemName = item.nombre.toLowerCase().replace(/\s+/g, ' ').trim();
    const normalizedSearchTerm = searchTerm.toLowerCase().replace(/\s+/g, ' ').trim();

    return normalizedItemName.includes(normalizedSearchTerm);
  });


  return (
    <React.Fragment>
      <Grid container spacing={5} sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '90%',
        minWidth: '1200xp',
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
              // error={!nombreZona && errorMessage}
              // helperText={!nombreZona ? 'Este campo es obligatorio' : ''}
            />
          </Grid>

          <Grid item xs={12} md={5}>
            <Autocomplete
              disablePortal
              id="combo-box-paises"
              options={paisesAll}
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
                  // error={!paisSeleccionado && errorMessage}
                  // helperText={!paisSeleccionado ? 'Este campo es obligatorio' : ''}
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
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Buscar"
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{
              mb: 2,
              backgroundColor: 'rgba(204,214,204,0.17)',
              borderRadius: '9px',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'none',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.main,
              },
            }}
          />
          <TableContainer sx={{ maxHeight: 450 }}>

            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center" colSpan={2}>Zona</StyledTableCell>
                  <StyledTableCell align="center" colSpan={2}>Pais</StyledTableCell>
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
                {filteredZonas.map((item, index) => (
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
                          options={paisesAll}
                          getOptionLabel={(option) => option.nombre}
                          value={selectedPaisId ? selectedPaisId : paisesAll.find((p) => p.nombre === item.nombre_pais) || null}
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
                        <Grid container sx={{ maxHeight: 450, minWidth: 450 }} >
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
    </React.Fragment>
  )
};


