import axios from "axios";
import { saveUrlImage } from "../slices/createSlice";


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
        console.error('Error al enviar la imagen:', error);
      }
  }
};


export const UpdateBird = (formData) => {

  return async (dispatch) => {
      try {
          const response = await axios.post('aves/update', formData)
        
        // Maneja la respuesta del servidor (puede ser un mensaje de éxito o error)
        console.log('Respuesta del servidor:', response.data);
      } catch (error) {
        // Maneja los errores de la solicitud
        console.error('Error al enviar la imagen:', error);
      }
  }
};

