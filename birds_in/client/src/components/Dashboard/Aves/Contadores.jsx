import * as React from 'react'
import { Grid, Typography, } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { counting } from '../../../redux/birds/actions/infoAction';

export const Contadores = () => {
    const dispatch = useDispatch()
    const { allBirds, allEnglish, allCientifico, allComun, allGrupos, allFamilias, allZonas, allCountrys } = useSelector(state => state.birdSlice.count)
    React.useEffect(() => {
        dispatch(counting());
    }, []);
    return (
        <div>
            <Grid container spacing={5} sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0, 56, 28, 0.1)', // Establece el fondo transparente deseado
                backdropFilter: 'blur(2px)', // Efecto de desenfoque de fondo
                // width: '80%',
                minWidth: '170vh',
                margin: 'auto',
                padding: '40px 40px 40px 40px',
                borderRadius: '20px 20px 20px 20px'
            }} >
                <Grid item xs={12} sm={6} sx={{ mt: -5, }}>
                    <Typography variant="h2" color="primary" sx={{}}>
                        Total Aves :
                        <Typography variant='h2' color='primary.light' sx={{ display: 'inline', ml: 3, }}>
                            {allBirds}
                        </Typography>
                    </Typography>

                    <Typography variant="h2" color="primary" sx={{ mt: 2 }}>
                        Nombre Inglés:
                        <Typography variant='h2' color='primary.light' sx={{ display: 'inline', ml: 3, }}>
                            {allEnglish}
                        </Typography>
                    </Typography>

                    <Typography variant="h2" color="primary" sx={{ mt: 2 }}>
                        Nombre Científico:
                        <Typography variant='h2' color='primary.light' sx={{ display: 'inline', ml: 3, }}>
                            {allCientifico}
                        </Typography>
                    </Typography>

                    <Typography variant="h2" color="primary" sx={{ mt: 2 }}>
                        Nombre Común:
                        <Typography variant='h2' color='primary.light' sx={{ display: 'inline', ml: 3, }}>
                            {allComun}
                        </Typography>
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6} sx={{ mt: -5, mr: -30 }}>
                    <Typography variant="h2" color="primary" sx={{}}>
                        Número de Grupos :
                        <Typography variant='h2' color='primary.light' sx={{ display: 'inline', ml: 3, }}>
                            {allGrupos}
                        </Typography>
                    </Typography>
                    <Typography variant="h2" color="primary" sx={{ mt: 2 }}>
                        Número de Familias :
                        <Typography variant='h2' color='primary.light' sx={{ display: 'inline', ml: 3, }}>
                            {allFamilias}
                        </Typography>
                    </Typography>
                    <Typography variant="h2" color="primary" sx={{ mt: 2 }}>
                        Número de País :
                        <Typography variant='h2' color='primary.light' sx={{ display: 'inline', ml: 3, }}>
                            {allCountrys}
                        </Typography>
                    </Typography>
                    <Typography variant="h2" color="primary" sx={{ mt: 2 }}>
                        Número de Zonas :
                        <Typography variant='h2' color='primary.light' sx={{ display: 'inline', ml: 3, }}>
                            {allZonas}
                        </Typography>
                    </Typography>
                </Grid>
            </Grid>
        </div>
    )
};
