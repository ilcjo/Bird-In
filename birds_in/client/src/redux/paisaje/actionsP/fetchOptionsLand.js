import axios from 'axios'
import { createParams } from '../../../components/utils/convertId';
import { fetchOptions, newOptions, setNoMoreResults } from '../slicesP/LandscapeSlice';

export const getOptionsDataP = () => {
  return async (dispatch) => {
    try {
      const response = await axios('paisajes/opciones')
      const data = response.data
      dispatch(fetchOptions(data))
      dispatch(setNoMoreResults(true))
    } catch (error) {
      console.error("Error al obtener los datos:", error)
    }
  }
};

export const fetchNewOptionsP = (selectedOptions) => {
  return async (dispatch) => {
    try {
      const parameter = createParams(selectedOptions)
      const response = await axios(`paisajes/nuevasOpciones?${parameter}`);
      const data = response.data
      dispatch(newOptions(data))
    } catch (error) {
      console.log('error enviando datos:', error)
    }
  }
};
