import * as React from 'react'
import { Grid, useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { MenuBar } from '../../components/Menus/MenuBar';
import { getUsers } from '../../redux/actions/userLoginRegister';
import { IndexDP } from '../../components/Dashboard/Paisajes/IndexDP';

export const DashPaisajes = () => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const { allCustom } = useSelector((state) => state.customizesSlice);

  React.useEffect(() => {
    // Disparar la acción para obtener todos los usuarios al montar el componente
    dispatch(getUsers('approved'));
  }, []);

  return (
    <React.Fragment>
      <MenuBar ShowFilterButton={false} ShowBackButton={true} />
      <Grid
        container
        direction="column"
        alignItems="center"
        sx={{

          background: `url(${allCustom.header}) center/cover no-repeat fixed`,
          backgroundColor: theme.palette.secondary.light,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          minHeight: '90vh',

        }}
      >
        <IndexDP />
      </Grid>

    </React.Fragment>
  )
}
