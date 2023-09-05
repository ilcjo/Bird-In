import axios from 'axios'
import { loginSuccess } from '../slices/Auth';

export const registerData = (info) => {
    return async (dispatch) => {
        try {
            const response = await axios.post('register', info)
            const data = response.data
        } catch (error) {
            console.error("Error al enviar los datos:", error)
        }
    }
};

export const loginUser = (info) => {
    return async (dispatch) => {
        try {
            const response = await axios.post('login', info)
            const data = response.data
            localStorage.setItem("token", data.token)
            localStorage.setItem("usuarioNombre", data.nombre);
            localStorage.setItem("tipoCliente", data.tipo);
        } catch (error) {
            throw error
        }
    }
};
