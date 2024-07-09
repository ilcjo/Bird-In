import axios from 'axios'
import { fetchInfo, howMuch, isOneBird, loadMoreDataSuccess, returnFilters, saveCounting, setNoMoreResults, stringParameter } from '../slices/BirdsSlice'
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
      const total = response.data.totalResultsCount
      dispatch(loadMoreDataSuccess(data)); // Despacha la acción para actualizar el estado
      dispatch(setNoMoreResults(result));
      dispatch(howMuch(total));
    } catch (error) {
      console.error("Error al obtener más datos:", error);
    }
  };
};

export const sendParameter = (selectedOptions) => {
  // console.log(selectedOptions, 'soy parametros que llegan')
  return async (dispatch) => {
    try {
      const queryParams = createParams(selectedOptions)
      // console.log(queryParams, 'soy queryparams')
      const response = await axios.get(`/aves/filtros?${queryParams}`);
      const data = response.data.avesFiltradas;
      const result = response.data.isLastPage
      const total = response.data.totalResultsCount
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
      const data = response.data.avesFiltradas;
      const total = response.data.totalResultsCount
      dispatch(returnFilters(data))
      dispatch(howMuch(total));
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
      throw error;

    }
  };
};

export const getExcelAves = () => async (dispatch) => {
  try {
    const response = await axios.get('/aves/descargar-excel-aves', {
      responseType: 'blob', // Importante para recibir el archivo como blob
    });

    // Crear un enlace para descargar el archivo
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'aves.xlsx'); // nombre del archivo
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error('Error al descargar el archivo Excel:', error);
  }
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
