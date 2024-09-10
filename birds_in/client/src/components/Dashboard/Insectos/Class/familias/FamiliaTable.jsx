import * as React from 'react'
import {
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
import SaveIcon from '@mui/icons-material/Save';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
//redux
import { eliminarFamilia, updateFamilia } from '../../../../../redux/insectos/actions/CrudClass';
import { getOptionsDataI } from '../../../../../redux/insectos/actions/fetchOptions';

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

export const FamiliaTable = ({
    onloading
    , loadingMessage
    , showSnackBar
    , successMessages
    , errorMessage
    , showErrorSnack
}) => {
    const theme = useTheme()
    const dispatch = useDispatch()
    const { familias } = useSelector(state => state.filter.options)

    const [nombreFamilia, setNombreFamilia] = React.useState({
        nombreF: '',
        idFamilia: 0
    });
    const [editMode, setEditMode] = React.useState(null);
    const [searchTerm, setSearchTerm] = React.useState('');

    // Filtrar familias basado en el término de búsqueda
    const filteredFamilias = familias.filter(familia =>
        familia.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                onloading(true)
                loadingMessage('Eliminado Familia...')
                await dispatch(eliminarFamilia(id))
                await dispatch(getOptionsDataI())
                onloading(false)
                successMessages('Familia eliminada')
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
    };

    const handleCancelEdit = () => {
        // Cancela el modo de edición
        setEditMode(null);
    };

    // Función para guardar los cambios en una zona
    const saveChanges = async () => {
        try {
            onloading(true);
            loadingMessage('Actualizando...');
            await dispatch(updateFamilia(nombreFamilia));
            await dispatch(getOptionsDataI());
            onloading(false);
            successMessages('Familia actualizada correctamente')
            showSnackBar(true);
            setEditMode(null);

            // Reiniciar los estados después de guardar los cambios
            setNombreFamilia({
                nombreF: '',
                idFamilia: 0
            });
        } catch (error) {
            errorMessage(String(error));
            showErrorSnack(true);
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

    return (
        <div>
            <Grid item sx={12} md={12}>
                <Typography variant='h5' color='primary.light' sx={{ mb: 1, mt: 5 }}>
                    Lista de Familias
                    <Divider sx={{ my: 2, borderColor: theme.palette.primary.main, }} />
                </Typography>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Buscar Familias..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
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
                <TableContainer sx={{ maxHeight: 450, borderRadius: 3 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align="center" colSpan={2}>Nombre</StyledTableCell>
                                <StyledTableCell align="center" colSpan={2}>Acción</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredFamilias.map((item, index) => (
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
                                                    endIcon={<SaveIcon />}
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
        </div>
    )
}
