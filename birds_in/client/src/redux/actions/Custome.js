import axios from 'axios'
import { perzonalizaciones } from '../slices/customeSlice';

export const getAllCustomizes = () => {

    return async (dispatch) => {
        try {
            const response = await axios('/personalizar')
            const data = response.data
            dispatch(perzonalizaciones(data))
        } catch (error) {
            console.error("Error al obtener los datos:", error)
        }
    }
};


export const UpdateCustomizes = (formData) => {
    return async (dispatch) => {
        try {
            const response = await axios.post('/personalizar/update', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Asegúrate de establecer el tipo de contenido correcto
                },
            });
            console.log('Respuesta del servidor:', response.data);
        } catch (error) {
            console.error("Error al obtener los datos:", error.response.data)
        }
    }
};


export const UpdateCustomizesText = (text) => {
    return async (dispatch) => {
        try {
            const response = await axios.post('/personalizar/updateText', text);
            console.log('Respuesta del servidor:', response.data);
        } catch (error) {
            console.error("Error al obtener los datos:", error.response.data)
        }
    }
};