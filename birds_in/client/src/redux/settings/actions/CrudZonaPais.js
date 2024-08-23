import axios from 'axios'

export const addZona = (info) => {
    return async (dispatch) => {
        try {
            const response = await axios.post('geo/crearZonas/', info)
            return response.data
        } catch (error) {
            console.log(error);
            throw error;
            // throw error.response.data;
        }
    }
};


export const updateZona = (info) => {

    return async (dispatch) => {
        try {
            const response = await axios.put('geo/actualizarZonas/', info)
            return response.data
        } catch (error) {
            console.log(error);
            throw error;
            // throw error.response.data;
        }
    }
};

export const eliminarZona = (idZona) => {

    return async (dispatch) => {
        try {
            const response = await axios.delete(`geo/eliminarZonas?idZona=${idZona}`)
            return response.data
        } catch (error) {
            console.log(error);
            throw error;
            // throw error.response.data;
        }
    }
};

