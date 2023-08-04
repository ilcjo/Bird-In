
import { configureStore } from '@reduxjs/toolkit';
import Register from './slices/Register'
import OpenClose from './slices/OpenClose';

const store = configureStore({
  reducer: {
    registerSlice: Register,
    openCloseSlice: OpenClose
  },
});

export default store;