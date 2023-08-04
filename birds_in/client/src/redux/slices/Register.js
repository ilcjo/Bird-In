import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    email: '',
    name: '',
    pais: '',
    pass: '',
}

export const registerSlice = createSlice({
    name: "register",
    initialState,

    reducers: {
        nameUser: (state, action) => {
            state.name = action.payload;
        },
        emailUser: (state, action) => {
            state.email = action.payload;
        },
        paisUser: (state, action) => {
            state.pais = action.payload;
        },
        passwordUser: (state, action) => {
            state.pass = action.payload;
        },
        resetForm: () => initialState,
    },
});

export const { nameUser, emailUser, paisUser, passwordUser , resetForm} = registerSlice.actions;
export default registerSlice.reducer;
