import axios from 'axios'
import { fetchOptions, newOptions, updateFamiliaOptions, updateGrupoOptions, updateOrdersOptions } from '../slices/FilterSlice';
import { createParams } from '../../../components/utils/convertId';

export const getOptionsDataM = () => {
  return async (dispatch) => {
    try {
      // console.log('llegue')
      const response = await axios('mamiferos/opciones')
      const data = response.data
      // console.log(data)
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
      const response = await axios(`/mamiferos/nuevasOpciones?${parameter}`);
      const data = response.data
      dispatch(newOptions(data))
    } catch (error) {
      console.log('error enviando datos:', error)
    }
  }
};

export const clasesFamilia = (idfamilia) => {
  // console.log('llegue', idfamilia)
  return async (dispatch) => {
    try {
      // Llamada a la API para obtener los orders basados en id
      const response = await axios.get(`mamiferos/clases?familiaID=${idfamilia}`);
      const orders = response.data.orders;
      const grupos = response.data.grupos;
      // Despachar la acción para actualizar las opciones de grupo
      dispatch(updateOrdersOptions({ orders }));
      dispatch(updateGrupoOptions({ grupos }));
      return { orders, grupos }
      // console.log(orders)
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }
};

export const clasesOrder = (id) => {
  // console.log('llegue', id)
  return async (dispatch) => {
    try {

      // Llamada a la API para obtener las familias basadas en id
      const response = await axios.get(`mamiferos/clases?orderID=${id}`);
      const familias = response.data.familias;
      const grupos = response.data.grupos;
      console.log(response.data)
      // Despachar la acción para actualizar las opciones de familia
      dispatch(updateFamiliaOptions({ familias }));
      dispatch(updateGrupoOptions({ grupos }));
      return { familias, grupos }

    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }
};

export const clasesGrupos = (id) => {
  // console.log('llegue', id)
  return async (dispatch) => {
    try {

      // Llamada a la API para obtener las familias basadas en id
      const response = await axios.get(`mamiferos/clases?grupoID=${id}`);
      const familias = response.data.familias;
      const orders = response.data.orders;
      // console.log(familias)
      // Despachar la acción para actualizar las opciones de familia
      dispatch(updateOrdersOptions({ orders }));
      dispatch(updateFamiliaOptions({ familias }));
      return { familias, orders }

    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }
};