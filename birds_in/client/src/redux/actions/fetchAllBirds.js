import axios from 'axios'
import { fetchInfo, loadMoreDataSuccess, returnFilters, stringParameter } from '../slices/BirdsSlice'
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

export const sendParameter = (gruposIds, familiaIds, paisId, nombreIngles, nombreCientifico) => {
  return async (dispatch) => {
    try {
      let queryParams = '';

      if (gruposIds && gruposIds.length > 0) {
        queryParams += `grupo=${gruposIds.map(ave => ave.id).join('&grupo=')}`;
      }
      if (familiaIds && familiaIds.length > 0) {
        queryParams += queryParams ? '&' : '';
        queryParams += `familia=${familiaIds.map(ave => ave.id).join('&familia=')}`;
      }
      if (paisId && paisId.length > 0) {
        queryParams += queryParams ? '&' : '';
        queryParams += `pais=${paisId.map(ave => ave.id).join('&pais=')}`;
      }
      if (nombreIngles && nombreIngles.length > 0) {
        queryParams += queryParams ? '&' : '';
        queryParams += nombreIngles.map(nombre => `nombreIngles=${encodeURIComponent(nombre)}`).join('&');
      }
      if (nombreCientifico && nombreCientifico.length > 0) {
        queryParams += queryParams ? '&' : '';
        queryParams += nombreCientifico.map(nombre => `nombreCientifico=${encodeURIComponent(nombre.nombre)}`).join('&');
      }
      const response = await axios.get(`aves/filtros?${queryParams}`);
      const data = response.data;
      dispatch(stringParameter(queryParams))
      dispatch(returnFilters(data))
    } catch (error) {
      console.log('error enviando datos:', error);
    }
  };
};

// export const fetchData = (page, gruposIds, familiaIds, paisId,) => {
//   return async (dispatch) => {
//     try {
//       console.log('entrando al axios', gruposIds)
//       const currentPageNumber = page;
//       const perPages = 9;
//       let queryParams = `page=${currentPageNumber}&perPage=${perPages}`;

//       if (gruposIds && gruposIds.length > 0) {
//         queryParams += `&grupo=${gruposIds.map(ave => ave.id).join('&grupo=')}`;
//       }
//       if (familiaIds && familiaIds.length > 0) {
//         queryParams += `&familia=${familiaIds.map(ave => ave.id).join('&familia=')}`;
//       }
//       if (paisId && paisId.length > 0) {
//         queryParams += `&pais=${paisId.map(ave => ave.id).join('&pais=')}`;
//       }

//       const response = await axios(`/aves/filtros?${queryParams}`);
//       const data = response.data;
//       console.log('respuesta del axios', data)
//       dispatch(loadMoreDataSuccess(data));
//       dispatch(returnFilters(data));

//     } catch (error) {
//       console.log('error enviando/recibiendo datos:', error);
//     }
//   };
// };

