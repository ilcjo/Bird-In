import * as React from 'react'
import { getAllCustomizes } from '../../../redux/actions/Custome';
import { useDispatch } from 'react-redux';
import { IndexCustome } from './IndexCustome';
import { Grid, useTheme } from '@mui/material';


export const Customize = () => {
    const theme = useTheme()
    const dispatch = useDispatch();

    React.useEffect(() => {
        // Disparar la acción para obtener todas las configuraciones personalizadas
        dispatch(getAllCustomizes());
    }, [dispatch]); // Asegura que el efecto se ejecute solo una vez al montar el componente

    return (
        <React.Fragment>
            <IndexCustome />
            <Grid container spacing={5} sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '210vh',
                margin: 'auto',
                // backgroundColor: theme.palette.secondary.light,
                padding: '0px 40px 30px 0px',
                borderRadius: '0px 0px 20px 20px'
            }} ></Grid>

        </React.Fragment >

    )
};
