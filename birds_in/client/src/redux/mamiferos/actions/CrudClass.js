import axios from 'axios'

export const addGrupo = (info) => {
    return async (dispatch) => {
        try {
            const response = await axios.post('mamiferos/clasificacion/crearGrupos/', info)
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
            const response = await axios.put('mamiferos/clasificacion/actualizarGrupos/', info)
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
            const response = await axios.delete(`mamiferos/clasificacion/eliminarGrupos?idGrupo=${id}`)
            return response.data
        } catch (error) {
            console.log(error);
            throw error;
            // throw error.response.data;
        }
    }
};

export const addOrden = (info) => {
    return async (dispatch) => {
        try {
            const response = await axios.post('mamiferos/clasificacion/crearOrden/', info)
            return response.data
        } catch (error) {
            console.log(error);
            throw error;
            // throw error.response.data;
        }
    }
};

export const updateOrden = (info) => {

    return async (dispatch) => {
        try {
            const response = await axios.put('mamiferos/clasificacion/actualizarOrden/', info)
            return response.data
        } catch (error) {
            console.log(error);
            throw error;
            // throw error.response.data;
        }
    }
};

export const eliminarOrden = (id) => {

    return async (dispatch) => {
        try {
            const response = await axios.delete(`mamiferos/clasificacion/eliminarOrden?idGrupo=${id}`)
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
            const response = await axios.post('mamiferos/clasificacion/crearFamilias/', info)
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
            const response = await axios.put('mamiferos/clasificacion/actualizarFamilias/', info)
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
            const response = await axios.delete(`mamiferos/clasificacion/eliminarFamilias?idFamilia=${id}`)
            return response.data
        } catch (error) {
            console.log(error);
            throw error;
            // throw error.response.data;
        }
    }
};

export const checkDuplicadosGrupo = (nameg) => {
    return async (dispatch) => {
        try {
            const response = await axios.get(`/mamiferos/gruposFamilias?grupoName=${nameg}`);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };
};


export const checkDuplicadosOrden = (nameg) => {
    console.log(nameg, 'soy le nombre que envio')
    return async (dispatch) => {
        try {
            const response = await axios.get(`/mamiferos/gruposFamilias?ordenName=${nameg}`);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };
};

export const checkDuplicadosFamilia = (namef) => {
    return async (dispatch) => {
        try {
            const response = await axios.get(`/mamiferos/gruposFamilias?familiaName=${namef}`);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };
};
