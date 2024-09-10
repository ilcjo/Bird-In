import axios from "axios";
import { saveUrlImage } from "../slices/UpdateSlice";

export const saveImageFtp = (formData) => {
    return async (dispatch) => {
      try {
        const response = await axios.post('insectos/upload_image', formData, {
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
    };
  };

  export const UpdateImage = (formData) => {
    return async (dispatch) => {
      try {
        const response = await axios.post('insectos/upload_image', formData, {
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
    };
  };

  
export const UpdateDestacada = (formData) => {
    return async (dispatch) => {
      try {
        const response = await axios.post('insectos/upload_destacada', formData, {
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
    };
  };

  export const sendPhotosDelete = (ids, urls) => {
    // console.log(ids, urls)
    return async (dispatch) => {
        try {
            const requestData = {
                data: {
                    ids: ids,
                    urls: urls,
                },
            };
            const response = await axios.delete('/insectos/borrar_fotos', requestData)
            const data = response.data
            // console.log(response.data)
        } catch (error) {
            console.error("Error al obtener los datos:", error)
            throw error

        }
    };
};

export const sendCoverPhoto = (id, idRegistro) => {
    // console.log('llega al axios', id, idAves)
    return async (dispatch) => {
        try {
            const requestData = {
                idFoto: id,
                idRegistro: idRegistro
            };

            const response = axios.put('/insectos/foto_portada', requestData )
            const data = response.data
            return data
        } catch (error) {
            console.error("Error al obtener los datos:", error)
            throw error

        }
    };
};
