import axios from "axios";


export const createBirdData = (formData) => {
    return async (dispatch) => {
        try {
            const response = await axios.post('aves/upload_image', formData, {
                headers: {
                  'Content-Type': 'multipart/form-data', // Asegúrate de establecer el tipo de contenido correcto
                },
            });
          
          // Maneja la respuesta del servidor (puede ser un mensaje de éxito o error)
          console.log('Respuesta del servidor:', response.data);
        } catch (error) {
          // Maneja los errores de la solicitud
          console.error('Error al enviar la imagen:', error);
        }
    }
};