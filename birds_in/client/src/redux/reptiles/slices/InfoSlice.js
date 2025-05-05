import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  info: [],
  copyInfo: [],
  count: {},
  isOne: null,
  loading: false,
  total: 0,
  saltar: false,
};

export const dataRep = createSlice({
  name: 'dataRep',
  initialState,

  reducers: {
    isSaltarRept: (state, action) => {
      state.saltar = action.payload
    },
    setInfo(state, action) {
      state.info = action.payload;
    },
    fetchInfo: (state, action) => {
      state.info = action.payload
    },
    copyInfo: (state, action) => {
      state.copyInfo = action.payload
    },
    loadMoreDataSuccess: (state, action) => {
      state.info = [...state.info, ...action.payload];
    },
    returnFilters: (state, action) => {
      state.info = action.payload
    },
    searchBarResult: (state, action) => {
      state.info = action.payload
    },
    resetInfo: (state) => {
      state.info = [],
        state.noMoreResults = true
    },
    saveCounting: (state, action) => {
      state.count = action.payload;
    },
    isOneR: (state, action) => {
      state.isOne = action.payload;
    },
    howMuch: (state, action) => {
      state.total = action.payload;
    },
    cargando: (state, action) => {
      state.loading = action.payload
    },
  },
});

export const {
  isSaltarRept,
  setInfo,
  fetchInfo,
  copyInfo,
  loadMoreDataSuccess,
  returnFilters,
  searchBarResult,
  resetInfo,
  saveCounting,
  isOneR,
  howMuch,
  cargando,
} = dataRep.actions;
export default dataRep.reducer;