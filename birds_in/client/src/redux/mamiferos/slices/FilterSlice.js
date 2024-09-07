import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  //familia grupo zona  y pais //filt+ create+
  options: [],
  saveOptions: [],
  filtersOn: false,
  noMoreResults: true,//filt+det+main
  currentFilters: { //filt+
    grupo: [],
    familia: [],
    pais: [],
    zona: [],
    cientifico: [],
    ingles: [],
  },
  filters: '',
  copyFilters: {},//gilt+det+main
  currentPage: 0
};

export const filters = createSlice({
  name: 'filters',
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
    saveOptionsM: (state, action) => {
      state.saveOptions = action.payload
    },
    setNoMoreResults: (state, action) => {
      state.noMoreResults = action.payload;
    },
    copingFilters: (state, action) => {
      state.copyFilters = { ...state.currentFilters }
    },
    updateFamiliaOptions: (state, action) => {
      state.options = {
        ...state.options,
        familias: action.payload.familias
      };
    },
    updateGrupoOptions: (state, action) => {
      state.options = {
        ...state.options,
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
  saveOptionsM,
  setNoMoreResults,
  copingFilters,
  setCurrentPage
} = filters.actions;
export default filters.reducer;