import axios from 'axios'
import { fetchOptions, newOptions } from '../slices/BirdsSlice'


export const getOptionsData = () => {
    return async (dispatch) => {
        try {
            const response = await axios('aves/opciones')
            const data = response.data
            dispatch(fetchOptions(data))
        } catch (error) {
            console.error("Error al obtener los datos:", error)
        }
    }
};

export const fetchNewOptions = (gruposIds, familiaIds, paisId, nombreIngles, nombreCientifico) => {
    return async (dispatch) => {
        try {
           
            let queryParams = '';

            if (gruposIds && gruposIds.length > 0) {
              queryParams += `grupo=${gruposIds.map(ave => ave.id).join('&grupo=')}`;
            }
            if (familiaIds && familiaIds.length > 0) {
              queryParams += queryParams ? '&' : '';
              queryParams += `familia=${familiaIds.map(ave => ave.id).join('&familia=')}`;
            }
            if (paisId && paisId.length > 0) {
              queryParams += queryParams ? '&' : '';
              queryParams += `pais=${paisId.map(ave => ave.id).join('&pais=')}`;
            }
            if (nombreIngles && nombreIngles.length > 0) {
              queryParams += queryParams ? '&' : '';
              queryParams += nombreIngles.map(nombre => `nombreIngles=${encodeURIComponent(nombre)}`).join('&');
            }
            if (nombreCientifico && nombreCientifico.length > 0) {
              queryParams += queryParams ? '&' : '';
              queryParams += nombreCientifico.map(nombre => `nombreCientifico=${encodeURIComponent(nombre.nombre)}`).join('&');
            }
            const response = await axios(`aves/nuevasOpciones?${queryParams}`);
            const data = response.data
            dispatch(newOptions(data))
        } catch (error) {
            console.log('error enviando datos:', error)
        }
    }
};