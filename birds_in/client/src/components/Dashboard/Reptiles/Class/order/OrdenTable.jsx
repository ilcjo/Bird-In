import * as React from 'react';
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
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useDispatch, useSelector } from 'react-redux';
import { eliminarOrden, updateOrden } from '../../../../../redux/reptiles/actions/CrudClass';
import { getOptionsDataR } from '../../../../../redux/reptiles/actions/fetchOptions';

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
        backgroundColor: 'rgba(0, 56, 28, 0.3)',
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

export const OrdenTable = ({
    onloading,
    loadingMessage,
    showSnackBar,
    successMessages,
    errorMessage,
    showErrorSnack
}) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { orden } = useSelector(state => state.filterRep.options);
    console.log(orden, 'orden;')
    const [nombreGrupos, setNombreGrupos] = React.useState({
        nombreG: '',
        nombreC: '',
        idGrupo: 0
    });
    const [editMode, setEditMode] = React.useState(null);
    const [searchTerm, setSearchTerm] = React.useState('');


    const handleEditGrupo = (id, field, newValue) => {
        setNombreGrupos((prevValues) => ({
            ...prevValues,
            idGrupo: id,
            [field]: newValue, // Solo cambia el campo específico
        }));
    };


    const handleDelete = async (id) => {
        if (window.confirm('¿Seguro que deseas eliminar este Order?')) {
            try {
                onloading(true);
                loadingMessage('Eliminando Order...');
                await dispatch(eliminarOrden(id));
                await dispatch(getOptionsDataR());
                onloading(false);
                successMessages('Order Eliminado');
                showSnackBar(true);
            } catch (error) {
                errorMessage(String(error));
                showErrorSnack(true);
            }
        }
    };

    const handleEditClick = (grupo) => {
        setEditMode(grupo.id); // Usa el ID en lugar del índice
        setNombreGrupos({
            nombreG: grupo.nombre,
            nombreC: grupo.order_comun,
            idGrupo: grupo.id
        });
    };

    const handleCancelEdit = () => {
        setEditMode(null);
    };

    const saveChanges = async () => {
        try {
            onloading(true);
            loadingMessage('Actualizando...');
            await dispatch(updateOrden(nombreGrupos));
            await dispatch(getOptionsDataR());
            onloading(false);
            successMessages('Order actualizado correctamente');
            showSnackBar(true);
            setEditMode(null);
            setNombreGrupos({
                nombreG: '',
                nombreC: '',
                idGrupo: 0
            });
        } catch (error) {
            console.log(error);
            errorMessage(String(error));
            showErrorSnack(true);
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const filteredGrupos = orden.filter((item) =>
        item.nombre.toLowerCase().includes(searchTerm) ||
        item.order_comun.toLowerCase().includes(searchTerm)
    );

    const labelStyles = {
        color: theme.palette.primary.main,
        marginTop: '-10px',
    };

    const inputStyles = {
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
            borderColor: theme.palette.primary.main,
            backgroundColor: 'rgba(0,56,28,0.22)',
        },
    };

    return (
        <div>
            <Grid item sx={12} md={12}>
                <Typography variant='h2' color='primary.light' sx={{ mb: 1, mt: 5 }}>
                    Lista de Ordens
                    <Divider sx={{ my: 1.5, borderColor: theme.palette.primary.main }} />
                </Typography>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Buscar Orden ó Order..."
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
                <TableContainer sx={{ maxHeight: 450, borderRadius: 3 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align="center" colSpan={2}>Orden</StyledTableCell>
                                <StyledTableCell align="center">Order</StyledTableCell>
                                <StyledTableCell align="center" colSpan={2}>Acción</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredGrupos.map((item, index) => (
                                <StyledTableRow key={item.index}>
                                    <TableCell align="center" colSpan={2} style={{ color: 'white' }}>
                                        {editMode === item.id ? (
                                            <TextField
                                                fullWidth
                                                value={nombreGrupos.nombreG}
                                                onChange={(e) => handleEditGrupo(item.id, "nombreG", e.target.value)}
                                                InputLabelProps={{ sx: labelStyles }}
                                                InputProps={{ sx: inputStyles }}
                                            />
                                        ) : (
                                            item.nombre
                                        )}
                                    </TableCell>

                                    <TableCell align="center" style={{ color: 'white' }}>
                                        {editMode === item.id ? (
                                            <TextField
                                                fullWidth
                                                value={nombreGrupos.nombreC}
                                                onChange={(e) => handleEditGrupo(item.id, "nombreC", e.target.value)}
                                                InputLabelProps={{ sx: labelStyles }}
                                                InputProps={{ sx: inputStyles }}
                                            />
                                        ) : (
                                            item.order_comun
                                        )}
                                    </TableCell>

                                    <TableCell align="center" colSpan={2} style={{ color: theme.palette.primary.light }}>
                                        {editMode === item.id ? (
                                            <>
                                                <Button
                                                    onClick={handleCancelEdit}
                                                    sx={{
                                                        fontSize: '1rem',
                                                        ml: 2,
                                                        mt: 0.7,
                                                        textTransform: 'none',
                                                    }}
                                                    variant="contained"
                                                    color="error"
                                                >
                                                    Cancelar
                                                </Button>
                                                <Button
                                                    onClick={saveChanges}
                                                    sx={{
                                                        fontSize: '1rem',
                                                        ml: 2,
                                                        mt: 0.7,
                                                        textTransform: 'none',
                                                    }}
                                                    variant="contained"
                                                    color="secondary"
                                                    endIcon={<SaveIcon />}
                                                >
                                                    Grabar
                                                </Button>

                                            </>
                                        ) : (
                                            <Grid container sx={{ maxHeight: 450 }}>
                                                <Grid item xs={12} md={6}>
                                                    <Button
                                                        onClick={() => handleEditClick(item)}
                                                        sx={{ fontSize: '1rem' }}
                                                        variant="contained"
                                                        color="primary"
                                                    >
                                                        Editar
                                                    </Button>
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <Button
                                                        onClick={() => handleDelete(item.id)}
                                                        color="error"
                                                        startIcon={<DeleteForeverIcon />}
                                                    />
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
    );
};
