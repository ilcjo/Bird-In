
import { configureStore } from '@reduxjs/toolkit';
import Register from './slices/Register'
import OpenClose from './slices/OpenClose';
import Auth from './slices/Auth';
import Birds from './slices/Birds';

const store = configureStore({
  reducer: {
    registerSlice: Register,
    openCloseSlice: OpenClose,
    authSlice: Auth,
    birdSlice: Birds
  },
});

export default store;