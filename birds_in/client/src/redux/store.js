
import { configureStore } from '@reduxjs/toolkit';
import OpenClose from './slices/OpenClose';
import Auth from './slices/Auth';
import Birds from './slices/BirdsSlice';
import Create from './slices/createSlice';
import customes from './slices/customeSlice'
import landscape from './slices/LandscapeSlice';

const store = configureStore({
  reducer: {
    openCloseSlice: OpenClose,
    authSlice: Auth,
    birdSlice: Birds,
    createBird: Create,
    customizesSlice: customes,
    landscapeSlice: landscape
  },
});

export default store;