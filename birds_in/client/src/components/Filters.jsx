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
                width: 550,
                borderRadius: '10px 10px 0px 0px',
                backgroundColor: theme.palette.primary.dark,
                bottom: 54, left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 2,
                display: 'flex',
                flexDirection: 'column',
                padding: 2
            }} >
            <Grid item>
                <Typography variant="h2" color='primary' sx={{ m: 1 }}>
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
                        renderInput={(params) => <TextField {...params} label="Grupo" />}
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
                        renderInput={(params) => <TextField {...params} label="Familia" />}
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
                        renderInput={(params) => <TextField {...params} label="Paises" />}
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
                        renderInput={(params) => <TextField {...params} label="Nombre Cientifico" />}
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
                        renderInput={(params) => <TextField {...params} label="Nombre Ingles" />}
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

                <Grid item sx={{ textAlign: 'center' }}>
                    <Button variant="contained" size="medium" onClick={handleReset}>
                        Reset
                    </Button>
                    <Button variant="contained" size="medium" onClick={handleClickAplicar}>
                        Aplicar
                    </Button>
                </Grid>

            </Grid>
        </Grid >

    )
}
