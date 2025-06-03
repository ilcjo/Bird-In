import * as React from 'react'
//LIBRARY
import { useDispatch, useSelector } from 'react-redux'
import { Box, Button, Dialog, Divider, Fab, Grid, Typography, useTheme } from '@mui/material'
//ICONS
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FilterListIcon from '@mui/icons-material/FilterList';
//COMPONENTS
import { MenuBar } from '../../components/Menus/MenuBar'
import { Loading } from '../../components/utils/Loading'
import { FiltersI } from '../../components/Mains/Insectos/FiltersI';
import { CardsInsecto } from '../../components/Cards/Insectos/CardsInsecto';
import { PhotosDetailI } from '../../components/Mains/Insectos/PhotosDetailI';
//REDUX
import { loadMoreData } from '../../redux/insectos/actions/infoAction';
import { isOneR, resetInfo, } from '../../redux/insectos/slices/InfoSlice';
import { sendParameter } from '../../redux/insectos/actions/filterAction';
import { copingFilters } from '../../redux/insectos/slices/FilterSlice';

export const Insectos = () => {

  const theme = useTheme()
  const dispatch = useDispatch()
  const { loading, info, isOne, total } = useSelector(state => state.data)
  const { filters, noMoreResults } = useSelector(state => state.filter)
  const { allCustom } = useSelector((state) => state.customizesSlice);
  const [isFilterDialogOpen, setFilterDialogOpen] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [showBackdrop, setShowBackdrop] = React.useState(false);
  const [loadingMessage, setLoadingMessage] = React.useState('Cargando..')
  const [selectOption, setSelectOption] = React.useState({
    grupo: [],
    familia: [],
    pais: [],
    zona: [],
    cientifico: [],
    ingles: [],
  });

  const panel = localStorage.getItem('panel')

  const handleChangePage = () => {
    const newPage = page + 1;
    setPage(newPage);
    setShowBackdrop(true); // Mostrar Backdrop al cargar más datos
    setLoadingMessage('Cargando Más Resultados..')
    dispatch(loadMoreData(newPage, filters)).then(() => {
      setShowBackdrop(false); // Ocultar Backdrop una vez que los datos se cargan
    });
  };

  const stepBack = () => {
    setFilterDialogOpen(true)
    dispatch(resetInfo())
    dispatch(isOneR(null))
  };

  React.useEffect(() => {
    dispatch(resetInfo());
    dispatch(isOneR(null))
  }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      setShowBackdrop(true);
      setLoadingMessage('Buscando Resultados...');
      try {
       const resultLength = await dispatch(sendParameter(selectOption));
        setPage(1);
        dispatch(copingFilters());

        if (resultLength === 1) {
          dispatch(isOneR(true));
        } else {
          dispatch(isOneR(false));
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        // Aquí puedes mostrar un error al usuario si quieres
      } finally {
        setShowBackdrop(false);
      }
    };

    fetchData();
  }, [dispatch, selectOption]);


  return (
    <React.Fragment>
      <MenuBar
        isFilterOpen={isFilterDialogOpen}
        setIsFilterOpen={setFilterDialogOpen}
        showAllButton={true}
        ShowFilterButton={true}
        ShowBackButton={true}
        showAdmin={true}
      />

      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{
          background: info.length === 1
            ? 'none'
            : `url(${allCustom.background_insect}) center/cover no-repeat fixed`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          minHeight: '100vh',
          p: info.length === 1 ? 0 : 2,
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
        {!isFilterDialogOpen && info.length > 1 && (
          <Fab
            variant="extended"
            size="medium"
            color="primary"
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
              zIndex: 1000,
              fontWeight: 'bold',
              '&:hover': { color: 'white' },
            }}
            onClick={stepBack}
          >
            <ArrowBackIcon sx={{ mr: 1 }} />
            Regresar
          </Fab>
        )}

        <Dialog open={isFilterDialogOpen} onClose={() => { }} fullWidth={true}
          maxWidth='xs'>
          <FiltersI
            isFilterOpen={isFilterDialogOpen}
            setIsFilterOpen={setFilterDialogOpen}
            pages={setPage}
          />
        </Dialog>

        {info.length === 1 && (
          <Grid container>
            <PhotosDetailI
              animal={info[0]}
              setIsFilterOpen={setFilterDialogOpen}
              setPage={setPage}
            />
          </Grid>
        )}

        {info.length > 1 && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              margin: 'auto',
              backgroundColor: 'rgba(0, 56, 28, 0.1)',
              backdropFilter: 'blur(8px)',
              paddingBottom: '50px',
              borderRadius: '20px',
              mb: 10,
              mt: 10,
            }}
          >
            <Grid container alignItems="baseline" justifyContent="space-between" spacing={1} sx={{ width: '100%' }}>
              <Grid item xs={12} sm={6} lg={6}>
                <Typography variant='h1' color='primary' sx={{ display: 'flex', alignItems: 'center', ml: 2, mt: 5 }}>
                  Resultados
                  <FilterListIcon fontSize='large' sx={{ ml: 1 }} />
                </Typography>
                <Typography variant='h4' color='white' sx={{ ml: 2 }}>
                  Total de Registros Filtrados: {total}
                  <Divider sx={{ my: 2, borderColor: theme.palette.primary.main }} />
                </Typography>
              </Grid>
            </Grid>

            <Grid container spacing={3} justifyContent="center">
              {info.map((registro, index) => (
                <Grid item key={index}>
                  <CardsInsecto
                    foto={registro.imagenes_insectos}
                    name={registro.nombre_ingles}
                  />
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
                variant="outlined"
                onClick={handleChangePage}
              >
                Más
                <ExpandMoreIcon
                  style={{
                    fontSize: '3rem',
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    marginTop: '5px',
                  }}
                />
              </Button>
            )}
          </Box>
        )}

        {isOne === false && info.length === 0 && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              backgroundColor: 'rgba(32,60,18, 0.5)',
              backdropFilter: 'blur(8px)',
              padding: '40px',
              borderRadius: '20px',
              mb: 10,
              mt: 10,
            }}
          >
            <Grid container alignItems="baseline" spacing={2} sx={{ width: '100%' }}>
              <Grid item>
                <Typography variant='h1' color='primary' sx={{ display: 'flex', alignItems: 'center' }}>
                  Resultados
                  <FilterListIcon fontSize='large' sx={{ ml: 1 }} />
                </Typography>
                <Typography variant='h5' color='white'>
                  Total de Resultados Filtrados: 0
                  <Divider sx={{ my: 2, borderColor: theme.palette.primary.main }} />
                </Typography>
                <Typography variant='body1' color='primary.light' sx={{ mt: 2 }}>
                  No existen resultados.
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}
      </Grid>

      <Loading message={loadingMessage} open={showBackdrop} />
    </React.Fragment>
  );
};