import * as React from 'react'
import {
    Backdrop,
    Button,
    Checkbox,
    CircularProgress,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    Typography,
    useTheme
} from '@mui/material';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { getInfoForUpdate } from '../../redux/actions/createBirds';


export const SearchBird = ({ changeTab, isEnable }) => {
    const theme = useTheme();
    const dispatch= useDispatch()
    const [showBackdrop, setShowBackdrop] = React.useState(true);
    const [tableData, setTableData] = React.useState([]);
    const [orderBy, setOrderBy] = React.useState('englishName'); // Columna inicial de orden
    const [order, setOrder] = React.useState('asc');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [selectedBird, setSelectedBird] = React.useState(null);


    const isSelected = (birdId) => {
        return selectedBird === birdId;
    };

    const handleCheckboxClick = (event, birdId) => {
        if (event.target.checked) {
            setSelectedBird(birdId);
        } else {
            setSelectedBird(null);
        }
    };

    const handleBirdSelect = (id) => {
        dispatch(getInfoForUpdate(id));
        changeTab(2);  
    };

    const handleSort = (property) => (event) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
        setSelectedBird(null);
        const sortedData = tableData.slice().sort((a, b) => {
            if (a[property] && b[property]) {
                if (isAsc) {
                    return a[property].localeCompare(b[property]);
                } else {
                    return b[property].localeCompare(a[property]);
                }
            } else {
                // Manejar el caso en que uno o ambos valores sean undefined
                return 0; // No se realiza un cambio en el orden
            }
        });
        setTableData(sortedData);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        setSelectedBird(null);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/aves/filtros?page=0&perPage=0');
                const data = response.data;
                const validData = data.filter((item) => item.nombre_ingles);

                // Ordenar los datos válidos por "Nombre en Inglés" (englishName)
                validData.sort((a, b) => a.nombre_ingles.localeCompare(b.nombre_ingles));
                localStorage.setItem('birdsData', JSON.stringify(validData));
                setTableData(validData);
                setShowBackdrop(false);
            } catch (error) {
                console.error("Error al obtener los datos:", error);
            }
        };

        fetchData();
    }, []);


    const columnNames = [
        { label: 'Nombre en Inglés', property: 'englishName' },

    ];

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, tableData.length - page * rowsPerPage);

    return (
        <React.Fragment>
            <Backdrop
                open={showBackdrop}
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    color: '#fff',
                }}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Grid container direction="column" alignItems="center">
                <Grid item sx={{ my: 2 }}>
                    <Typography variant="h2" color="primary">
                        Buscar Ave
                    </Typography>
                </Grid>
                <Grid item>
                    <Paper>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        {columnNames.map((column) => (
                                            <TableCell key={column.property}>
                                                <TableSortLabel
                                                    active={orderBy === 'nombre_ingles'}
                                                    direction={orderBy === 'nombre_ingles' ? order : 'asc'}
                                                    onClick={handleSort('nombre_ingles')}
                                                >
                                                    {column.label}
                                                </TableSortLabel>
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tableData
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row) => (
                                            <TableRow key={row.id_ave}>
                                                <TableCell>
                                                    <Checkbox
                                                        checked={isSelected(row.id_ave)}
                                                        onChange={(event) => handleCheckboxClick(event, row.id_ave)}
                                                    />
                                                </TableCell>
                                                <TableCell>{row.nombre_ingles}</TableCell>
                                                {isSelected(row.id_ave) && (
                                                    <TableCell>
                                                        <Button
                                                            variant="outlined"
                                                            color="primary"
                                                            onClick={() => handleBirdSelect(row.id_ave)}
                                                        >
                                                            Actualizar
                                                        </Button>
                                                    </TableCell>
                                                )}
                                            </TableRow>
                                        ))}
                                    {emptyRows > 0 && (
                                        <TableRow style={{ height: 53 * emptyRows }}>
                                            <TableCell colSpan={3} />
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={tableData.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Paper>
                </Grid>
            </Grid>
        </React.Fragment>
    );
};