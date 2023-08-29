import { Button, Grid } from '@mui/material'
import * as React from 'react'

export const Menu = () => {
    const [selectedButton, setSelectedButton] = React.useState('todo');

    const handleButtonClick = (button) => {
        setSelectedButton(button);
    };

    return (
        <Grid container spacing={2}>
            <Grid item sx={{ marginLeft: '50px'}}>
                <Button
                    color="primary" // Cambiar el color a "primary"
                    size="large"
                    onClick={() => handleButtonClick('todo')}
                >
                    Todo
                </Button>
            </Grid>
            <Grid item>
                <Button
                    color="primary" // Cambiar el color a "primary"
                    size="large"
                    onClick={() => handleButtonClick('coleccion')}
                >
                    Colección
                </Button>
            </Grid>
        </Grid>
    );
};
