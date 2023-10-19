import axios from 'axios'
import { allUsers, loginSuccess } from '../slices/Auth';


export const registerData = (info) => {
    return async (dispatch) => {
        try {
            const response = await axios.post('register', info)
            const data = response.data
        } catch (error) {
            console.error("Error al enviar los datos:", error)
            throw error;
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
            dispatch(loginSuccess())
        } catch (error) {
            throw error
        }
    }
};

export const getUsers = () => {
    return async (dispatch) => {
        try {
            const response = await axios('register')
            const data = response.data
            dispatch(allUsers(data))
        } catch (error) {
            console.error("Error al enviar los datos:", error)
            throw error;
        }
    }
};