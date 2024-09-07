import axios from 'axios'
import { fetchOptions, newOptions, updateFamiliaOptions, updateGrupoOptions } from '../slices/FilterSlice';
import { createParams } from '../../../components/utils/convertId';

export const getOptionsData = () => {
  return async (dispatch) => {
    try {
      const response = await axios('aves/opciones')
      const data = response.data
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
      const response = await axios(`aves/nuevasOpciones?${parameter}`);
      const data = response.data
      dispatch(newOptions(data))
    } catch (error) {
      console.log('error enviando datos:', error)
    }
  }
};

export const clasesFamilia = (idfamilia) => {
  console.log('llegue', idfamilia)
  return async (dispatch) => {
    try {
      // Llamada a la API para obtener los grupos basados en idfamilia
      const response = await axios.get(`aves/clases?familiaID=${idfamilia}`);
      const grupos = response.data.grupos;

      // Despachar la acción para actualizar las opciones de grupo
      dispatch(updateGrupoOptions({ grupos }));
      return grupos
      // console.log(grupos)
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }
};

export const clasesGrupo = (idgrupo) => {
  console.log('llegue', idgrupo)
  return async (dispatch) => {
    try {

      // Llamada a la API para obtener las familias basadas en idgrupo
      const response = await axios.get(`aves/clases?grupoID=${idgrupo}`);
      const familias = response.data.familias;
      // console.log(familias)
      // Despachar la acción para actualizar las opciones de familia
      dispatch(updateFamiliaOptions({ familias }));
      return familias

    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }
};
