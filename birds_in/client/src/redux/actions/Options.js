import axios from 'axios'

export const addZona = (info) => {
    return async (dispatch) => {
        try {
            const response = await axios.post('opciones/crearZonas/', info)
            return response.data
        } catch (error) {
            // console.log(error.response.data)
            throw error.response.data;;
        }
    }
};