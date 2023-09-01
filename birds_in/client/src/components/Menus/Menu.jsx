import * as React from 'react'
import { Button, Grid } from '@mui/material'
import BookmarksIcon from '@mui/icons-material/Bookmarks';

export const Menu = () => {
    const [selectedButton, setSelectedButton] = React.useState('todo');

    const handleButtonClick = (button) => {
        setSelectedButton(button);
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
        </Grid>
    );
};
