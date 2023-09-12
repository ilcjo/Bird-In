import * as React from 'react'
import { Header } from '../../components/Header'
import { Menu } from '../../components/Menus/Menu'
import { Cards } from '../../components/Cards/Cards'
import { useDispatch, useSelector } from 'react-redux'
import { getInfoBirds, loadMoreData } from '../../redux/actions/fetchAllBirds'
import { Button, Grid, useTheme } from '@mui/material'
import { getOptionsData } from '../../redux/actions/fetchOptions'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FloatMenuAdmin } from '../../components/Menus/FloatMenuAdmin'
import { FloatMenuUser } from '../../components/Menus/FloatMenuUser'
// import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';


export const Aves = () => {

  const theme = useTheme()
  const dispatch = useDispatch()
  const birds = useSelector(state => state.birdSlice.infoBirds)
  const parameter = useSelector(state => state.birdSlice.filters)
  const cliente = localStorage.getItem('tipoCliente');
  const [page, setPage] = React.useState(1);
  
  const isAdmin = cliente === "admin";

  const handleChangePage = () => {
    const newPage = page + 1;
    setPage(newPage);
    dispatch(loadMoreData(newPage, parameter));
  };

  React.useEffect(() => {
    dispatch(getInfoBirds());
    dispatch(getOptionsData()).then(() => {
      // Marca las opciones como cargadas cuando se resuelve la promesa
      setOptionsLoaded(true);
    });
  }, [dispatch]);

  return (
    <React.Fragment>
      <Header />
      <Grid container direction="column" alignItems="center"
        sx={{
          padding: '40px',
          backgroundColor: theme.palette.secondary.light,
          minHeight: '100vh',
          marginBottom: '20px'
        }}>
        <Menu />
        <Grid item container spacing={3} justifyContent="center">
          {birds.map((i, index) => (
            <Grid item key={index}>
              <Cards foto={i.imagenes_ave} name={i.nombre_ingles} />
            </Grid>
          ))}
        </Grid>
        <Grid item>
          <Button
            sx={{
              m: 2,
              fontSize: '1rem', // Aumentar el tamaño del texto a 1.2 rem
              fontWeight: 'bold', // Hacer el texto negrita
              textTransform: 'none',
              color: theme.palette.primary.main,
              borderRadius: '800px'
            }
            }
            variant="outline"
            onClick={handleChangePage}
          >
            
            <ExpandMoreIcon style={{ fontSize: '3rem' }} />

          </Button>
        </Grid>
      </Grid>
      {isAdmin ? <FloatMenuAdmin /> : <FloatMenuUser />}
    </React.Fragment>
  )
}

