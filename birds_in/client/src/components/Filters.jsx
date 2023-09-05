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
    TextField
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { sendParameter } from '../redux/actions/fetchAllBirds'
import { saveFilters } from '../redux/slices/BirdsSlice'
import { fetchNewOptions, getOptionsData } from '../redux/actions/fetchOptions'


export const Filters = () => {

    const theme = useTheme()
    const dispatch = useDispatch()
    const grupos = useSelector(state => state.birdSlice.options.grupos)
    const familias = useSelector(state => state.birdSlice.options.familias)
    const paises = useSelector(state => state.birdSlice.options.paises)
    const cientifico = useSelector(state => state.birdSlice.options.nCientifico)
    const ingles = useSelector(state => state.birdSlice.options.nIngles)

    const [grupoName, setGrupoName] = React.useState([]);
    const [familiaName, setFamiliaName] = React.useState([]);
    const [paisesName, setPaisesName] = React.useState([]);
    const [cientificoName, setCientificoName] = React.useState([]);
    const [inglesName, setInglesName] = React.useState([]);

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

    const handleClickAplicar = () => {
        const filtersPayload = {
            grupo: grupoName,
            familia: familiaName,
            paises: paisesName,
            cientifico: cientificoName,
            ingles: inglesName
        };
        dispatch(saveFilters(filtersPayload))
        dispatch(sendParameter(grupoName, familiaName, paisesName, inglesName, cientificoName,))
    };
    const handleReset = () => {
        setGrupoName([]);
        setFamiliaName([]);
        setPaisesName([]);
        setCientificoName([]);
        setInglesName([]);
        dispatch(getOptionsData())
        // Restablece otros selectores si es necesario
    };
    return (
        <Grid component={Box}
            sx={{
                position: 'fixed',
                height: 'auto',
                width: 600,
                borderRadius: '20px 20px 20px 20px',
                backgroundColor: theme.palette.primary.dark,
                bottom: 50, left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 2,
                display: 'flex',
                flexDirection: 'column',
                padding: 5,
            }} >
            <Grid item>
                <Typography variant="h2" color='primary.light' sx={{ m: 1 }}>
                    Filtros Combinados
                </Typography>
            </Grid>
            <Grid item>

                <FormControl sx={{ m: 1, width: '95%' }}>
                    <Autocomplete
                        multiple
                        value={grupoName}
                        onChange={(event, newValue) => {
                            const selectedValues = newValue.map((option) => ({
                                id: option.id,
                                nombre: option.nombre,
                            }));
                            setGrupoName(selectedValues)
                            dispatch(fetchNewOptions(selectedValues, familiaName, paisesName, inglesName, cientificoName));
                        }}
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
                                <Chip
                                color='primary'
                                    key={option.id}
                                    label={option.nombre}
                                    {...getTagProps({ index })}
                                />
                            ))
                        }
                        isOptionEqualToValue={(option, value) => option.id === value?.id}
                        disabled={grupos.length === 0}
                    />
                </FormControl>

                <FormControl sx={{ m: 1, width: '95%' }}>
                    <Autocomplete
                        multiple
                        value={familiaName}
                        onChange={(event, newValue) => {
                            const selectedValues = newValue.map((option) => ({
                                id: option.id,
                                nombre: option.nombre,
                            }));
                            setFamiliaName(selectedValues)
                            dispatch(fetchNewOptions(selectedValues, familiaName, paisesName, inglesName, cientificoName));
                        }}
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
                                <Chip
                                    key={option.id}
                                    label={option.nombre}
                                    {...getTagProps({ index })}
                                />
                            ))
                        }
                        isOptionEqualToValue={(option, value) => option.id === value?.id}
                        disabled={familias.length === 0}
                    />
                </FormControl>

                <FormControl sx={{ m: 1, width: '95%' }}>
                    <Autocomplete
                        multiple
                        value={paisesName}
                        onChange={(event, newValue) => {
                            const selectedValues = newValue.map((option) => ({
                                id: option.id,
                                nombre: option.nombre,
                            }));
                            setPaisesName(selectedValues)
                            dispatch(fetchNewOptions(selectedValues, familiaName, paisesName, inglesName, cientificoName));
                        }}
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
                                <Chip
                                    key={option.id}
                                    label={option.nombre}
                                    {...getTagProps({ index })}
                                />
                            ))
                        }
                        isOptionEqualToValue={(option, value) => option.id === value?.id}
                        disabled={paises.length === 0}
                    />
                </FormControl>

                <FormControl sx={{ m: 1, width: '95%' }}>
                    <Autocomplete
                        multiple

                        value={cientificoName}
                        onChange={(event, newValue) => {
                            const selectedValues = newValue.map((option) => ({
                                nombre: option.nombre,
                            }));
                            setCientificoName(selectedValues)
                            dispatch(fetchNewOptions(selectedValues, familiaName, paisesName, inglesName, cientificoName));
                        }}
                        options={cientifico}
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
                                <Chip
                                    key={index}
                                    label={option.nombre}
                                    {...getTagProps({ index })}
                                    disabled={nCientifico.length === 0}
                                />
                            ))
                        }
                    />
                </FormControl>

                <FormControl sx={{ m: 1, width: '95%' }} >
                    <Autocomplete
                        multiple
                        value={inglesName}
                        onChange={(event, newValue) => {
                            const selectedValues = newValue.map((option) => ({
                                nombre: option.nombre,
                            }));
                            setInglesName(selectedValues)
                            dispatch(fetchNewOptions(selectedValues, familiaName, paisesName, inglesName, cientificoName));
                        }}
                        options={ingles}
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
                                <Chip
                                    key={index}
                                    label={option.nombre}
                                    {...getTagProps({ index })}
                                    disabled={ingles.length === 0}
                                />
                            ))
                        }
                    />
                </FormControl>

                <Grid container component={Box} sx={actionsStyles}>
                    <Button variant="outlined" color="primary" onClick={handleReset}>
                        Resetear
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleClickAplicar}>
                        Filtrar
                    </Button>
                </Grid>

            </Grid>
        </Grid >

    )
}
