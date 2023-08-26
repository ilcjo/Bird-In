import { fetchInfo, loadMoreDataSuccess } from '../slices/BirdsSlice'
import axios from 'axios'

export const getInfoBirds = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get('/aves/filtros')
      const data = response.data
      dispatch(fetchInfo(data))
    } catch (error) {
      console.error("Error al obtener los datos:", error)

    }
  }
};

export const loadMoreData = (currentPage) => {
  return async (dispatch) => {
    try {
      const perPages = 9
      const response = await axios.get(`/aves/filtros?page=${currentPage}&perPage=${perPages}`);
      const data = response.data;
      dispatch(loadMoreDataSuccess(data)); // Despacha la acción para actualizar el estado
    } catch (error) {
      console.error("Error al obtener más datos:", error);
    }
  };
};

