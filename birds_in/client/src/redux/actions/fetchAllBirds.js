import axios from 'axios'
import { fetchInfo, loadMoreDataSuccess, returnFilters, stringParameter } from '../slices/BirdsSlice'
import { creatParams } from '../../components/utils/convertId';



export const getInfoBirds = () => {
  return async (dispatch) => {
    try {
      const response = await axios('/aves/filtros')
      const data = response.data
      console.log(response.data)
      dispatch(fetchInfo(data))
    } catch (error) {
      console.error("Error al obtener los datos:", error)

    }
  };
};

export const loadMoreData = (currentPage, parameters) => {
  return async (dispatch) => {
    try {
      const perPages = 9
      const response = await axios(`/aves/filtros?${parameters}&page=${currentPage}&perPage=${perPages}`);
      const data = response.data;
      dispatch(loadMoreDataSuccess(data)); // Despacha la acción para actualizar el estado
    } catch (error) {
      console.error("Error al obtener más datos:", error);
    }
  };
};

export const sendParameter = (selectedOptions) => {
  return async (dispatch) => {
    try {
      const queryParams = creatParams(selectedOptions)
      const response = await axios.get(`aves/filtros?${queryParams}`);
      const data = response.data;
      dispatch(stringParameter(queryParams))
      dispatch(returnFilters(data))
    } catch (error) {
      console.log('error enviando datos:', error);
    }
  };
};


