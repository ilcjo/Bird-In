import * as React from 'react'
import { Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
//components
import { IndexDP } from '../../components/Dashboard/Paisajes/IndexDP';
//redux
import { getUsers } from '../../redux/settings/actions/userLoginRegister';

export const DashPaisajes = () => {
  const dispatch = useDispatch()
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
          background: `url(${allCustom.background_paisaje}) center/cover no-repeat fixed`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          minHeight: '100vh',
          height: '100%',
          overflow: 'hidden',
          margin: '0 auto',
        }}
      >
        <IndexDP />
      </Grid>
    </React.Fragment>
  )
}
