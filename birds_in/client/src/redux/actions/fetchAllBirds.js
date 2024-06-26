import axios from 'axios'
import { fetchInfo, fetchLength, isOneBird, loadMoreDataSuccess, returnFilters, saveCounting, setNoMoreResults, stringParameter } from '../slices/BirdsSlice'
import { createParams } from '../../components/utils/convertId';



export const getInfoBirds = () => {
  return async (dispatch) => {
    try {
      const response = await axios('/aves/filtros')
      const data = response.data.avesFiltradas
      dispatch(fetchInfo(data))
      
    } catch (error) {
      console.error("Error al obtener los datos:", error)

    }
  };
};

export const loadMoreData = (currentPage, parameters) => {
  return async (dispatch) => {
    try {
      const perPages = 18
      const response = await axios(`/aves/filtros?${parameters}&page=${currentPage}&perPage=${perPages}`);
      const data = response.data.avesFiltradas;
      const result = response.data.isLastPage
      dispatch(loadMoreDataSuccess(data)); // Despacha la acción para actualizar el estado
      dispatch(setNoMoreResults(result));
    } catch (error) {
      console.error("Error al obtener más datos:", error);
    }
  };
};

export const sendParameter = (selectedOptions) => {
  return async (dispatch) => {
    try {
      const queryParams = createParams(selectedOptions)
      const response = await axios.get(`/aves/filtros?${queryParams}`);
      const data = response.data.avesFiltradas;
      const result = response.data.isLastPage;
      const lenghtResult = response.data.totalResultsClausula
      dispatch(fetchLength(lenghtResult))
      dispatch(stringParameter(queryParams))
      dispatch(returnFilters(data))
      dispatch(setNoMoreResults(result));
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
      const data = response.data.avesFiltradas;
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

export const deleteBird = (idN) => {
  return async (dispatch) => {
    try {
      const response = await axios.delete(`/aves/borrar_ave?id=${idN}`);
      const data = response.data;
      return data
    } catch (error) {
      console.log('error enviando datos:', error);
    }
  };
};


// export const getCompleteBirds = () => {
//   return async (dispatch) => {
//     try {
//       const response = await axios('/aves/filtros?page=0&perPage=0')
//       const data = response.data
//       console.log(response.data)
//       dispatch(safeCompleteDataBids(data))
//     } catch (error) {
//       console.error("Error al obtener los datos:", error)

//     }
//   };
// };
