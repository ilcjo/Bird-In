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
import { eliminarGrupo, updateGrupo } from '../../../../../redux/birds/actions/CrudClass';
import { getOptionsData } from '../../../../../redux/birds/actions/fetchOptions';

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

export const GrupoTable = ({
    onloading,
    loadingMessage,
    showSnackBar,
    successMessages,
    errorMessage,
    showErrorSnack
}) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { grupos } = useSelector(state => state.filterSlice.options);

    const [nombreGrupos, setNombreGrupos] = React.useState({
        nombreG: '',
        idGrupo: 0
    });
    const [editMode, setEditMode] = React.useState(null);
    const [searchTerm, setSearchTerm] = React.useState('');

    const handleEditGrupo = (index, newValue) => {
        setNombreGrupos((prevValues) => ({
            ...prevValues,
            nombreG: newValue,
            idGrupo: index,
        }));
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Seguro que deseas eliminar este Grupo?')) {
            try {
                onloading(true);
                loadingMessage('Eliminando Grupo...');
                await dispatch(eliminarGrupo(id));
                await dispatch(getOptionsData());
                onloading(false);
                successMessages('Grupo eliminado');
                showSnackBar(true);
            } catch (error) {
                errorMessage(String(error));
                showErrorSnack(true);
            }
        }
    };

    const handleEditClick = (index) => {
        setEditMode(index);
    };

    const handleCancelEdit = () => {
        setEditMode(null);
    };

    const saveChanges = async () => {
        try {
            onloading(true);
            loadingMessage('Actualizando...');
            await dispatch(updateGrupo(nombreGrupos));
            await dispatch(getOptionsData());
            onloading(false);
            successMessages('Grupo actualizado correctamente');
            showSnackBar(true);
            setEditMode(null);
            setNombreGrupos({
                nombreG: '',
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

    const filteredGrupos = grupos.filter((item) =>
        item.nombre.toLowerCase().includes(searchTerm)
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
                <Typography variant='h5' color='primary.light' sx={{ mb: 1, mt: 5 }}>
                    Lista de Grupos
                    <Divider sx={{ my: 2, borderColor: theme.palette.primary.main }} />
                </Typography>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Buscar Grupos..."
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
                                <StyledTableCell align="center" colSpan={2}>Nombre</StyledTableCell>
                                <StyledTableCell align="center" colSpan={2}>Acción</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredGrupos.map((item, index) => (
                                <StyledTableRow key={item.index}>
                                    <TableCell align="center" colSpan={2} style={{ color: 'white' }}>
                                        {editMode === index ? (
                                            <TextField
                                                fullWidth
                                                value={nombreGrupos.idGrupo === item.id ? nombreGrupos.nombreG : item.nombre}
                                                onChange={(e) => handleEditGrupo(item.id, e.target.value)}
                                                InputLabelProps={{ sx: labelStyles }}
                                                InputProps={{ sx: inputStyles }}
                                            />
                                        ) : (
                                            item.nombre
                                        )}
                                    </TableCell>
                                    <TableCell align="center" colSpan={2} style={{ color: theme.palette.primary.light }}>
                                        {editMode === index ? (
                                            <>
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
                                            </>
                                        ) : (
                                            <Grid container sx={{ maxHeight: 450 }}>
                                                <Grid item xs={12} md={6}>
                                                    <Button
                                                        onClick={() => handleEditClick(index)}
                                                        sx={{ fontSize: '1rem' }}
                                                        variant="outlined"
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
