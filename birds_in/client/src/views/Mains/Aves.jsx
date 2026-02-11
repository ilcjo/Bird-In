import * as React from 'react'
//LIBRARY
import { useDispatch, useSelector } from 'react-redux'
import { Box, Button, Dialog, Divider, Fab, Grid, Typography, useTheme } from '@mui/material'
//ICONS
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FilterListIcon from '@mui/icons-material/FilterList';
//COMPONENTS
import { Cards } from '../../components/Cards/Cards'
import { FiltersAves } from '../../components/Mains/Aves/FiltersAves'
import { MenuBar } from '../../components/Menus/MenuBar'
import { Loading } from '../../components/utils/Loading'
//REDUX
import { isOneBird, isSaltarBird, resetInfoBird } from '../../redux/birds/slices/InfoSlice';
import { loadMoreData } from '../../redux/birds/actions/infoAction';
import { PhotosDetailAves } from '../../components/Mains/Aves/PhotosDetailAves';
import { getOptionsDataP } from '../../redux/paisaje/actionsP/fetchOptionsLand';
import { isOneLand, resetInfoLand } from '../../redux/paisaje/slicesP/LandscapeSlice';
import { isSaltarMa, resetInfo as resetInfoM } from '../../redux/mamiferos/slices/InfoSlice';
import { isSaltarRept, resetInfo } from '../../redux/reptiles/slices/InfoSlice';
import fondo from '../../../src/assets/images/fondo.png'
export const Aves = () => {

  const theme = useTheme()
  const dispatch = useDispatch()
  const { loading, infoBirds, oneBird, total, saltarB } = useSelector(state => state.birdSlice)
  const { filters, noMoreResults } = useSelector(state => state.filterSlice)
  const { allCustom } = useSelector((state) => state.customizesSlice);
  const { isBird } = useSelector(state => state.landscapeSlice)
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
    if (saltarB) {
      setFilterDialogOpen(false)
    } else if (isBird) {
      setFilterDialogOpen(false)
    } else {
      dispatch(resetInfoLand());
      dispatch(resetInfo())
      dispatch(resetInfoBird())
      dispatch(resetInfoM())
      dispatch(isOneLand(null))
      dispatch(isSaltarBird(false))
      dispatch(isSaltarMa(false))
      dispatch(isSaltarRept(false))
      dispatch(isOneBird(null))
      dispatch(getOptionsDataP());
    }
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
          paddingTop: '90px',
          p: infoBirds.length === 1 ? 0 : 2,
          '::before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0.5, // Opcional para mayor discreción
            pointerEvents: 'none', // Impide la interacción con la imagen
          }
        }}
      >
        {!isFilterDialogOpen && infoBirds.length > 1 && (
          <Fab
            variant="extended"
            size="medium"
            color="secondary"
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
              zIndex: 1000,
              fontWeight: 'bold',
              color: '#103300',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'transparent', // Cambia el color de fondo en hover
                color: '#ccd6cc', // Cambia el color del texto en hover
                textTransform: 'none',
              }
            }}
            onClick={stepBack}
          >
            <ArrowBackIcon sx={{ mr: 1 }} />
            Regresar
          </Fab>
        )}

        <Dialog
          open={isFilterDialogOpen}
          onClose={() => { }}
          fullWidth={false}
          maxWidth='xs'
        >
          <FiltersAves isFilterOpen={isFilterDialogOpen} setIsFilterOpen={setFilterDialogOpen} pages={setPage} />
        </Dialog>
        {infoBirds.length === 1 && (
          <Grid container >
            <PhotosDetailAves bird={infoBirds[0]} setIsFilterOpen={setFilterDialogOpen} setPage={setPage} />
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
              // backgroundImage: `url(${fondo})`,
              background: `
  linear-gradient(
    180deg,
    rgba(242, 246, 219, 0.27) 0%,
    rgba(65, 99, 69, 0.75) 50%,
    rgba(65, 99, 69, 0.75) 100%
  )
`,
              backdropFilter: 'blur(7px)',
              paddingBottom: '50px',
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
              <Grid item xs={12} sm={6} lg={6} >
                <Typography variant='h1' color='secondary.dark' sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', marginLeft: '20px', mt: 5 }}>
                  Resultados
                  {/* <FilterListIcon fontSize='large' sx={{ ml: 1 }} /> */}
                </Typography>
                <Typography variant='body1' color='secondary.dark' sx={{ marginLeft: '20px', mb: 5 }}>
                  {total} aves encontradas
                  {/* <Divider sx={{ my: 2, borderColor: theme.palette.primary.main, }} /> */}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} lg={6} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
                {/* <Button
                  sx={{
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    mt: { xs: 0, md: 0 },
                    mb: { xs: 3, md: 0 },
                    marginRight: '20px',
                    marginLeft: { xs: '20px', md: 0 },
                  }}
                  variant="outlined"
                  onClick={stepBack}
                // startIcon={< ArrowBackIcon/>}
                >Regresar
                </Button> */}
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
                  color: theme.palette.secondary.main,
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
              mt: 10,

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
                <Typography variant='h5' color='white'>
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
