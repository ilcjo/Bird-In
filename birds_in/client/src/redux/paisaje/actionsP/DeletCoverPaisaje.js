import axios from 'axios'

export const sendPhotosDeleteP = (ids, urls) => {
    return async (dispatch) => {
        try {
            const requestData = {
                data: {
                    ids: ids,
                    urls: urls,
                },
            };
            const response = await axios.delete('/paisajes/borrar_fotos', requestData)
            const data = response.data
            // console.log(response.data)
        } catch (error) {
            console.error("Error al obtener los datos:", error)
            throw error;
        }
    };
};

export const sendCoverPhotoP = (id, idPaisaje) => {
    console.log('llega al axios', id, idPaisaje)
    return async (dispatch) => {
        try {
            const requestData = {
                idFoto: id,
                idPaisaje: idPaisaje
            };

            const response = axios.put('/paisajes/foto_portada', requestData )
            const data = response.data
            return data
        } catch (error) {
            console.error("Error al obtener los datos:", error)

        }
    };
};
