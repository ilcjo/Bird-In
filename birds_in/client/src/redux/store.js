import { configureStore } from '@reduxjs/toolkit';
import Auth from './settings/slices/Auth';
import Custom from './settings/slices/customSlice';
import Info from './birds/slices/InfoSlice';
import Update from './birds/slices/UpdateSlice';
import land from './paisaje/slicesP/LandscapeSlice';
import createLand from './paisaje/slicesP/createLandSlice';
import OpenClose from './settings/slices/OpenClose';
import filter from './birds/slices/FilterSlice';

const store = configureStore({
  reducer: {
    authSlice: Auth,
    openCloseSlice: OpenClose,
    customizesSlice: Custom,
    birdSlice: Info,
    createBird: Update,
    landscapeSlice: land,
    createLand: createLand,
    filterSlice: filter
  },
});

export default store;
