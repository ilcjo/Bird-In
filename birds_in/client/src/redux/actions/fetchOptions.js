import axios from 'axios'
import { fetchOptions, newOptions } from '../slices/BirdsSlice'


export const getOptionsData = () => {
    return async (dispatch) => {
        try {
            const response = await axios('aves/opciones')
            const data = response.data
            dispatch(fetchOptions(data))
            console.log(data)
        } catch (error) {
            console.error("Error al obtener los datos:", error)
        }
    }
};

export const fetchNewOptions = () => {
    return async (dispatch) => {
        try {
            const response = await axios('aves/nuevasOpciones');
            const data = response.data
            dispatch(newOptions(data))
        } catch (error) {
            console.log('error enviando datos:', error)
        }
    }
};