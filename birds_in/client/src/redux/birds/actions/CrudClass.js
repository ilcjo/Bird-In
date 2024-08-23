import axios from 'axios'

export const addGrupo = (info) => {
    return async (dispatch) => {
        try {
            const response = await axios.post('opciones/crearGrupos/', info)
            return response.data
        } catch (error) {
            console.log(error);
            throw error;
            // throw error.response.data;
        }
    }
};

export const updateGrupo = (info) => {

    return async (dispatch) => {
        try {
            const response = await axios.put('opciones/actualizarGrupos/', info)
            return response.data
        } catch (error) {
            console.log(error);
            throw error;
            // throw error.response.data;
        }
    }
};

export const eliminarGrupo = (id) => {

    return async (dispatch) => {
        try {
            const response = await axios.delete(`opciones/eliminarGrupos?idGrupo=${id}`)
            return response.data
        } catch (error) {
            console.log(error);
            throw error;
            // throw error.response.data;
        }
    }
};

export const addFamilia = (info) => {
    return async (dispatch) => {
        try {
            const response = await axios.post('opciones/crearFamilias/', info)
            return response.data
        } catch (error) {
            console.log(error);
            throw error;
            // throw error.response.data
        }
    }
};

export const updateFamilia = (info) => {

    return async (dispatch) => {
        try {
            const response = await axios.put('opciones/actualizarFamilias/', info)
            return response.data
        } catch (error) {
            console.log(error);
            throw error;
            // throw error.response.data;
        }
    }
};

export const eliminarFamilia = (id) => {

    return async (dispatch) => {
        try {
            const response = await axios.delete(`opciones/eliminarFamilias?idFamilia=${id}`)
            return response.data
        } catch (error) {
            console.log(error);
            throw error;
            // throw error.response.data;
        }
    }
};