import * as React from 'react'
import {
    Box,
    Button,
    Chip,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    Typography,
    useTheme
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { sendParameter } from '../redux/actions/fetchAllBirds';



const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

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

    const handleChangeGrupo = (event) => {
        const {
            target: { value },
        } = event;
        setGrupoName(
            typeof value === 'string' ? value.split(',') : value,
        )

    };
    const handleChangeFamilia = (event) => {
        const {
            target: { value },
        } = event;
        setFamiliaName(
            typeof value === 'string' ? value.split(',') : value,
        )

    };
    const handleChangePaises = (event) => {
        const {
            target: { value },
        } = event;
        setPaisesName(
            typeof value === 'string' ? value.split(',') : value,
        )

    };
    const handleChangeNombreIngles = (event) => {
        const {
            target: { value },
        } = event;
        setInglesName(
            typeof value === 'string' ? value.split(',') : value,
        );
    };
    const handleChangeNombreCientifico = (event) => {
        const {
            target: { value },
        } = event;
        setCientificoName(
            typeof value === 'string' ? value.split(',') : value,
        );
    };
    const handleDelete = (value) => {
        setGrupoName((prevSelected) => prevSelected.filter(item => item !== value))
    };
    const handleClickAplicar = () => {
        dispatch(sendParameter(grupoName, familiaName, paisesName));
    }

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
                    <InputLabel id="grupos-label"  >Grupo</InputLabel>
                    <Select
                        labelId="grupos-label"
                        id="grupos"
                        multiple
                        value={grupoName}
                        onChange={handleChangeGrupo}
                        input={<OutlinedInput id="select-multiple-grupo" label="Grupo" />}
                        renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => (
                                    <Chip key={value.id} label={value.nombre} onDelete={() => handleDelete(value)} color="primary" />
                                ))}
                            </Box>
                        )}
                        MenuProps={MenuProps}
                    >
                        {grupos.map((name, index) => (
                            <MenuItem
                                key={index}
                                value={{ id: name.id, nombre: name.nombre }}

                            >
                                {name.nombre}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl sx={{ m: 1, width: '95%' }}>
                    <InputLabel id="demo-multiple-familia-label">Familia</InputLabel>
                    <Select
                        labelId="demo-multiple-familia-label"
                        id="demo-multiple-familias"
                        multiple
                        value={familiaName}
                        onChange={handleChangeFamilia}
                        input={<OutlinedInput id="select-multiplefamilias" label="Familia" />}
                        renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => (
                                    <Chip key={value.id} label={value.nombre} color="primary" />
                                ))}
                            </Box>
                        )}
                        MenuProps={MenuProps}
                    >
                        {familias.map((name, index) => (
                            <MenuItem
                                key={index}
                                value={{ id: name.id, nombre: name.nombre }}
                            >
                                {name.nombre}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl sx={{ m: 1, width: '95%' }}>
                    <InputLabel id="demo-multiple-paises-label">Paises</InputLabel>
                    <Select
                        labelId="demo-multiple-paises-label"
                        id="demo-multiple-paises"
                        multiple
                        value={paisesName}
                        onChange={handleChangePaises}
                        input={<OutlinedInput id="select-multiple-paises" label="Paises" />}
                        renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => (
                                    <Chip key={value.id} label={value.nombre} color="primary" />
                                ))}
                            </Box>
                        )}
                        MenuProps={MenuProps}
                    >
                        {paises.map((name, index) => (
                            <MenuItem
                                key={index}
                                value={{ id: name.id, nombre: name.nombre }}

                            >
                                {name.nombre}
                            </MenuItem>
                        ))}
                    </Select>

                </FormControl>
                <FormControl sx={{ m: 1, width: '95%' }}>
                    <InputLabel id="demo-multiple-ncientifico-label">Nombre Cientifico</InputLabel>
                    <Select
                        labelId="demo-multiple-ncientifico-label"
                        id="demo-multiple-ncientifico"
                        multiple
                        value={cientificoName}
                        onChange={handleChangeNombreCientifico}
                        input={<OutlinedInput id="select-multiple-ncientifico" label="ncientifico" />}
                        renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value, index) => (
                                    <Chip key={index} label={value.nombre} color="primary" />
                                ))}
                            </Box>
                        )}
                        MenuProps={MenuProps}
                    >
                        {cientifico.map((name, index) => (
                            <MenuItem
                                key={index}
                                value={name.nombre}
                            >
                                {name.nombre}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl sx={{ m: 1, width: '95%' }} >
                    <InputLabel id="demo-multiple-ningles-label">Nombre en Ingles</InputLabel>
                    <Select
                        labelId="demo-multiple-ningles-label"
                        id="demo-multiple-ningles"
                        multiple
                        value={inglesName}
                        onChange={handleChangeNombreIngles}
                        input={<OutlinedInput id="select-multiple-ningles" label="Nombre en Ingles" />}
                        renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value, index) => (
                                    <Chip key={index} label={value.nombre} color="primary" />
                                ))}
                            </Box>
                        )}
                        MenuProps={MenuProps}
                    >
                        {ingles.map((name, index) => (
                            <MenuItem
                                key={index}
                                value={name.nombre}
                            >
                                {name.nombre}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Grid item sx={{ textAlign: 'center' }}>
                    <Button variant="contained" size="medium">
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
