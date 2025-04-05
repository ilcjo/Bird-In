import * as React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, Grid, styled, tableCellClasses } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { counting } from '../../../redux/mamiferos/actions/infoAction';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.primary.main,
        ...theme.typography.h4,
        borderRadius: 3
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

export const Contadores = () => {
    const dispatch = useDispatch();
    const { allRegistros, allEnglish, allCientifico, allComun, allOrders, allFamilias, allGrupos, allZonas, allCountrys } = useSelector(state => state.dataSlice.count);

    React.useEffect(() => {
        dispatch(counting());
    }, [dispatch]);

    const firstHalfData = [
        { label: 'Total Mamíferos', value: allRegistros },
        { label: 'Nombres en Inglés', value: allEnglish },
        { label: 'Nombres Científico', value: allCientifico },
        { label: 'Nombres Comunes', value: allComun }
    ];

    const secondHalfData = [
        { label: 'Número de Ordens', value: allOrders },
        { label: 'Número de Familias', value: allFamilias },
        { label: 'Número de Grupos', value: allGrupos },
        { label: 'Número de Países', value: allCountrys },
        { label: 'Número de Zonas', value: allZonas }
    ];

    const renderTable = (data) => (
        <TableContainer component={Paper} sx={{
            backgroundColor: 'rgba(0, 56, 28, 0.1)',
            backdropFilter: 'blur(3px)',
            padding: '20px',
            margin: '0px',
            width: '40vw',
            borderRadius: 3,
        }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <StyledTableCell align="center" >Categoría</StyledTableCell>
                        <StyledTableCell align="center" >Total</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row, index) => (
                        <StyledTableRow key={index}>
                            <TableCell>
                                <Typography variant="h4" color="primary">{row.label}</Typography>
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
                                <Typography variant="h4" color="primary.light">{row.value}</Typography>
                            </TableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );

    return (
        <Grid container justifyContent="center" spacing={2}>
            <Grid item xs={12} md={6}>
                {renderTable(firstHalfData)}
            </Grid>
            <Grid item xs={12} md={6}>
                {renderTable(secondHalfData)}
            </Grid>
        </Grid>
    );
};
