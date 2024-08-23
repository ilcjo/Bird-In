import axios from "axios";
import { getAve } from "../slices/UpdateSlice";

export const createBird = (formData) => {
    return async (dispatch) => {
      try {
        const response = await axios.post('aves/create', formData)
        // Maneja la respuesta del servidor (puede ser un mensaje de éxito o error)
        console.log('Respuesta del servidor:', response.data);
      } catch (error) {
        // Maneja los errores de la solicitud
        console.error('Error al enviar la info:', error);
        throw error;
      }
    };
  };

  export const actualizarAve = (info) => {
    return async (dispatch) => {
      try {
        const response = await axios.put('aves/update', info)
  
        // Maneja la respuesta del servidor (puede ser un mensaje de éxito o error)
        console.log('Respuesta del servidor:', response.data);
      } catch (error) {
        // Maneja los errores de la solicitud
        console.error('Error al actualizar:', error);
      }
    };
  };
  
  export const getInfoForUpdate = (id) => {
    return async (dispatch) => {
      try {
        const response = await axios(`aves/get_update?id=${id}`)
        const ave = response.data
        dispatch(getAve(ave))
        // Maneja la respuesta del servidor (puede ser un mensaje de éxito o error)
        console.log('Respuesta del servidor:');
      } catch (error) {
        // Maneja los errores de la solicitud
        console.error('Error al enviar datos:', error);
      }
    };
  };
  
  export const getInfoForUpdateName = (name) => {
    return async (dispatch) => {
      try {
        const response = await axios(`aves/get_update_name?name=${name}`)
        const ave = response.data
        dispatch(getAve(ave))
        // Maneja la respuesta del servidor (puede ser un mensaje de éxito o error)
        console.log('Respuesta del servidor:');
      } catch (error) {
        // Maneja los errores de la solicitud
        console.error('Error al enviar datos:', error);
      }
    };
  };
  
  export const duplicateNameCheck = (name) => {
    return async (dispatch) => {
      try {
        const response = await axios(`aves/duplicados?name=${name}`)
        const ave = response.data
        // Maneja la respuesta del servidor (puede ser un mensaje de éxito o error)
      } catch (error) {
        // Maneja los errores de la solicitud
        console.error('Error al enviar datos:', error);
        throw error
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

 