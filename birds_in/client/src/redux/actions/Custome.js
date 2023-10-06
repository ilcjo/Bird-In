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


export const UpdateCustomizes = (params) => {
    
    return async (dispatch) => {
        try {
            const response = await axios('/personalizar', params)
            const data = response.data
            dispatch(perzonalizaciones(data))
        } catch (error) {
            console.error("Error al obtener los datos:", error)
        }
    }
};
