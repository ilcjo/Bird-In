
import { configureStore } from '@reduxjs/toolkit';
import Register from './slices/Register'
import OpenClose from './slices/OpenClose';
import Auth from './slices/Auth';

const store = configureStore({
  reducer: {
    registerSlice: Register,
    openCloseSlice: OpenClose,
    authSlice: Auth
  },
});

export default store;