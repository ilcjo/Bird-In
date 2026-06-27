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
    },
    filtersP: '',
    copyFiltersP: {},
    count: {},
    oneLand: false,
    loading: false,
    total: 0,
    saltarP: false,
    isBird: false,
    isRept: false,
    isMa: false,
    isPec: false,
};

export const landscapeSlice = createSlice({
    name: 'landscape',
    initialState,

    reducers: {
        isFromBird: (state, action) => {
            state.isBird = action.payload
        },
        isFromPez: (state, action) => {
            state.isPec = action.payload
        },
        isFromMam: (state, action) => {
            state.isMa = action.payload
        },
        isSFromRept: (state, action) => {
            state.isRept = action.payload
        },
        isSaltar: (state, action) => {
            state.saltarP = action.payload
        },
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
            const { pais, zona } = action.payload
            state.currentFiltersP = {
                pais: pais.map(option => ({ id: option.id, nombre: option.nombre })),
                zona: zona.map(option => ({ id: option.id, nombre: option.nombre })),
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
            };
        },
        saveOptionsP: (state, action) => {
            state.saveOptionsP = action.payload
        },
        resetInfoLand: (state) => {
            state.infoLands = [],
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
        isOneLand: (state, action) => {
            state.oneLand = action.payload;
        },
        howMuch: (state, action) => {
            state.total = action.payload;
        },
        cargando: (state, action) => {
            state.loading = action.payload
        },
    }
});

export const {
    isFromPez, isFromBird, isFromMam, isSFromRept, isSaltar, fetchInfo, copyInfo, loadMoreDataSuccess, fetchOptions, returnFilters, newOptions, setCurrentPage, saveFilters, stringParameter, searchBarResult, resetCurrentFilters, saveOptionsP, resetInfoLand, setNoMoreResults, saveCounting, copingFilters, isOneLand, howMuch, cargando
} = landscapeSlice.actions;
export default landscapeSlice.reducer;
