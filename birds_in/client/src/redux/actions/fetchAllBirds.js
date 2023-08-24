import axios from 'axios'
import { fetchInfo } from '../slices/Birds'

export const getInfoBirds = () => {
    return async (dispatch) => {
        try {
            const response = await axios.get('/aves')
            const data = response.data
            dispatch(fetchInfo(data))
        } catch (error) {
            console.error("Error al obtener los datos:", error)

        }
    }
}
