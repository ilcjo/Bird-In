import * as React from 'react'
import {
  Alert,
  Autocomplete,
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
import { addZona } from '../../../redux/actions/Options';
import { getOptionsData } from '../../../redux/actions/fetchOptions';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.main,
    ...theme.typography.h2,


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
 
  const [nombreGrupos, setNombreGrupos] = React.useState('');

  const [showBackdrop, setShowBackdrop] = React.useState(false);
  const [loadingMessage, setLoadingMessage] = React.useState('Agregando...');
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState(null);

  const handleAgregar = async () => {
    try {
      // Aquí puedes enviar los datos al servidor o realizar otras acciones

      // const response = await dispatch(addZona({ zona: nombreZona, pais: paisSeleccionado.id }));
      setShowBackdrop(true);
      setLoadingMessage('Agregando..');
      setShowBackdrop(false)
      setOpenSnackbar(true);
      // Limpia el formulario o realiza otras acciones necesarias
      setNombreZona('');
      setPaisSeleccionado(null);
      dispatch(getOptionsData())
      // Puedes procesar la respuesta del servidor si es necesario
    } catch (error) {
      // Maneja el error a nivel superior
      setErrorMessage(error);
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
  const sortedGrupos= sortAlphabetically(grupos);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };
  return (
    <div>
      <Grid container spacing={5} sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '80%',
        minWidth: '170vh',
        margin: 'auto',
        // backgroundColor: 'rgba(0, 56, 28, 0.1)', // Establece el fondo transparente deseado
        // backdropFilter: 'blur(2px)', // Efecto de desenfoque de fondo
        padding: '40px 40px 40px 40px',
        borderRadius: '0px 0px 20px 20px'
      }} >
        <Grid item sx={12} md={12}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">GRUPOS</StyledTableCell>
                 
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedGrupos.map((item, index) => (
                  <StyledTableRow key={item.index}>
                    <TableCell align="center" colSpan={3} style={{ color: 'white' }}>{item.nombre}</TableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid container spacing={1} sx={{
          margin: 3,

        }}>

          <Grid item xs={12} md={9}>

            <TextField
              fullWidth
              label="Nombre de Grupo"
              value={nombreGrupos}
              onChange={(e) => setNombreGrupos(e.target.value)}
              InputLabelProps={{
                sx: labelStyles,
              }}
              InputProps={{
                sx: inputStyles,
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
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
        message={'La zona se agrego exitosamente'}
      >
      </Snackbar>

      {/* Snackbar for error message */}
      <Snackbar
        open={errorSnackbarOpen}
        autoHideDuration={5000} // Adjust the duration as needed
        onClose={() => setErrorSnackbarOpen(false)}
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
    </div>
  )
};


