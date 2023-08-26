import * as React from 'react'
import RestoreIcon from '@mui/icons-material/Restore';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import { BottomNavigation, BottomNavigationAction, InputBase, Paper, alpha, styled, useTheme } from '@mui/material';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '90%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '90%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '90%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

export const FloatMenu = () => {
  const theme = useTheme()
  const [value, setValue] = React.useState('recents');
  const [searchVisible, setSearchVisible] = React.useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
  };
  return (
    <Paper sx={{}} elevation={3}>
      <BottomNavigation
        sx={{
          position: 'fixed',
          width: 500,
          borderRadius: '20px',
          backgroundColor: theme.palette.primary.dark,
          bottom: 5, left: '50%',
          transform: 'translateX(-50%)',
        }}
        value={value}
        onChange={handleChange}>
      
       
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
      
        <BottomNavigationAction
          label='filtros'
          value="filtros"
          icon={< FilterAltIcon />}
        />
      </BottomNavigation>
    </Paper>
  )
}
