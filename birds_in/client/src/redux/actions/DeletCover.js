import axios from 'axios'

export const sendPhotosDelete = (ids, urls) => {
    return async (dispatch) => {
        try {
            const requestData = {
                data: {
                    ids: ids,
                    urls: urls,
                },
            };
            const response = await axios.delete('/aves/borrar_fotos', requestData)
            const data = response.data
            console.log(response.data)
        } catch (error) {
            console.error("Error al obtener los datos:", error)

        }
    };
};