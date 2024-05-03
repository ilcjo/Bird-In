import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    infoLands: [],
    copyInfoLands: [],
    optionsP: [],
    saveOptionsP: [],
    filtersOn: false,
    noMoreResults: true,
    currentFiltersP: {
        pais: [],
        zona: [],
        descripcion: [],
    },
    filtersP: '',
    copyFiltersP: {},
    count: {},
    oneLand: false,
    total: 0

};

export const landscapeSlice = createSlice({
    name: 'landscape',
    initialState,

    reducers: {
        fetchInfo: (state, action) => {
            state.infoLands = action.payload
        },
        copyInfo: (state, action) => {
            state.copyInfoLands = action.payload
        },
        loadMoreDataSuccess: (state, action) => {
            state.infoLands = [...state.infoLands, ...action.payload];
        },
        fetchOptions: (state, action) => {
            state.optionsP = action.payload
        },
        returnFilters: (state, action) => {
            state.infoLands = action.payload
        },
        newOptions: (state, action) => {
            state.optionsP = action.payload
        },
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload
        },
        saveFilters: (state, action) => {
            const { pais, zona, descripcion } = action.payload
            state.currentFiltersP = {
                pais: pais.map(option => ({ id: option.id, nombre: option.nombre })),
                zonas: zona.map(option => ({ id: option.id, nombre: option.nombre })),
                ingles: descripcion.map(option => ({ id: option.id, nombre: option.nombre })),
            };
        },
        stringParameter: (state, action) => {
            state.filtersP = action.payload
        },
        searchBarResult: (state, action) => {
            state.infoLands = action.payload
        },
        resetCurrentFilters: (state) => {
            state.currentFiltersP = {
                pais: [],
                zona: [],
                descripcion: [],
            };
        },
        saveOptions: (state, action) => {
            state.saveOptionsP = action.payload
        },
        resetInfoBird: (state) => {
            state.infoLands= [],
                state.noMoreResults = true
        },
        setNoMoreResults: (state, action) => {
            state.noMoreResults = action.payload;
        },
        saveCounting: (state, action) => {
            state.count = action.payload;
        },
        copingFilters: (state, action) => {
            state.copyFiltersP = { ...state.currentFiltersP }
        },
        isOneBird: (state, action) => {
            state.oneLand = action.payload;
        },
        howMuch: (state, action) => {
            state.total = action.payload;
        },
    }
});

export const {

} = landscapeSlice.actions;
export default landscapeSlice.reducer;
