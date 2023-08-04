import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    open: false
};

export const openCloseSlice = createSlice({
    name: "openClose",
    initialState,

    reducers: {
        Boolean: (state, action) => {
            state.open = action.payload
        },
    },
});

export const { Boolean } = openCloseSlice.actions;
export default openCloseSlice.reducer; 