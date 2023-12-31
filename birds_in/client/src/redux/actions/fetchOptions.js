import axios from 'axios'
import { fetchOptions, newOptions, searchBarResult, setNoMoreResults } from '../slices/BirdsSlice'
import { createParams } from '../../components/utils/convertId';

export const getOptionsData = () => {
  return async (dispatch) => {
    try {
      const response = await axios('aves/opciones')
      const data = response.data
      dispatch(fetchOptions(data))
      dispatch(setNoMoreResults(true))
    } catch (error) {
      console.error("Error al obtener los datos:", error)
    }
  }
};

export const fetchNewOptions = (selectedOptions) => {
  return async (dispatch) => {
    try {
      const parameter = createParams(selectedOptions)
      const response = await axios(`aves/nuevasOpciones?${parameter}`);
      const data = response.data
      dispatch(newOptions(data))
    } catch (error) {
      console.log('error enviando datos:', error)
    }
  }
};

export const searchBar = (name) => {
  return async (dispatch) => {
    try {
      const response = await axios(`aves/filtros?nombreIngles=${name}`)
      const result = response.data
      dispatch(searchBarResult(result))
    } catch (error) {
      console.log('error enviando datos:', error)
    }
  }
};