import * as React from 'react'
import { Button, Grid } from '@mui/material'
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { getOptionsData } from '../../redux/actions/fetchOptions';
import { getInfoBirds } from '../../redux/actions/fetchAllBirds';
import { useDispatch } from 'react-redux';

export const MenuBar = ({ isFilterOpen, setIsFilterOpen }) => {
    const dispatch = useDispatch()
    const [selectedButton, setSelectedButton] = React.useState('todo');

    const handleButtonClick = (button) => {
        setSelectedButton(button);
    };
    const handleFilterButtonClick = () => {
        // Cambiar el estado del filtro al hacer clic en el botón del filtro
        setIsFilterOpen(!isFilterOpen);
        dispatch(getOptionsData())
        dispatch(getInfoBirds())
    };

    return (
        <Grid container spacing={2}>
            <Grid item sx={{ marginLeft: '60px', marginBottom: '10px' }}>
                <Button
                    sx={{
                        fontSize: '1rem', // Aumentar el tamaño del texto a 1.2 rem
                        fontWeight: 'bold', // Hacer el texto negrita
                    }}
                    color="primary" // Cambiar el color a "primary"
                    size="large"
                    onClick={() => handleButtonClick('todo')}
                >
                    Todo
                </Button>
            </Grid>
            <Grid item sx={{ marginBottom: '10px' }}>
                <Button
                    sx={{
                        fontSize: '1rem', // Aumentar el tamaño del texto a 1.2 rem
                        fontWeight: 'bold', // Hacer el texto negrita
                    }}
                    color="primary" // Cambiar el color a "primary"
                    size="large"
                    onClick={() => handleButtonClick('coleccion')}
                    endIcon={<BookmarksIcon />}
                >
                    Colección
                </Button>
            </Grid>
            <Grid item>
                <Button sx={{ marginBottom: '10px', marginLeft: '950px', }}
                    variant="outlined"
                    color="secondary"
                    onClick={handleFilterButtonClick}
                    endIcon={<FilterAltIcon />}
                >
                    Abrir Filtro
                </Button>
            </Grid>
        </Grid>
    );
};
