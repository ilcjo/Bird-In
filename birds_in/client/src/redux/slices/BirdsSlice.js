import { createSlice } from "@reduxjs/toolkit"


const initialState = {
  infoBirds: [],
  options: [],
  saveOptions: [],
  filtersOn: false,
  currentFilters: {
    grupo: [],
    familia: [],
    pais: [],
    zona: [],
    cientifico: [],
    ingles: [],
  },
  filters: ''
};

export const birdSlice = createSlice({
  name: 'bird',
  initialState,

  reducers: {
    fetchInfo: (state, action) => {
      state.infoBirds = action.payload
    },
    loadMoreDataSuccess: (state, action) => {
      state.infoBirds = [...state.infoBirds, ...action.payload];
    },
    fetchOptions: (state, action) => {
      state.options = action.payload
    },
    returnFilters: (state, action) => {
      state.infoBirds = action.payload
    },
    newOptions: (state, action) => {
      state.options = action.payload
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload
    },
    saveFilters: (state, action) => {
      const { grupo, familia, pais, cientifico, ingles, zona } = action.payload
      state.currentFilters = {
        grupo: grupo.map(option => ({ id: option.id, nombre: option.nombre })),
        familia: familia.map(option => ({ id: option.id, nombre: option.nombre })),
        pais: pais.map(option => ({ id: option.id, nombre: option.nombre })),
        zonas: zona.map(option => ({ id: option.id, nombre: option.nombre })),
        cientifico: cientifico.map(option => ({ id: option.id, nombre: option.nombre })),
        ingles: ingles.map(option => ({ id: option.id, nombre: option.nombre })),
      };
    },
    stringParameter: (state, action) => {
      state.filters = action.payload
    },
    searchBarResult: (state, action) => {
      state.infoBirds = action.payload
    },
    resetCurrentFilters: (state) => {
      state.currentFilters = {
        grupo: [],
        familia: [],
        pais: [],
        zona: [],
        cientifico: [],
        ingles: [],
      };
    },
    saveOptions: (state, action) => {
      state.saveOptions = action.payload
    },
  },
});

export const {
  fetchInfo,
  loadMoreDataSuccess,
  fetchOptions,
  returnFilters,
  newOptions,
  setCurrentPage,
  saveFilters,
  stringParameter,
  searchBarResult,
  resetCurrentFilters,
  saveOptions
} = birdSlice.actions;
export default birdSlice.reducer;