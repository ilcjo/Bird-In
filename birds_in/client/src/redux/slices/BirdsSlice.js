import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  infoBirds: [],
  currentPage: 1,
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
    }
  },
});

export const { fetchInfo, loadMoreDataSuccess } = birdSlice.actions;
export default birdSlice.reducer;