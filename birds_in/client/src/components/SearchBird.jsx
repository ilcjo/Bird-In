import * as React from 'react'
import { Grid, InputBase, Typography, alpha, styled, useTheme } from '@mui/material';
import { searchBar } from '../redux/actions/fetchOptions';
import { useDispatch, useSelector } from 'react-redux';
import { Cards } from './Cards/Cards';
import { CardsUpdate } from './Cards/CardsUpdate';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.primary.light, 0.7),
    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.light, 0.25),

    },
    marginLeft: 0,
    marginTop: 8,
    height: '40px',
    width: '100%',
    color: theme.palette.primary.light,
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));


const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(0, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(0.5em + ${theme.spacing(1)})`,
        transition: theme.transitions.create('width'),
        width: '90%',
        color: theme.palette.primary.main,
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));
export const SearchBird = ({ showForm, toggleForm }) => {
    console.log(toggleForm)
    const theme = useTheme()
    const dispatch = useDispatch()
    const [searchQuery, setSearchQuery] = React.useState('');
    const birds = useSelector(state => state.birdSlice.infoBirds)

    const handleSearchChange = (e) => {
        const searchQuery = e.target.value;
        dispatch(searchBar(searchQuery));
        setSearchQuery(searchQuery)
    };
    return (
        <React.Fragment>
            <Grid container direction="column" alignItems="center"  >
                <Grid item sx={{ my: 2}}>
                    <Typography variant='h2' color='primary'>
                        Buscar Ave
                    </Typography>
                </Grid>
                <Grid item>
                    <Search>
                        <StyledInputBase
                            placeholder="Buscar...."
                            inputProps={{ 'aria-label': 'search' }}
                            onChange={handleSearchChange}
                        />
                    </Search>
                </Grid>
            </Grid>
            {searchQuery !== '' && (
                <Grid container spacing={3} justifyContent="center" sx={{my:3}}>
                    {birds.map((bird, index) => (
                        <Grid item xs={4} key={index}>
                            <CardsUpdate foto={bird.imagenes_ave} name={bird.nombre_ingles} onClick={toggleForm} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </React.Fragment>
    )
}