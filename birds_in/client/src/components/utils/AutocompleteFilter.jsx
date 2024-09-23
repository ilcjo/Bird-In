import { Autocomplete, FormControl, TextField, Typography, CircularProgress } from "@mui/material";

export const AutocompleteFilter = ({ label, options, value, onChange, loading }) => {
    return (
        <FormControl sx={{ m: 1, width: '95%' }}>
            <Autocomplete
                multiple
                value={value}
                onChange={(event, newValue) => onChange(newValue)}
                options={loading ? [] : options || []} // Muestra un array vacío mientras carga
                getOptionLabel={(option) => option.nombre}
                loading={loading}
                renderInput={(params) =>
                    <TextField
                        {...params}
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
