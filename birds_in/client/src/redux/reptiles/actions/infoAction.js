import axios from "axios";
import { fetchInfo, howMuch, loadMoreDataSuccess, saveCounting } from "../slices/InfoSlice";
import { setNoMoreResults } from "../slices/FilterSlice";

export const getInfoRegistro = () => {
    return async (dispatch) => {
        try {
            const response = await axios('reptiles/filtros')
            const data = response.data.registrosFiltrados
            dispatch(fetchInfo(data))
        } catch (error) {
            console.error("Error al obtener los datos:", error)

        }
    };
};

export const loadMoreData = (currentPage, parameters) => {
    return async (dispatch) => {
        try {
            const perPages = 18
            const response = await axios(`reptiles/filtros?${parameters}&page=${currentPage}&perPage=${perPages}`);
            const data = response.data.registrosFiltrados;
            const result = response.data.isLastPage
            const total = response.data.totalResultsCount
            dispatch(loadMoreDataSuccess(data)); // Despacha la acción para actualizar el estado
            dispatch(setNoMoreResults(result));
            dispatch(howMuch(total));
        } catch (error) {
            console.error("Error al obtener más datos:", error);
        }
    };
};

export const counting = () => {
    return async (dispatch) => {
        try {
            const response = await axios('reptiles/contando');
            const inf = response.data;
            // console.log('soy respuesta', response)
            await dispatch(saveCounting(inf))
        } catch (error) {
            console.log('error:', error);
        }
    };
};
