import * as React from 'react'
import { Header } from '../../components/Header'
import {  MenuBar } from '../../components/Menus/MenuBar'
import { Cards } from '../../components/Cards/Cards'
import { useDispatch, useSelector } from 'react-redux'
import { getInfoBirds, loadMoreData } from '../../redux/actions/fetchAllBirds'
import { Button, Dialog, Grid, useTheme } from '@mui/material'
// import { getOptionsData } from '../../redux/actions/fetchOptions'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import { FloatMenuAdmin } from '../../components/Menus/FloatMenuAdmin'
// import { FloatMenuUser } from '../../components/Menus/FloatMenuUser'
import { Filters } from '../../components/Filters'
// import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';


export const Aves = () => {

  const theme = useTheme()
  const dispatch = useDispatch()
  const birds = useSelector(state => state.birdSlice.infoBirds)
  const parameter = useSelector(state => state.birdSlice.filters)
  // const cliente = localStorage.getItem('tipoCliente');
  const [page, setPage] = React.useState(1);
  // const [showFilter, setShowFilter] = React.useState(true); // Estado para mostrar/ocultar el filtro
  const [isFilterDialogOpen, setFilterDialogOpen] = React.useState(true);
  // const isAdmin = cliente === "admin";

  const handleChangePage = () => {
    const newPage = page + 1;
    setPage(newPage);
    dispatch(loadMoreData(newPage, parameter));
  };

  React.useEffect(() => {
    dispatch(getInfoBirds());
  }, [dispatch]);

  // const toggleFilterView = () => {
  //   setShowFilter(!showFilter);
  // };

  return (
    <React.Fragment>
      <Header />
      <Grid
        container
        direction="column"
        alignItems="center"
        sx={{
          padding: '30px',
          backgroundColor: theme.palette.secondary.light,
          minHeight: '100vh',
          marginBottom: '20px',
        }}
      >
        < MenuBar isFilterOpen={isFilterDialogOpen} setIsFilterOpen={setFilterDialogOpen} />
       
        <Dialog
          open={isFilterDialogOpen}
          onClose={() => setFilterDialogOpen(false)} // Cierra el diálogo al hacer clic en cerrar
          fullWidth
          maxWidth="md"
        >
          <Filters isFilterOpen={isFilterDialogOpen} setIsFilterOpen={setFilterDialogOpen} />
        </Dialog>
        {/* {showFilter && (
          <Grid item container spacing={3} justifyContent="center">
            <Filters />
          </Grid>
        )} */}

          <Grid item container spacing={3} justifyContent="center">
            {birds.map((i, index) => (
              <Grid item key={index}>
                <Cards foto={i.imagenes_ave} name={i.nombre_ingles} />
              </Grid>
            ))}
          </Grid>
        
        <Grid item>
          {/* {showFilter ? (
            <Button
              sx={{
                m: 2,
                fontSize: '1rem',
                fontWeight: 'bold',
                textTransform: 'none',
                color: theme.palette.primary.main,
                borderRadius: '800px',
              }}
              variant="outline"
              onClick={toggleFilterView}
            >
              Ver tarjetas
            </Button>
          ) : (
            <Button
              sx={{
                m: 2,
                fontSize: '1rem',
                fontWeight: 'bold',
                textTransform: 'none',
                color: theme.palette.primary.main,
                borderRadius: '800px',
              }}
              variant="outline"
              onClick={toggleFilterView}
            >
              Volver al filtro
            </Button>
          )} */}
          <Button
            sx={{
              m: 2,
              fontSize: '1rem',
              fontWeight: 'bold',
              textTransform: 'none',
              color: theme.palette.primary.main,
              borderRadius: '800px',
            }}
            variant="outline"
            onClick={handleChangePage}
          >
            <ExpandMoreIcon style={{ fontSize: '3rem' }} />
          </Button>
        </Grid>
      </Grid>
      {/* {isAdmin ? <FloatMenuAdmin /> : <FloatMenuUser />} */}
    </React.Fragment>
  );
};
