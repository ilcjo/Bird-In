import axios from "axios";
import { getRegistro } from "../slices/UpdateSlice";

export const createRegistro = (formData) => {
  return async (dispatch) => {
    try {
      const response = await axios.post('reptiles/create', formData)
      // Maneja la respuesta del servidor (puede ser un mensaje de éxito o error)
      console.log('Respuesta del servidor:', response.data);
    } catch (error) {
      // Maneja los errores de la solicitud
      console.error('Error al enviar la info:', error);
      throw error;
    }
  };
};

export const actualizarRegistro = (info) => {
  return async (dispatch) => {
    try {
      const response = await axios.put('reptiles/update', info)

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
      const response = await axios(`reptiles/get_update?id=${id}`)
      const registro = response.data
      dispatch(getRegistro(registro))
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
      const response = await axios(`reptiles/get_update_name?name=${name}`)
      const registro = response.data
      dispatch(getRegistro(registro))
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
      const response = await axios(`reptiles/duplicados?name=${name}`)
      const registro = response.data
      // Maneja la respuesta del servidor (puede ser un mensaje de éxito o error)
    } catch (error) {
      // Maneja los errores de la solicitud
      console.error('Error al enviar datos:', error);
      throw error
    }
  };
};

export const deleteRegistro = (idN) => {
  return async (dispatch) => {
    try {
      const response = await axios.delete(`/reptiles/borrar_registro?id=${idN}`);
      const data = response.data;
      return data
    } catch (error) {
      console.log('error enviando datos:', error);
      throw error;

    }
  };
};

export const getExcel = () => async (dispatch) => {
  try {
    const response = await axios.get('/reptiles/descargar-excel-reptiles', {
      responseType: 'blob', // Importante para recibir el archivo como blob
    });

    // Crear un enlace para descargar el archivo
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'reptiles.xlsx'); // nombre del archivo
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error('Error al descargar el archivo Excel:', error);
  }
};

