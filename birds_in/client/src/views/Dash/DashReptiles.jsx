import * as React from 'react'
import { Grid, useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
//components
import { IndexD } from '../../components/Dashboard/Reptiles/IndexD'
import { MenuBar } from '../../components/Menus/MenuBar';
import { Loading } from '../../components/utils/Loading';
//icons
//redux
import { getUsers } from '../../redux/settings/actions/userLoginRegister';

export const DashReptiles = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { allCustom } = useSelector((state) => state.customizesSlice);
  // console.log(allCustom)
  const [showBackdrop, setShowBackdrop] = React.useState(false);
  const [loadingMessage, setLoadingMessage] = React.useState('Cargando...');

  React.useEffect(() => {
    // Disparar la acción para obtener todos los usuarios al montar el componente
    dispatch(getUsers('approved'));
  }, [dispatch]);

  return (
    <React.Fragment>
      <MenuBar ShowFilterButton={false} ShowBackButton={true} />
      <Grid
        container
        direction="column"
        alignItems="center"
        sx={{
          background: `url(${allCustom.background_update_reptil}) center/cover no-repeat fixed`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          minHeight: '100vh',
          height: '100%',
          overflow: 'hidden',
          margin: 0,
          
        }}
      >
        <IndexD />
      </Grid>
      <Loading
        message={loadingMessage}
        open={showBackdrop}
      />
    </React.Fragment>
  );
};