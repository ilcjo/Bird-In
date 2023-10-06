import { createSlice } from "@reduxjs/toolkit"

const initialState = {

    allCustom: [],

};

export const customizesSlice = createSlice({
    name: 'cusmomizes',
    initialState,

    reducers: {
        perzonalizaciones: (state, action) => {
            state.allCustom = action.payload
        },

    }
});

export const {
    perzonalizaciones

} = customizesSlice.actions;
export default customizesSlice.reducer;
