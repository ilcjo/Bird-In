import { createSlice } from "@reduxjs/toolkit"

const initialState = {

    imagenUrlString: '',
    id: 0,
    infoForUpdate: {},
};

export const updateInfo = createSlice({
    name: 'updateInfo',
    initialState,

    reducers: {
        saveUrlImage: (state, action) => {
            state.imagenUrlString = action.payload
        },
        idSelectedUpdate: (state, action) => {
            state.id = action.payload
        },
        getRegistro: (state, action) => {
            state.infoForUpdate = action.payload
        },
        setEstateInfo: (state, action) => {
            state.infoForUpdate = {}
        }
    }
});

export const {
    saveUrlImage,
    idSelectedUpdate,
    getRegistro,
    setEstateInfo
} = updateInfo.actions;
export default updateInfo.reducer;
