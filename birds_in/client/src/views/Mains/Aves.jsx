import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadMoreData } from '../../redux/actions/fetchAllBirds'
import { Box, Button, Dialog, Divider, Grid, Typography, useTheme } from '@mui/material'
import { FiltersAves } from '../../components/Mains/Aves/FiltersAves'
import { Cards } from '../../components/Cards/Cards'
import { MenuBar } from '../../components/Menus/MenuBar'
import { isOneBird, resetInfoBird } from '../../redux/slices/BirdsSlice';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Loading } from '../../components/utils/Loading'
import { PhotosDetailAves } from '../../components/Mains/Aves/PhotosDetailAves'
export const Aves = () => {

  const theme = useTheme()
  const dispatch = useDispatch()
  const { loading, infoBirds, filters, noMoreResults, oneBird, total } = useSelector(state => state.birdSlice)
  const { allCustom } = useSelector((state) => state.customizesSlice);
  const [isFilterDialogOpen, setFilterDialogOpen] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [showBackdrop, setShowBackdrop] = React.useState(false);
  const [loadingMessage, setLoadingMessage] = React.useState('Cargando..')

  const panel = localStorage.getItem('panel')

  const handleChangePage = () => {
    const newPage = page + 1;
    setPage(newPage);
    setShowBackdrop(true); // Mostrar Backdrop al cargar más datos
    setLoadingMessage('Cargando Más Aves..')
    dispatch(loadMoreData(newPage, filters)).then(() => {
      setShowBackdrop(false); // Ocultar Backdrop una vez que los datos se cargan
    });
  };

  const stepBack = () => {
    setFilterDialogOpen(true)
    dispatch(resetInfoBird())
    dispatch(isOneBird(null))
  };

  React.useEffect(() => {
    dispatch(resetInfoBird());
    dispatch(isOneBird(null))
  }, []);

  React.useEffect(() => {
    if (loading) {
      setShowBackdrop(true);
      setLoadingMessage('Buscando Resultados...');
    } else {
      setShowBackdrop(false);
    }
  }, [loading]);


  return (
    <React.Fragment>
      <MenuBar isFilterOpen={isFilterDialogOpen} setIsFilterOpen={setFilterDialogOpen} showAllButton={true} ShowFilterButton={true} ShowBackButton={true} showAdmin={true} />
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{
          background: infoBirds.length === 1 ? 'none' : `url(${allCustom.background_aves}) center/cover no-repeat fixed`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          minHeight: '100vh',
          p: infoBirds.length === 1 ? 0 : 2
        }}
      >
        <Dialog
          open={isFilterDialogOpen}
          onClose={() => setFilterDialogOpen(false)}
          fullWidth={true}
          maxWidth='md'
        >
          <FiltersAves isFilterOpen={isFilterDialogOpen} setIsFilterOpen={setFilterDialogOpen} pages={setPage} />
        </Dialog>
        {infoBirds.length === 1 && (
          <Grid container >
            <PhotosDetailAves bird={infoBirds[0]} setIsFilterOpen={setFilterDialogOpen} />
          </Grid>
        )}
        {infoBirds.length > 1 && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              margin: 'auto',
              backgroundColor: 'rgba(32,60,18, 0.2)',
              backdropFilter: 'blur(8px)',
              padding: '40px',
              borderRadius: '20px',
              mb: 10,
              mt: 10,
            }}
          >
            <Grid container
              alignItems="baseline"
              justifyContent="space-between"
              spacing={1}
              sx={{ width: '100%' }}>
              <Grid item xs={12} sm={6} lg={6}>
                <Typography variant='h1' color='primary' sx={{ display: 'flex', alignItems: 'center' }}>
                  Resultados
                  <FilterListIcon fontSize='large' sx={{ ml: 1 }} />
                </Typography>
                <Typography variant='h6' color='white'>
                  Total de Aves Filtradas: {total}
                  <Divider sx={{ my: 2, borderColor: theme.palette.primary.main, }} />
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} lg={6} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
                <Button
                  sx={{
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    mt: { xs: 0, md: 0 },
                    mb: { xs: 3, md: 0 }
                  }}
                  variant="outlined"
                  onClick={stepBack}
                  startIcon={<ArrowBackIcon />}
                >Regresar
                </Button>
              </Grid>
            </Grid>
            <Grid container spacing={3} justifyContent="center">
              {infoBirds.map((bird, index) => (
                <Grid item key={index}>
                  <Cards foto={bird.imagenes_aves} name={bird.nombre_ingles} />
                </Grid>
              ))}
            </Grid>
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
                Más
                <ExpandMoreIcon style={{ fontSize: '3rem', position: 'absolute', top: '100%', left: '50%', transform: 'translate(-50%, -50%)', marginTop: '5px' }} />
              </Button>
            )}
          </Box>
        )}

        {oneBird === false && infoBirds.length === 0 && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              // maxWidth: '1200px',
              margin: 'auto',
              backgroundColor: 'rgba(32,60,18, 0.5)',
              backdropFilter: 'blur(8px)',
              padding: '40px',
              borderRadius: '20px',
              mb: 10,
              mt: 10
            }}
          >
            <Grid container
              alignItems="baseline"
              justifyContent="space-between"
              spacing={2}
              sx={{ width: '100%' }}>
              <Grid item>
                <Typography variant='h1' color='primary' sx={{ display: 'flex', alignItems: 'center' }}>
                  Resultados
                  <FilterListIcon fontSize='large' sx={{ ml: 1 }} />
                </Typography>
                <Typography variant='h6' color='white'>
                  Total de Aves Filtradas: 0
                  <Divider sx={{ my: 2, borderColor: theme.palette.primary.main, }} />
                </Typography>
                <Typography variant='body1' color='primary.light' sx={{ marginTop: '10px' }}>
                  No  Existen Resultados.
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}
      </Grid>

      <Loading
        message={loadingMessage}
        open={showBackdrop}
      />
    </React.Fragment >
  );
};
