import { createSlice } from "@reduxjs/toolkit"


const initialState = {
  infoBirds: [],
  options: [],
  filtersOn: false,
  currentFilters: {
    grupo: [],
    familia: [],
    paises: [],
    cientifico: [],
    ingles: [],
  },
  filters:''
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
      const { grupo, familia, paises, cientifico, ingles } = action.payload
      state.currentFilters = {
        grupo: grupo,
        familia: familia,
        paises: paises,
        cientifico: cientifico,
        ingles: ingles,
      };
  },
  stringParameter: (state, action) => {
    state.filters = action.payload
  }
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
  stringParameter
} = birdSlice.actions;
export default birdSlice.reducer;