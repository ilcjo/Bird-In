import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  infoBirds: [],//det+main
  copyInfoBirds: [],
  count: {},
  oneBird: null,//filt+det
  loading: false,//filt+
  total: 0,
};

export const info = createSlice({
  name: 'info',
  initialState,

  reducers: {
    setBirdInfo(state, action) {
      state.infoBirds = action.payload;
    },
    fetchInfo: (state, action) => {
      state.infoBirds = action.payload
    },
    copyInfo: (state, action) => {
      state.copyInfoBirds = action.payload
    },
    loadMoreDataSuccess: (state, action) => {
      state.infoBirds = [...state.infoBirds, ...action.payload];
    },
    returnFilters: (state, action) => {
      state.infoBirds = action.payload
    },
    // setCurrentPage: (state, action) => {
    //   state.currentPage = action.payload
    // },

    searchBarResult: (state, action) => {
      state.infoBirds = action.payload
    },
    resetInfoBird: (state) => {
      state.infoBirds = [],
        state.noMoreResults = true
    },
    saveCounting: (state, action) => {
      state.count = action.payload;
    },
    isOneBird: (state, action) => {
      state.oneBird = action.payload;
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
  setBirdInfo,
  fetchInfo,
  copyInfo,
  loadMoreDataSuccess,
  returnFilters,
  searchBarResult,
  resetInfoBird,
  saveCounting,
  isOneBird,
  howMuch,
  cargando,
} = info.actions;
export default info.reducer;