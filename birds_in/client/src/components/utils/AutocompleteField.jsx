import * as React from 'react'
import { Autocomplete, TextField } from '@mui/material';

const AutocompleteField = ({ id, options, value, onChange, label, disabled, isOptionEqualToValue }) => {
    // console.log(isOptionEqualToValue)
    return (
        <Autocomplete
            id={id}
            options={options}
            value={value}
            onChange={onChange}
            renderInput={(params) =>
                <TextField {...params} label={label} />}
            disabled={disabled}
            sx={{ my: 2 }}
            isOptionEqualToValue={(option, value) => option.nombre === value.nombre}
        />
    );
};

export default AutocompleteField