import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  options: [],
  extraOptions: [],
  saveOptions: [],
  filtersOn: false,
  noMoreResults: true,
  currentFilters: { 
    grupo: [],
    familia: [],
    pais: [],
    zona: [],
    cientifico: [],
    ingles: [],
  },
  filters: '',
  copyFilters: {},
  currentPage: 0
};

export const filter = createSlice({
  name: 'filter',
  initialState,

  reducers: {

    fetchOptions: (state, action) => {
      state.options = action.payload
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
        zona: zona.map(option => ({ id: option.id, nombre: option.nombre })),
        cientifico: cientifico.map(option => ({ id: option.id, nombre: option.nombre })),
        ingles: ingles.map(option => ({ id: option.id, nombre: option.nombre })),
      };
    },
    stringParameter: (state, action) => {
      state.filters = action.payload
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
    setNoMoreResults: (state, action) => {
      state.noMoreResults = action.payload;
    },
    copingFilters: (state, action) => {
      state.copyFilters = { ...state.currentFilters }
    },
    updateFamiliaOptions: (state, action) => {
      state.extraOptions = {
        familias: action.payload.familias
      };
    },
    updateGrupoOptions: (state, action) => {
      state.extraOptions = {
        grupos: action.payload.grupos
      };
    },
  },
});

export const {
  updateFamiliaOptions,
  updateGrupoOptions,
  fetchOptions,
  newOptions,
  saveFilters,
  stringParameter,
  resetCurrentFilters,
  saveOptions,
  setNoMoreResults,
  copingFilters,
  setCurrentPage
} = filter.actions;
export default filter.reducer;