import { createSlice } from "@reduxjs/toolkit"

const initialState = {

    allCustom: [],

};

export const customizesSlice = createSlice({
    name: 'customs',
    initialState,

    reducers: {
        personalizaciones: (state, action) => {
            state.allCustom = action.payload
        },

    }
});

export const {
    personalizaciones

} = customizesSlice.actions;
export default customizesSlice.reducer;
