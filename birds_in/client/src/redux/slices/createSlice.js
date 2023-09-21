import { createSlice } from "@reduxjs/toolkit"
const initialState = {
    imagenUrlString: '',
};

export const createBird = createSlice({
    name: 'create',
    initialState,

    reducers: {
        saveUrlImage: (state, action) => {
            state.imagenUrlString = action.payload
        },
    }
});

export const {
    saveUrlImage
} = createBird.actions;
export default createBird.reducer;
