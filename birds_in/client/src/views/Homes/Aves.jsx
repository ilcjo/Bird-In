import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadMoreData } from '../../redux/actions/fetchAllBirds'
import { Button, Dialog, Grid, useTheme } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Filters } from '../../components/Filters'
import { Cards } from '../../components/Cards/Cards'
import { MenuBar } from '../../components/Menus/MenuBar'
import { PhotosDetail } from '../../components/PhotosDetail';
import { resetInfoBird, setNoMoreResults } from '../../redux/slices/BirdsSlice';


export const Aves = () => {

  const theme = useTheme()
  const dispatch = useDispatch()
  const birds = useSelector(state => state.birdSlice.infoBirds)
  const parameter = useSelector(state => state.birdSlice.filters)
  const { allCustom } = useSelector((state) => state.customizesSlice);
  const noMoreResults = useSelector((state) => state.birdSlice.noMoreResults);
  const [page, setPage] = React.useState(1);
  const [isFilterDialogOpen, setFilterDialogOpen] = React.useState(true);


  const handleChangePage = () => {
    const newPage = page + 1;
    setPage(newPage);
    dispatch(loadMoreData(newPage, parameter));
  };

  React.useEffect(() => {
    // Se ejecuta cada vez que el componente se monta
    dispatch(resetInfoBird());
  }, []);

  return (
    <React.Fragment>
      <MenuBar isFilterOpen={isFilterDialogOpen} setIsFilterOpen={setFilterDialogOpen} showAllButton={true} ShowFilterButton={true} ShowBackButton={true} showAdmin={true} />
      <Grid
        container
        direction="column"
        alignItems="center"
        sx={{
          background: birds.length === 1 ? 'none' : `url(${allCustom.background_aves}) center/cover no-repeat fixed`,
          backgroundColor: theme.palette.secondary.light,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          minHeight: '90vh',
        }}
      >
        <Dialog
          open={isFilterDialogOpen}
          onClose={() => setFilterDialogOpen(false)} // Cierra el diálogo al hacer clic en cerrar
          fullWidth
          mixWidth="md"
        >
          <Filters isFilterOpen={isFilterDialogOpen} setIsFilterOpen={setFilterDialogOpen} pages={setPage} />
        </Dialog>
        {/* 
        {birds.length === 1 ? (
          <PhotosDetail bird={birds[0]} />
        ) : (
          <Grid item container spacing={3} justifyContent="center">
            {birds.map((bird, index) => (
              <Grid item key={index}>
                <Cards foto={bird.imagenes_aves} name={bird.nombre_ingles} />
              </Grid>
            ))}
          </Grid>
        )} */}
        {birds.length > 1 && (
          <Grid item container spacing={3} justifyContent="center">
            {birds.map((bird, index) => (
              <Grid item key={index}>
                <Cards foto={bird.imagenes_aves} name={bird.nombre_ingles} />
              </Grid>
            ))}
          </Grid>
        )}
        {birds.length === 1 && (
          <PhotosDetail bird={birds[0]} />
        )}
        <Grid item>
          {!noMoreResults && (
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
          )}
        </Grid>
      </Grid>
    </React.Fragment >
  );
};
