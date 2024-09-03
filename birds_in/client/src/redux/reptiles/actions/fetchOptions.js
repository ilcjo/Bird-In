import axios from 'axios'
import { fetchOptions, newOptions } from '../slices/FilterSlice';
import { createParams } from '../../../components/utils/convertId';

export const getOptionsDataR = () => {
  return async (dispatch) => {
    try {
      // console.log('llegue')
      const response = await axios('reptiles/opciones')
      const data = response.data
      console.log(data)
      dispatch(fetchOptions(data))
      // dispatch(setNoMoreResults(true))
    } catch (error) {
      console.error("Error al obtener los datos:", error)
    }
  }
};

export const fetchNewOptions = (selectedOptions) => {
  return async (dispatch) => {
    try {
      const parameter = createParams(selectedOptions)
      const response = await axios(`/reptiles/nuevasOpciones?${parameter}`);
      const data = response.data
      dispatch(newOptions(data))
    } catch (error) {
      console.log('error enviando datos:', error)
    }
  }
};

