import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  info: [],
  copyInfo: [],
  count: {},
  isOne: null,
  loading: false,
  total: 0,
  saltarP: false,
};

export const dataPeces = createSlice({
  name: 'dataPeces',
  initialState,

  reducers: {
    isSaltarPe: (state, action) => {
      state.saltarP = action.payload
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
    resetInfoPez: (state) => {
      state.info = [],
        state.noMoreResults = true
    },
    saveCounting: (state, action) => {
      state.count = action.payload;
    },
    isOneP: (state, action) => {
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
  isSaltarPe,
  setInfo,
  fetchInfo,
  copyInfo,
  loadMoreDataSuccess,
  returnFilters,
  searchBarResult,
  resetInfoPez,
  saveCounting,
  isOneP,
  howMuch,
  cargando,
} = dataPeces.actions;
export default dataPeces.reducer;