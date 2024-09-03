import { configureStore } from '@reduxjs/toolkit';
import Auth from './settings/slices/Auth';
import Custom from './settings/slices/customSlice';
import Info from './birds/slices/InfoSlice';
import Update from './birds/slices/UpdateSlice';
import land from './paisaje/slicesP/LandscapeSlice';
import createLand from './paisaje/slicesP/createLandSlice';
import OpenClose from './settings/slices/OpenClose';
import filter from './birds/slices/FilterSlice';
import data from './mamiferos/slices/InfoSlice';
import updateInfo from './mamiferos/slices/UpdateSlice';
import filters from './mamiferos/slices/FilterSlice';
import filtersRep from './reptiles/slices/FilterSlice';
import dataRep from './reptiles/slices/InfoSlice';
import updateInfoR from './reptiles/slices/UpdateSlice';

const store = configureStore({
  reducer: {
    authSlice: Auth,
    openCloseSlice: OpenClose,
    customizesSlice: Custom,
    //aves
    birdSlice: Info,
    createBird: Update,
    filterSlice: filter,
    //paisajes
    landscapeSlice: land,
    createLand: createLand,
    //mamiferos
    dataSlice: data,
    updateSlice: updateInfo,
    filters: filters,
    //reptiles
    dataReptil: dataRep,
    updateReptil: updateInfoR,
    filterRep: filtersRep,

  },
});

export default store;
