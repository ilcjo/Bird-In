import * as React from 'react'
import {
    Box,
    Button,
    Chip,
    FormControl,
    Grid,
    Typography,
    useTheme,
    Autocomplete,
    TextField,
    CircularProgress,
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { getInfoBirds, sendParameter } from '../redux/actions/fetchAllBirds'
import { saveFilters } from '../redux/slices/BirdsSlice'
import { fetchNewOptions, getOptionsData } from '../redux/actions/fetchOptions'


export const Filters = () => {
    const theme = useTheme()
    const dispatch = useDispatch()

    const labelStyles = {
        color: theme.palette.primary.main, // Color del texto del label
        marginTop: '-9px',
    };

    const inputStyles = {
        // Aquí puedes agregar los estilos que desees para los inputs
        color: theme.palette.primary.light,
        backgroundColor: 'rgba(204,214,204,0.17)',
        borderRadius: '9px',

        '& .MuiInputBase-input': {
            padding: '0px',
            paddingLeft: '10px',
        },
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'none',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.main, // Color del borde en el hover
            backgroundColor: 'rgba(204,214,204,0.17)',
        },
        '& .css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.MuiSelect-select': {
            // Agrega los estilos que desees para el Select
            height: '50px',
            // width: '180px' // Ejemplo: cambia el color del texto a azul
        },

    };

    const actionsStyles = {
        justifyContent: 'center', // Centrar el botón horizontalmente
        margin: '0px',
        marginTop: '20px',
        gap: '20px',
        fontWeight: 500,
        textAlign: 'center',


        '& .MuiButton-contained': {
            fontSize: '1rem', // Aumentar el tamaño del texto a 1.2 rem
            fontWeight: 'bold', // Hacer el texto negrita
            textTransform: 'none',
            '&:hover': {
                backgroundColor: theme.palette.primary.dark, // Cambia el color de fondo en hover
                color: theme.palette.primary.light, // Cambia el color del texto en hover
                textTransform: 'none',
            },
        },

        '& .MuiButton-outlined': {
            fontSize: '1rem', // Aumentar el tamaño del texto a 1.2 rem
            fontWeight: 'bold', // Hacer el texto negrita
            textTransform: 'none',
        },
    };

    const { nIngles, nCientifico, paises, familias, grupos } = useSelector(state => state.birdSlice.options)
    const [selectOption, setSelectOption] = React.useState({
        grupo: [],
        familia: [],
        pais: [],
        cientifico: [],
        ingles: []

    });

    // const [open, setOpen] = React.useState(false);
    // const [loading, setLoading] = React.useState(true);
    // const loading = open || grupos.length === 0 || familias.length === 0 || paises.length === 0 || nCientifico.length === 0 || nIngles.length === 0;

    const handleOptionChange = (category, newValue) => {

        const updatedSelectOption = {
            ...selectOption,
            [category]: newValue.map((option) => ({
                id: option.id,
                nombre: option.nombre,
            })),
        };
        setSelectOption(updatedSelectOption);
        dispatch(fetchNewOptions(updatedSelectOption));
    };


    const handleClickFiltrar = () => {
        dispatch(saveFilters(selectOption))
        dispatch(sendParameter(selectOption))
    };

    const handleReset = () => {
        setSelectOption({
            grupo: [],
            familia: [],
            pais: [],
            cientifico: [],
            ingles: []
        })
        dispatch(getOptionsData())
        dispatch(getInfoBirds())
    };

    return (
        <Grid component={Box}
            sx={{
                height: 'auto',
                width: 600,
                borderRadius: '20px 20px 20px 20px',
                backgroundColor: 'rgba(0, 61, 21, 0.2)',
                padding: 2,
            }} >
            <Grid item>
                <Typography variant="h2" color='primary.light' sx={{ m: 1, }}>
                    Filtros
                </Typography>
            </Grid>
            <Grid item container justifyContent="center">
                <Grid>
                    {/* Grupo */}
                    <FormControl sx={{ m: 1, width: '95%' }}>
                        <Autocomplete
                            multiple
                            id='grupoInút'
                            value={selectOption.grupo}
                            onChange={(event, newValue) => handleOptionChange('grupo', newValue)}
                            options={grupos}
                            getOptionLabel={(option) => option.nombre}
                            renderInput={(params) =>
                                <TextField {...params}
                                    label="Grupo"
                                    InputLabelProps={{
                                        sx: labelStyles, // Estilo del label
                                    }}
                                    InputProps={{
                                        ...params.InputProps,
                                        sx: inputStyles, // Estilo del input
                                    }}
                                />}
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                    <Typography
                                        key={option.id}
                                        variant="body2" // Elige el variant y otros estilos según tus necesidades
                                        sx={{
                                            display: 'inline-block',
                                            padding: '4px 8px',
                                            color: 'white', // Color del texto de la etiqueta
                                            marginRight: '8px', // Espacio entre etiquetas
                                        }}
                                    >
                                        {option.nombre}
                                    </Typography>
                                ))
                            }

                            isOptionEqualToValue={(option, value) => option.id === value?.id}
                            disabled={grupos.length === 0}
                        />

                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    {/* Familia */}
                    <FormControl sx={{ m: 1, width: '95%' }}>
                        <Autocomplete
                            multiple
                            value={selectOption.familia}
                            onChange={(event, newValue) => handleOptionChange('familia', newValue)}
                            options={familias}
                            getOptionLabel={(option) => option.nombre}
                            renderInput={(params) =>
                                <TextField {...params}
                                    label="Familia"
                                    InputLabelProps={{
                                        sx: labelStyles, // Estilo del label
                                    }}
                                    InputProps={{
                                        ...params.InputProps,
                                        sx: inputStyles, // Estilo del input
                                    }}
                                />}
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                    <Typography
                                        key={option.id}
                                        variant="body2" // Elige el variant y otros estilos según tus necesidades
                                        sx={{
                                            display: 'inline-block',
                                            padding: '4px 8px',
                                            color: 'white', // Color del texto de la etiqueta
                                            marginRight: '8px', // Espacio entre etiquetas
                                        }}
                                    >
                                        {option.nombre}
                                    </Typography>
                                ))
                            }
                            isOptionEqualToValue={(option, value) => option.id === value?.id}
                            disabled={familias.length === 0}
                        />
                    </FormControl>
                    <Grid />
                    <Grid item xs={12}>
                        {/*Pais */}
                        <FormControl sx={{ m: 1, width: '95%' }}>
                            <Autocomplete
                                multiple
                                value={selectOption.pais}
                                onChange={(event, newValue) => handleOptionChange('pais', newValue)}
                                options={paises}
                                getOptionLabel={(option) => option.nombre}
                                renderInput={(params) =>
                                    <TextField {...params}
                                        label="Paises"
                                        InputLabelProps={{
                                            sx: labelStyles, // Estilo del label
                                        }}
                                        InputProps={{
                                            ...params.InputProps,
                                            sx: inputStyles, // Estilo del input

                                        }}
                                    />}
                                renderTags={(value, getTagProps) =>
                                    value.map((option, index) => (
                                        <Typography
                                            key={option.id}
                                            variant="body2" // Elige el variant y otros estilos según tus necesidades
                                            sx={{
                                                display: 'inline-block',
                                                padding: '4px 8px',
                                                color: 'white', // Color del texto de la etiqueta
                                                marginRight: '8px', // Espacio entre etiquetas
                                            }}
                                        >
                                            {option.nombre}
                                        </Typography>
                                    ))
                                }
                                isOptionEqualToValue={(option, value) => option.id === value?.id}
                                disabled={paises.length === 0}
                            />
                        </FormControl>
                    </Grid>
                    <FormControl sx={{ m: 1, width: '95%' }}>
                        <Autocomplete
                            multiple

                            value={selectOption.cientifico}
                            onChange={(event, newValue) => handleOptionChange('cientifico', newValue)}
                            options={nCientifico}
                            getOptionLabel={(option) => option.nombre}
                            renderInput={(params) =>
                                <TextField {...params}
                                    label="Nombre Cientifico"
                                    InputLabelProps={{
                                        sx: labelStyles, // Estilo del label
                                    }}
                                    InputProps={{
                                        ...params.InputProps,
                                        sx: inputStyles, // Estilo del input

                                    }}
                                />}
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                    <Typography
                                        key={option.id}
                                        variant="body2" // Elige el variant y otros estilos según tus necesidades
                                        sx={{
                                            display: 'inline-block',
                                            padding: '4px 8px',
                                            color: 'white', // Color del texto de la etiqueta
                                            marginRight: '8px', // Espacio entre etiquetas
                                        }}
                                    >
                                        {option.nombre}
                                    </Typography>
                                ))
                            }
                            isOptionEqualToValue={(option, value) => option.id === value?.id}
                            disabled={nCientifico.length === 0}
                        />
                    </FormControl>

                    <FormControl sx={{ m: 1, width: '95%' }} >
                        <Autocomplete
                            multiple
                            value={selectOption.ingles}
                            onChange={(event, newValue) => handleOptionChange('ingles', newValue)}
                            options={nIngles}
                            getOptionLabel={(option) => option.nombre}
                            renderInput={(params) =>
                                <TextField {...params}
                                    label="Nombre Ingles"
                                    InputLabelProps={{
                                        sx: labelStyles, // Estilo del label
                                    }}
                                    InputProps={{
                                        ...params.InputProps,
                                        sx: inputStyles, // Estilo del input

                                    }}
                                />}
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                    <Typography
                                        key={option.id}
                                        variant="body2" // Elige el variant y otros estilos según tus necesidades
                                        sx={{
                                            display: 'inline-block',
                                            padding: '4px 8px',
                                            color: 'white', // Color del texto de la etiqueta
                                            marginRight: '8px', // Espacio entre etiquetas
                                        }}
                                    >
                                        {option.nombre}
                                    </Typography>
                                ))
                            }
                            isOptionEqualToValue={(option, value) => option.id === value?.id}
                            disabled={nIngles.length === 0}
                        />
                    </FormControl>

                    <Grid container component={Box} sx={actionsStyles}>
                        <Button variant="outlined" color="primary" onClick={handleReset}>
                            Resetear
                        </Button>
                        <Button variant="contained" color="primary" onClick={handleClickFiltrar}>
                            Filtrar
                        </Button>
                    </Grid>
                </Grid>
            </Grid >
        </Grid>

    )
}
