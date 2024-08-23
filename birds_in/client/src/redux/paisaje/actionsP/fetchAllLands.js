import axios from 'axios'
// import { fetchInfo, isOneBird, loadMoreDataSuccess, saveCounting, } from '../../slices/BirdsSlice'
import { createParams } from '../../../components/utils/convertId';
import { howMuch, loadMoreDataSuccess, returnFilters, saveCounting, setNoMoreResults, stringParameter } from '../slicesP/LandscapeSlice';



export const loadMoreData = (currentPage, parameters) => {
  return async (dispatch) => {
    try {
      const perPages = 18
      const response = await axios(`/paisajes/filtros?${parameters}&page=${currentPage}&perPage=${perPages}`);
      const data = response.data.RegistrosFiltrados;
      const result = response.data.isLastPage
      dispatch(loadMoreDataSuccess(data)); // Despacha la acción para actualizar el estado
      dispatch(setNoMoreResults(result));
    } catch (error) {
      console.error("Error al obtener más datos:", error);
    }
  };
};

export const sendParameterP = (selectedOptions) => {
  // console.log(selectedOptions,'llega las opciones antes de query')
  return async (dispatch) => {
    try {
      const queryParams = createParams(selectedOptions)
      console.log(queryParams, 'queryparam que se va a enviar')
      const response = await axios.get(`/paisajes/filtros?${queryParams}`);
      const data = response.data.RegistrosFiltrados;
      const result = response.data.isLastPage
      const total = response.data.totalResults
      dispatch(stringParameter(queryParams))
      dispatch(returnFilters(data))
      dispatch(setNoMoreResults(result));
      dispatch(howMuch(total));
      return data.length;

    } catch (error) {
      console.log('error enviando datos:', error);
    }
  };
};


export const backInfo = (params) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`/aves/filtros?${params}`);
      const data = response.data.RegistrosFiltrados;
      dispatch(returnFilters(data))
    } catch (error) {
      console.log('error enviando datos:', error);
    }
  };
};

export const counting = () => {
  return async (dispatch) => {
    try {
      const response = await axios('/aves/contando');
      const inf = response.data;
      console.log('soy respuesta', response)
      await dispatch(saveCounting(inf))
    } catch (error) {
      console.log('error:', error);
    }
  };
};

export const deleteLand = (idN) => {
  return async (dispatch) => {
    try {
      const response = await axios.delete(`/paisajes/borrar_registro?id=${idN}`);
      const data = response.data;
      return data
    } catch (error) {
      console.log('error enviando datos:', error);
      throw error;
    }
  };
};



