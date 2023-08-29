import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  infoBirds: [],
  options: [],
  filtersInfo: [],
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
    }
  },
});

export const { fetchInfo, loadMoreDataSuccess, fetchOptions, returnFilters, newOptions } = birdSlice.actions;
export default birdSlice.reducer;