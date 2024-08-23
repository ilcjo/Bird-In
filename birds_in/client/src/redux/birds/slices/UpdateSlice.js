import { createSlice } from "@reduxjs/toolkit"

const initialState = {

    imagenUrlString: '',
    idAve: 0,
    infoAveForUpdate: {},
};

export const update = createSlice({
    name: 'update',
    initialState,

    reducers: {
        saveUrlImage: (state, action) => {
            state.imagenUrlString = action.payload
        },
        idSelectedUpdate: (state, action) => {
            state.idAve = action.payload
        },
        getAve: (state, action) => {
            state.infoAveForUpdate = action.payload
        },
        setEstateInfo: (state, action) => {
            state.infoAveForUpdate = {}
        }
    }
});

export const {
    saveUrlImage,
    idSelectedUpdate,
    getAve,
    setEstateInfo
} = update.actions;
export default update.reducer;
