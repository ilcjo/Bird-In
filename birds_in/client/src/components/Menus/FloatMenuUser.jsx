import * as React from 'react'
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import SearchIcon from '@mui/icons-material/Search';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import PersonPinIcon from '@mui/icons-material/PersonPin';

import {
  BottomNavigation,
  BottomNavigationAction,
  InputBase,
  Paper,
  alpha,
  styled,
  useTheme
} from '@mui/material';
import { Filters } from '../Filters'
import { searchBar } from '../../redux/actions/fetchOptions';
import { useDispatch } from 'react-redux';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.primary.light, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.light, 0.25),

  },
  marginLeft: 0,
  marginTop: 8,
  height: '40px',
  width: '90%',
  color: theme.palette.primary.light,
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));


const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(0.5em + ${theme.spacing(1)})`,
    transition: theme.transitions.create('width'),
    width: '90%',
    color: theme.palette.primary.light,
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));


export const FloatMenuUser = () => {

  const theme = useTheme()
  const dispatch = useDispatch()
  const [value, setValue] = React.useState('recents');
  const [searchVisible, setSearchVisible] = React.useState(false);
  const [showCloseIcon, setShowCloseIcon] = React.useState(false); // Estado para mostrar/ocultar el icono de cerrar
  const [filterVisible, setFilterVisible] = React.useState(false);
  const [showCloseFilter, setShowCloseFilter] = React.useState(false);


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
    setShowCloseIcon(!showCloseIcon);
  };

  const toggleFilters = () => {
    setFilterVisible(!filterVisible)
    setShowCloseFilter(!showCloseFilter)

  };

  const handleSearchChange = (e) => {
    const searchQuery = e.target.value;
    dispatch(searchBar(searchQuery));
  };

  return (
    <Paper elevation={3}>
      <BottomNavigation
        sx={{
          position: 'fixed',
          width: 600,
          borderRadius: '20px',
          backgroundColor: theme.palette.primary.dark,
          bottom: 5, left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1,
        }}
        value={value}
        onChange={handleChange}>
        <BottomNavigationAction
          label="Buscar"
          value="search"
          icon={showCloseIcon ? <SearchOffIcon style={{ color: theme.palette.primary.main, fontSize: 36 }} /> :
            <SearchIcon style={{ color: theme.palette.primary.light, fontSize: 36 }} />}
          onClick={toggleSearch} // Agregar esta línea para mostrar/ocultar la barra de búsqueda
        />
        {searchVisible && ( // Mostrar la barra de búsqueda solo cuando searchVisible es verdadero
          <Search>
            <StyledInputBase
              placeholder="Buscar...."
              inputProps={
                { 'aria-label': 'search' }}
              onChange={handleSearchChange}
            />
          </Search>
        )}
        <BottomNavigationAction
          label='Filtros'
          value="filtros"
          onClick={toggleFilters}
          icon={showCloseFilter ? <FilterAltOffIcon style={{ color: theme.palette.primary.main, fontSize: 36 }} /> :
            < FilterAltIcon style={{ color: theme.palette.primary.light, fontSize: 36 }} />}
        />
        {filterVisible && (
          < Filters />
        )}
        <BottomNavigationAction

          label='Add'
          value="add"
          icon={<PersonPinIcon style={{ color: theme.palette.primary.light, fontSize: 36 }} />}

        />
      </BottomNavigation>
    </Paper>
  )
}
