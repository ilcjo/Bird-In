import * as React from 'react'
import { Header } from '../../components/Header'
import {  MenuBar } from '../../components/Menus/MenuBar'
import { Cards } from '../../components/Cards/Cards'
import { useDispatch, useSelector } from 'react-redux'
import { loadMoreData } from '../../redux/actions/fetchAllBirds'
import { Button, Dialog, Grid, useTheme } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Filters } from '../../components/Filters'


export const Aves = () => {

  const theme = useTheme()
  const dispatch = useDispatch()
  const birds = useSelector(state => state.birdSlice.infoBirds)
  const parameter = useSelector(state => state.birdSlice.filters)
  const [page, setPage] = React.useState(1);
  const [isFilterDialogOpen, setFilterDialogOpen] = React.useState(true);

  const handleChangePage = () => {
    const newPage = page + 1;
    setPage(newPage);
    dispatch(loadMoreData(newPage, parameter));
  };


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
    
          <Grid item container spacing={3} justifyContent="center">
            {birds.map((i, index) => (
              <Grid item key={index}>
                <Cards foto={i.imagenes_aves} name={i.nombre_ingles} />
              </Grid>
            ))}
          </Grid>
        
        <Grid item>
     
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
    
    </React.Fragment>
  );
};
