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

export const Insectos = () => {

  const theme = useTheme()
  const dispatch = useDispatch()
  const { loading, info, isOne, total } = useSelector(state => state.data)
  const { filters, noMoreResults } = useSelector(state => state.filter)
  const { allCustom } = useSelector((state) => state.customizesSlice);
  const [isFilterDialogOpen, setFilterDialogOpen] = React.useState(true);
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


  React.useEffect(() => {
    const fetchData = async () => {
      // Set loading to true before dispatching the action
      setShowBackdrop(true);
      setLoadingMessage('Cargando ...');
      try {
        // Await the dispatch. This assumes sendParameter is an async thunk
        // that returns a promise.
        await dispatch(sendParameter(selectOption));
        setShowBackdrop(false)
      } catch (error) {
        console.error("Failed to fetch data:", error);
        // You might want to show an error message to the user here
      } finally {
        // Set loading to false once the dispatch is complete, regardless of success or failure
        setShowBackdrop(false);
      }
    };

    fetchData(); // Call the async function
  }, [dispatch, selectOption]);




  return (
    <React.Fragment>
      <MenuBar isFilterOpen={isFilterDialogOpen} setIsFilterOpen={setFilterDialogOpen} showAllButton={true} ShowFilterButton={true} ShowBackButton={true} showAdmin={true} />
      <Grid container>
        <PhotosDetailI animal={info[0]} setIsFilterOpen={setFilterDialogOpen} setPage={setPage} />
      </Grid>
      <Loading
        message={loadingMessage}
        open={showBackdrop}
      />
      <Loading
        message={loadingMessage}
        open={showBackdrop}
      />
    </React.Fragment >
  );
};
