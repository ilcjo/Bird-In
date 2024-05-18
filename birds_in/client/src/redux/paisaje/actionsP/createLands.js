import axios from "axios";
import { getAve, saveUrlImage } from "../../slices/createSlice";
import { getLand, saveUrlImageLand } from "../slicesP/createLandSlice";

export const saveImageFtpLand = (formData) => {
  return async (dispatch) => {
    try {
      const response = await axios.post('paisajes/upload_image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Asegúrate de establecer el tipo de contenido correcto
        },
      });
      dispatch(saveUrlImageLand(response.data.imageUrl))
      // Maneja la respuesta del servidor (puede ser un mensaje de éxito o error)
      console.log('Respuesta del servidor:', response.data);
      return response;
    } catch (error) {
      // Maneja los errores de la solicitud
      console.error('Error al enviar la imagen:', error);
    }
  }
};


export const createLand = (formData) => {
  return async (dispatch) => {
    try {
      const response = await axios.post('paisajes/create', formData)
      // Maneja la respuesta del servidor (puede ser un mensaje de éxito o error)
      console.log('Respuesta del servidor:', response.data);
    } catch (error) {
      // Maneja los errores de la solicitud
      console.error('Error al enviar la info:', error);
      throw error;
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


export const getInfoForUpdatePa = (id) => {

  return async (dispatch) => {
    try {
      const response = await axios(`paisajes/get_update?id=${id}`)
      const registro = response.data
      console.log(registro)
      dispatch(getLand(registro))
      // Maneja la respuesta del servidor (puede ser un mensaje de éxito o error)
      console.log('Respuesta del servidor:');
    } catch (error) {
      // Maneja los errores de la solicitud
      console.error('Error al enviar datos:', error);
    }
  }
};

export const getInfoForUpdateNameP = (name) => {
console.log(name)
  return async (dispatch) => {
    try {
      const response = await axios(`paisajes/get_update_name?name=${name}`)
      const registro = response.data
      dispatch(getLand(registro))
      // Maneja la respuesta del servidor (puede ser un mensaje de éxito o error)
      console.log('Respuesta del servidor:');
    } catch (error) {
      // Maneja los errores de la solicitud
      console.error('Error al enviar datos:', error);
    }
  }
};

export const duplicateNameCheckP = (id) => {

  return async (dispatch) => {
    try {
      const response = await axios(`paisajes/duplicados?zona=${id}`)
      const ave = response.data
      // Maneja la respuesta del servidor (puede ser un mensaje de éxito o error)
      
    } catch (error) {
      // Maneja los errores de la solicitud
      console.error('Error al enviar datos:', error);
      throw error
    }
  }
};


