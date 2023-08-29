import axios from 'axios'
import { createIdString } from '../../components/utils/convertId';
import { fetchInfo, loadMoreDataSuccess, returnFilters } from '../slices/BirdsSlice'
import { fetchNewOptions } from './fetchOptions';

export const getInfoBirds = () => {
  return async (dispatch) => {
    try {
      const response = await axios('/aves/filtros')
      const data = response.data
      dispatch(fetchInfo(data))
    } catch (error) {
      console.error("Error al obtener los datos:", error)

    }
  };
};

export const loadMoreData = (currentPage) => {
  return async (dispatch) => {
    try {
      const perPages = 9
      const response = await axios(`/aves/filtros?page=${currentPage}&perPage=${perPages}`);
      const data = response.data;
      dispatch(loadMoreDataSuccess(data)); // Despacha la acción para actualizar el estado
    } catch (error) {
      console.error("Error al obtener más datos:", error);
    }
  };
};

export const sendParameter = (gruposIds, familiaIds, paisId) => {
  return async (dispatch) => {
    try {
      let queryParams = '';

      if (gruposIds && gruposIds.length > 0) {
        console.log(gruposIds)
        queryParams += `grupo=${gruposIds.map(ave => ave.id).join('&grupo=')}`;
      }
      if (familiaIds && familiaIds.length > 0) {
        console.log(familiaIds)
        queryParams += queryParams ? '&' : '';
        queryParams += `familia=${familiaIds.map(ave => ave.id).join('&familia=')}`;
      }
      if (paisId && paisId.length > 0) {
        console.log(paisId)
        queryParams += queryParams ? '&' : '';
        queryParams += `pais=${paisId.map(ave => ave.id).join('&pais=')}`;
      }

      const response = await axios.get(`aves/filtros?${queryParams}`);
      const data = response.data;
      console.log(data)
      dispatch(returnFilters(data));
    } catch (error) {
      console.log('error enviando datos:', error);
    }
  };
};

// export const sendParameter = (gruposId, familiaId, paisId) => {
//   return async (dispatch) => {
//     console.log('soy id pais', paisId)
//     try {
//       const convertIdString = createIdString(gruposId)
//       const convertIdFamiliaString = createIdString(familiaId)
//       const convertIdpaiseString = createIdString(paisId)
//       console.log('convertidoStringpais', convertIdpaiseString)
//       const response = await axios.get(`aves/filtros?grupo=${convertIdString}&familia=${convertIdFamiliaString}&pais=${convertIdpaiseString}`);
//       const data = response.data
//       console.log('informacion recibida', data)
//       dispatch(fetchNewOptions(data))
//       dispatch(returnFilters(data))
//     } catch (error) {
//       console.log('error enviando datos:', error)

//     }
//   };
// };