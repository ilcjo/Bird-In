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
            // console.log(response.data)
        } catch (error) {
            console.error("Error al obtener los datos:", error)

        }
    };
};

export const sendCoverPhoto = (id, idAves) => {
    console.log('llega al axios', id, idAves)
    return async (dispatch) => {
        try {
            const requestData = {
                idFoto: id,
                idAve: idAves
            };

            const response = axios.put('/aves/foto_portada', requestData )
            const data = response.data
            return data
        } catch (error) {
            console.error("Error al obtener los datos:", error)

        }
    };
};
