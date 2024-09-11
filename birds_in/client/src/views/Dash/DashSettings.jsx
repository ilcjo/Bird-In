import * as React from 'react'
import { Grid, useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers } from '../../redux/settings/actions/userLoginRegister';
import { IndexSet } from '../../components/Dashboard/Settings/IndexSet';

export const DashSettings = () => {
    const dispatch = useDispatch()
    const theme = useTheme()
    const { allCustom } = useSelector((state) => state.customizesSlice);

    React.useEffect(() => {
        // Disparar la acción para obtener todos los usuarios al montar el componente
        dispatch(getUsers('approved'));
    }, []);

    return (
        <React.Fragment>
            <Grid
                container
                direction="column"
                alignItems="center"
                sx={{
                    background: `url(${allCustom.background_mantenimiento}) center/cover no-repeat fixed`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    minHeight: '100vh',
                    height: '100%',
                    overflow: 'hidden',
                    margin: 0,
                }}
            >
                <IndexSet />
            </Grid>
        </React.Fragment>
    )
};
