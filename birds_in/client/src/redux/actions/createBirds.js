import axios from "axios";
import { getAve, saveUrlImage } from "../slices/createSlice";

export const saveImageFtp = (formData) => {
  return async (dispatch) => {
    try {
      const response = await axios.post('aves/upload_image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Asegúrate de establecer el tipo de contenido correcto
        },
      });
      dispatch(saveUrlImage(response.data.imageUrl))
      // Maneja la respuesta del servidor (puede ser un mensaje de éxito o error)
      console.log('Respuesta del servidor:', response.data);
      return response;
    } catch (error) {
      // Maneja los errores de la solicitud
      console.error('Error al enviar la imagen:', error);
    }
  }
};


export const createBird = (formData) => {

  return async (dispatch) => {
    try {
      const response = await axios.post('aves/create', formData)

      // Maneja la respuesta del servidor (puede ser un mensaje de éxito o error)
      console.log('Respuesta del servidor:', response.data);
    } catch (error) {
      // Maneja los errores de la solicitud
      console.error('Error al enviar la info:', error);
    }
  }
};

export const UpdateAveImage = (formData) => {
  return async (dispatch) => {
    try {
      const response = await axios.post('aves/upload_image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Asegúrate de establecer el tipo de contenido correcto
        },
      });
      // Maneja la respuesta del servidor (puede ser un mensaje de éxito o error)
      console.log('Respuesta del servidor:', response.data);
      return response;
    } catch (error) {
      // Maneja los errores de la solicitud
      console.error('Error al enviar la imagen:', error);
    }
  }
};

export const UpdateAveDestacada = (formData) => {
  return async (dispatch) => {
    try {
      const response = await axios.post('aves/upload_destacada', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Asegúrate de establecer el tipo de contenido correcto
        },
      });
      // Maneja la respuesta del servidor (puede ser un mensaje de éxito o error)
      console.log('Respuesta del servidor:', response.data);
      return response;
    } catch (error) {
      // Maneja los errores de la solicitud
      console.error('Error al enviar la imagen:', error);
    }
  }
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
  }
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
  }
};


