
import { configureStore } from '@reduxjs/toolkit';
import OpenClose from './slices/OpenClose';
import Auth from './slices/Auth';
import Birds from './slices/BirdsSlice';
import Create from './slices/createSlice';
import customes from './slices/customeSlice'
import landscapeSlice from './paisaje/slicesP/LandscapeSlice';
import createLand from './paisaje/slicesP/createLandSlice';

const store = configureStore({
  reducer: {
    //Aves
    openCloseSlice: OpenClose,
    authSlice: Auth,
    birdSlice: Birds,
    createBird: Create,
    customizesSlice: customes,
    //Paisaje
    landscapeSlice: landscapeSlice,
    createLand: createLand
  },
});

export default store;