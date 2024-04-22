import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadMoreData } from '../../redux/actions/fetchAllBirds'
import { Button, Dialog, Grid, useTheme } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Filters } from '../../components/Filters'
import { Cards } from '../../components/Cards/Cards'
import { MenuBar } from '../../components/Menus/MenuBar'
import { PhotosDetail } from '../../components/PhotosDetail';
import { resetInfoBird } from '../../redux/slices/BirdsSlice';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export const Aves = () => {

  const theme = useTheme()
  const dispatch = useDispatch()
  const birds = useSelector(state => state.birdSlice.infoBirds)
  const parameter = useSelector(state => state.birdSlice.filters)
  const { allCustom } = useSelector((state) => state.customizesSlice);
  const noMoreResults = useSelector((state) => state.birdSlice.noMoreResults);
  const [page, setPage] = React.useState(1);
  const [isFilterDialogOpen, setFilterDialogOpen] = React.useState(true);
  const panel = localStorage.getItem('panel')
  
  const handleChangePage = () => {
    const newPage = page + 1;
    setPage(newPage);
    dispatch(loadMoreData(newPage, parameter));
  };

  const stepBack = () => {
    setFilterDialogOpen(true)
    dispatch(resetInfoBird())

  };
  React.useEffect(() => {
    // Se ejecuta cada vez que el componente se monta
    dispatch(resetInfoBird());
  }, []);

  let dataToMap = [];
  switch (panel) {
    case 'aves':
      dataToMap = birds;
      break;
    case 'paisajes':
      dataToMap = landscapes;
      break;
    case 'peces':
      dataToMap = fishes;
      break;
    case 'flora':
      dataToMap = flora;
      break;
    default:
      dataToMap = [];
  }

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
          backgroundSize: { xs: 'cover', sm: 'cover', md: 'cover', lg: 'cover', xl: 'cover' },
          backgroundRepeat: 'no-repeat',
          backgroundPosition: { xs: 'right', sm: 'right', md: 'center', lg: 'center', xl: 'bottom' },
          minHeight: '90vh',
        }}
      >

        <Dialog
          open={isFilterDialogOpen}
          onClose={() => setFilterDialogOpen(false)} // Cierra el diálogo al hacer clic en cerrar
          fullWidth
          minWidth="md"
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
             <Typography variant="h2" color='primary.light'
          sx={{
            marginLeft: '2px',
            mt: 8,
            fontSize: { xs: '1.4rem', sm: '1.8rem', md: '1.8rem', lg: '1.8rem', xl: '1.8rem' },
          }}>
            Total de Aves:  {totalAves}
            </Typography>
            <Button
              sx={{
                mt: 5,
                ml: { xs: '50%', sm: '50%', md: '70%', lg: '70%', xl: '70%' },
                fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1rem', lg: '1rem', xl: '1rem' },
                fontWeight: 'bold',
                color: theme.palette.primary.main,
                backgroundColor: 'rgba(0, 56, 28, 0.2)', // Establece el fondo transparente deseado
                backdropFilter: 'blur(9px)', // Efecto de desenfoque de fondo
                // textShadow: `2px 2px 3px ${theme.palette.primary.light}`,
              }}
              variant="outline"
              onClick={stepBack}
              startIcon={<ArrowBackIcon />}
            >Regresar
            </Button>
            {dataToMap.map((bird, index) => (
              <Grid item key={index}>
                <Cards foto={bird.imagenes_aves} name={bird.nombre_ingles} />
              </Grid>
            ))}
          </Grid>
        )}
        {dataToMap.length === 1 && (
          <PhotosDetail bird={birds[0]} setIsFilterOpen={setFilterDialogOpen} />
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
