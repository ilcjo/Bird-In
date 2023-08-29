import * as React from 'react'
import { Header } from '../../components/Header'
import { Menu } from '../../components/Menus/Menu'
import { Cards } from '../../components/Cards/Cards'
import { useDispatch, useSelector } from 'react-redux'
import { getInfoBirds, loadMoreData } from '../../redux/actions/fetchAllBirds'
import { Button, Grid, useTheme } from '@mui/material'
import { FloatMenu } from '../../components/Menus/FloatMenu'
import { getOptionsData } from '../../redux/actions/fetchOptions'

export const Aves = () => {
  const theme = useTheme()
  const birds = useSelector(state => state.birdSlice.infoBirds)
  const dispatch = useDispatch()
  const [page, setPage] = React.useState(1);


  const handleChangePage = () => {
    const newPage = page + 1; // Incrementa el valor de la página en 1
    setPage(newPage);
    dispatch(loadMoreData(newPage));
  };

  React.useEffect(() => {
    dispatch(getInfoBirds());
    dispatch(getOptionsData());
  }, [dispatch]);

  return (
    <React.Fragment>
      <Header />
      <Grid container direction="column" alignItems="center"
        sx={{
          padding: '40px',
          backgroundColor: theme.palette.secondary.light,
          minHeight: '100vh'
        }}>
        <Menu />
        <Grid item container spacing={3} justifyContent="center">
          {birds.map((i, index) => (
            <Grid item key={index}>
              <Cards foto={i.imagenes_ave} name={i.nombre_cientifico} />
            </Grid>
          ))}
        </Grid>
        <Button
          variant="outline"
          color="primary"
          onClick={handleChangePage}
        >
          Más
        </Button>
        < FloatMenu />
      </Grid>

    </React.Fragment>
  )
}

