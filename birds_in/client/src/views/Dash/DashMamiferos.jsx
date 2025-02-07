import * as React from 'react'
import { Fab, Grid, useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
//components
import { IndexD } from '../../components/Dashboard/Mamiferos/IndexD'
import { MenuBar } from '../../components/Menus/MenuBar';
import { Loading } from '../../components/utils/Loading';
//icons
import DownloadIcon from '@mui/icons-material/Download';
//redux
import { getUsers } from '../../redux/settings/actions/userLoginRegister';
import { getExcel } from '../../redux/mamiferos/actions/crudAction';

export const DashMamiferos = () => {
  const dispatch = useDispatch();
  const { allCustom } = useSelector((state) => state.customizesSlice);
  // console.log(allCustom)
  React.useEffect(() => {
    // Disparar la acción para obtener todos los usuarios al montar el componente
    dispatch(getUsers('approved'));
  }, [dispatch]);

  return (
    <React.Fragment>
      <Grid
        container
        direction="column"
        alignItems="center"
        sx={{
          background: `url(${allCustom.background_update_mamifero}) center/cover no-repeat fixed`,
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
    </React.Fragment>
  );
};