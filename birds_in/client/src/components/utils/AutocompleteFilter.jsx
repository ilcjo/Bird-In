import { Autocomplete, FormControl, TextField, Typography, CircularProgress, Paper } from "@mui/material";
import { useEffect } from "react";

export const AutocompleteFilter = ({ label, options, value, onChange, loading }) => {
    // Función para filtrar y ordenar
    // const customFilter = (opts, state) => {
    //     const input = state.inputValue?.toLowerCase().trim() || "";

    //     const filtered = opts.filter(opt => {
    //         if (!opt?.nombre) return false; // Evita errores si es null o undefined
    //         return opt.nombre
    //             .toLowerCase()
    //             .split(" ")
    //             .some(word => word.startsWith(input));
    //     });

    //     return filtered.sort((a, b) =>
    //         (a?.nombre || "").localeCompare(b?.nombre || "", "es", { sensitivity: "base" })
    //     );
    // };

    // console.log(options, 'soy opciones')
    const customFilter = (opts, state) => {
    const input = state.inputValue?.toLowerCase().trim() || "";

    // Si no hay texto de búsqueda, retorna todos los elementos ordenados
    if (!input) {
        return opts.sort((a, b) =>
            (a?.nombre || "").localeCompare(b?.nombre || "", "es", { sensitivity: "base" })
        );
    }

    const filtered = opts.filter(opt => {
        if (!opt?.nombre) return false;

        const name = opt.nombre.toLowerCase();

        // Dividir tanto por espacios como por guiones, guiones bajos o barras
        const parts = name.split(/[\s\-_\/]+/);

        // Coincidencia si alguna parte empieza con el input
        const startsWithMatch = parts.some(word => word.startsWith(input));

        // También considerar coincidencias dentro del nombre completo
        const includesMatch = name.includes(input);

        return startsWithMatch || includesMatch;
    });

    return filtered.sort((a, b) =>
        (a?.nombre || "").localeCompare(b?.nombre || "", "es", { sensitivity: "base" })
    );
};


    return (
        <FormControl sx={{ m: 0.5, width: '95%' }}>
            <Autocomplete
                multiple
                filterOptions={customFilter}
                value={value}
                onChange={(event, newValue) => onChange(newValue)}
                options={loading ? [] : options || []} // Muestra un array vacío mientras carga
                getOptionLabel={(option) => option.nombre}
                loading={loading}
                PaperComponent={(props) => (
                    <Paper
                        {...props}
                        sx={{
                            maxHeight: 350,
                            overflowY: "auto",
                            position: "relative",
                            // Firefox
                            scrollbarWidth: "auto",
                            scrollbarColor: "#ff9800 #f0f0f0",
                            // Webkit (Chrome, Edge, Safari)
                            "&::-webkit-scrollbar": {
                                width: "14px", // MUCHO más gruesa
                            },
                            "&::-webkit-scrollbar-track": {
                                background: "#f0f0f0",
                            },
                            "&::-webkit-scrollbar-thumb": {
                                backgroundColor: "#ff9800",
                                borderRadius: "7px",
                                border: "3px solid #f0f0f0",
                                animation: "scrollPulse 1s infinite", // animación fuerte
                            },
                            "@keyframes scrollPulse": {
                                "0%": { backgroundColor: "#ff9800" },
                                "50%": { backgroundColor: "#ff5722" },
                                "100%": { backgroundColor: "#ff9800" },
                            },
                        }}
                    />
                )}

                renderInput={(params) =>
                    <TextField
                        {...params}
                        color="primary"
                        // variant="standard"
                        label={label}
                        sx={{
                            '& .MuiInputBase-input': {
                                height: '26px',
                            },
                        }}
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                        }}
                    />}
                renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                        <Typography
                            key={option.id}
                            variant="body2"
                            sx={{
                                display: 'inline-block',
                                fontSize: { xs: '1.2rem', md: '1.5rem', lg: '1.5rem' },
                                color: 'white',
                                ml: 2,
                                mt: 1
                            }}
                        >
                            {option.nombre}
                        </Typography>
                    ))
                }
                isOptionEqualToValue={(option, value) => option.id === value?.id}
                disabled={options?.length === 0}
            />
        </FormControl>
    );
}
