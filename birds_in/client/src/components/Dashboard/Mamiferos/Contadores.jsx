import * as React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { counting } from '../../../redux/mamiferos/actions/infoAction';

export const Contadores = () => {
    const dispatch = useDispatch();
    const { allRegistros, allEnglish, allCientifico, allComun, allGrupos, allFamilias, allZonas, allCountrys } = useSelector(state => state.dataSlice.count);

    React.useEffect(() => {
        dispatch(counting());
    }, [dispatch]);

    const firstHalfData = [
        { label: 'Total Mamíferos', value: allRegistros },
        { label: 'Nombres en Inglés', value: allEnglish },
        { label: 'Nombres Científico(especie)', value: allCientifico },
        { label: 'Nombres Comunes', value: allComun }
    ];

    const secondHalfData = [
        { label: 'Número de Familias', value: allFamilias },
        { label: 'Número de Géneros', value: allGrupos },
        { label: 'Número de Países', value: allCountrys },
        { label: 'Número de Zonas', value: allZonas }
    ];

    const renderTable = (data) => (
        <TableContainer component={Paper} sx={{ 
            backgroundColor: 'rgba(0, 56, 28, 0.1)', 
            backdropFilter: 'blur(4px)', 
            padding: '20px', 
            borderRadius: '20px', 
            maxWidth: '45vw', 
            margin: '10px'
        }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <Typography variant="h5" color="primary.light">Categoría</Typography>
                        </TableCell>
                        <TableCell>
                            <Typography variant="h5" color="primary.light">Cantidad</Typography>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                <Typography variant="h2" color="primary">{row.label}</Typography>
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
                                <Typography variant="body1" color="primary.light">{row.value}</Typography>
                            </TableCell>
                        </TableRow>
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
