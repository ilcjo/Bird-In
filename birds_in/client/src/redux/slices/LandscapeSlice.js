import { createSlice } from "@reduxjs/toolkit"

const initialState = {

    landscapes: ['hola', 'como', 'estas'],

};

export const landscapeSlice = createSlice({
    name: 'landscape',
    initialState,

    reducers: {

    }
});

export const {

} = landscapeSlice.actions;
export default landscapeSlice.reducer;
