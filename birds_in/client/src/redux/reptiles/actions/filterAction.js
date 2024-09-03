import axios from "axios";
import { stringParameter } from "../slices/FilterSlice";
import { howMuch, returnFilters, searchBarResult } from "../slices/InfoSlice";
import { setNoMoreResults } from "../slices/FilterSlice";
import { createParams } from "../../../components/utils/convertId";

export const sendParameter = (selectedOptions) => {
    // console.log(selectedOptions, 'soy parámetros que llegan')
    return async (dispatch) => {
        try {
            const queryParams = createParams(selectedOptions)
            // console.log(queryParams, 'soy query params')
            const response = await axios.get(`/reptiles/filtros?${queryParams}`);
            const data = response.data.registrosFiltrados;
            const result = response.data.isLastPage
            const total = response.data.totalResultsCount
            dispatch(stringParameter(queryParams))
            dispatch(returnFilters(data))
            dispatch(setNoMoreResults(result));
            dispatch(howMuch(total));
            return data.length;

        } catch (error) {
            console.log('error enviando datos:', error);
        }
    };
};

export const backInfo = (params) => {
    // console.log(params)
    return async (dispatch) => {
        try {
            const response = await axios.get(`/reptiles/filtros?${params}`);
            const data = response.data.registrosFiltrados;
            const total = response.data.totalResultsCount
            dispatch(returnFilters(data))
            dispatch(howMuch(total));
        } catch (error) {
            console.log('error enviando datos:', error);
        }
    };
};

export const searchBar = (name) => {
    return async (dispatch) => {
      try {
        const response = await axios(`reptiles/filtros?nombreIngles=${name}`)
        const result = response.data
        dispatch(searchBarResult(result))
      } catch (error) {
        console.log('error enviando datos:', error)
      }
    }
  };
