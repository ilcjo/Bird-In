import { createSlice } from "@reduxjs/toolkit"

const initialState = {

    imagenUrlStringP: '',
    idLand: 0,
    infoLandForUpdate: {},
};

export const createLand = createSlice({
    name: 'createLand',
    initialState,

    reducers: {
        saveUrlImageLand: (state, action) => {
            state.imagenUrlStringP = action.payload
        },
        idSelectedUpdate: (state, action) => {
            state.idLand= action.payload
        },
        getLand: (state, action) => {
            state.infoLandForUpdate = action.payload
        },
        setStateInfoP: (state, action) =>{
            state.infoLandForUpdate = {}
        }
    }
});

export const {
    saveUrlImageLand,
    idSelectedUpdate,
    getLand,
    setStateInfoP
} = createLand.actions;
export default createLand.reducer;
