import * as React from 'react'
import { Autocomplete, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography, useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

export const AddZoneCountry = ({ open, onclose }) => {

    const theme = useTheme()
    const dispatch = useDispatch()
    const [uploadModalOpen, setUploadModalOpen] = React.useState(false);
    const { paises } = useSelector(state => state.birdSlice.options)
    const [selectOptions, setSelectOPtions] = React.useState({
        pais: [],
        zona: ''
    })

    const handleOnclickAdd = () => {

    }
    const handleCloseUploadModal = () => {
        setUploadModalOpen(false);
    };
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setSelectOPtions({
            ...selectOptions,
            [name]: value,
        });

        // Clear the error when the user starts typing in the input field
        // if (errors[name]) {
        //     setErrors({
        //         ...errors,
        //         [name]: false,
        //     });
        // }
    };
    const sortAlphabetically = (array) => {
        return array.slice().sort((a, b) => {
            // Comprobamos si 'a' y 'b' son objetos válidos y tienen una propiedad 'nombre'
            if (a && a.nombre && b && b.nombre) {
                const nameA = a.nombre.charAt(0).toUpperCase() + a.nombre.slice(1);
                const nameB = b.nombre.charAt(0).toUpperCase() + b.nombre.slice(1);
                return nameA.localeCompare(nameB);
            }
            // Si 'a' o 'b' no tienen la propiedad 'nombre', no hacemos nada
            return 0;
        });
    };
    const sortedPaises = sortAlphabetically(paises);

    const labelStyles = {
        color: theme.palette.primary.main, // Color del texto del label
        marginTop: '-10px',
    };
    const inputStyles = {
        // Aquí puedes agregar los estilos que desees para los inputs
        color: theme.palette.primary.light,
        backgroundColor: 'rgba(204,214,204,0.17)',
        borderRadius: '9px',
        height: '80px',
        '& .MuiInputBase-input': {
            padding: '0px',
            paddingLeft: '10px',
        },
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'none',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.main, // Color del borde en el hover
            backgroundColor: 'rgba(0,56,28,0.22) ',
        },
        '& .css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.MuiSelect-select': {
            // Agrega los estilos que desees para el Select
            height: '50px',
            // width: '180px' // Ejemplo: cambia el color del texto a azul
        },

    };
    return (
        <React.Fragment>
            <Dialog open={uploadModalOpen} onClose={handleCloseUploadModal}>
                <DialogTitle> <Grid container alignItems="center">
                    <Grid item>
                        <Typography
                            variant='h2'
                            color='primary.main'
                            sx={{ mr: 2 }}
                        >
                            Referencias Zona a País:
                        </Typography>
                    </Grid>
                    <DialogContent>
                        <Grid item xs={12} sm={6} >
                            <TextField
                                variant="filled"
                                name="zona"
                                label="Zonas"
                                value={selectOptions.zona}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                                multiline
                                rows={2}
                                sx={{ mt: -3, mb: 2, backgroundColor: 'rgba(204,214,204,0.17)', }}
                                InputLabelProps={{
                                    sx: labelStyles, // Establece el estilo del label del input
                                }}
                                InputProps={{
                                    style: { color: '#ccd6cc' } // Cambia el color del texto a azul (o el color que desees)
                                }}
                            />
                        </Grid>
                        <Grid tem xs={12} sm={6} >
                            <Autocomplete
                                disablePortal
                                id="combo-box-pais"
                                options={sortedPaises}
                                getOptionLabel={(option) => option.nombre}
                                value={selectOptions.pais}
                                onChange={(event, newValue) => setSelectOPtions({ ...selectOptions, pais: newValue })}
                                renderInput={(params) =>
                                    <TextField
                                        {...params}
                                        label="Países"
                                        InputLabelProps={{
                                            sx: labelStyles, // Estilo del label
                                        }}
                                        InputProps={{
                                            ...params.InputProps,
                                            sx: inputStyles, // Estilo del input
                                        }}
                                    />}
                                isOptionEqualToValue={(option, value) => option.id === value?.id}
                                multiple
                                filterOptions={(options, state) => {
                                    // Filtra las opciones para que coincidan solo al principio de las letras
                                    const inputValue = state.inputValue.toLowerCase();
                                    return options.filter((option) =>
                                        option.nombre.toLowerCase().startsWith(inputValue)
                                    );
                                }}
                                renderTags={(value, getTagProps) =>
                                    value.map((option, index) => (
                                        <Chip
                                            label={option.nombre}
                                            {...getTagProps({ index })}
                                            sx={{
                                                backgroundColor: 'secondary.light', color: 'white', '& .MuiChip-label': {
                                                    fontSize: '1.1rem', // Ajusta el tamaño del texto aquí
                                                },
                                            }} // Ajusta los estilos aquí
                                        />
                                    ))
                                }
                            />
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button>
                            Grabar
                        </Button>
                    </DialogActions>
                </Grid>
                </DialogTitle>
            </Dialog>
        </React.Fragment>
    )
};
