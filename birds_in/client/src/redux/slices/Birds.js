import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  infoBirds: []
};

export const birdSlice = createSlice({
  name: 'bird',
  initialState,

  reducers: {
    fetchInfo: (state, action) => {
      state.infoBirds = action.payload
    },
  },
});

export const { fetchInfo } = birdSlice.actions;
export default birdSlice.reducer;