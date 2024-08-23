import axios from 'axios'
import { getAllUsers, loginSuccess } from '../slices/Auth';

export const registerData = (info) => {
    return async (dispatch) => {
        try {
            console.log('Info antes de la solicitud:', info);

            const response = await axios.post('register', info);

            const data = response.data;
            console.log('Datos recibidos:', data);

            // Verificar la estructura de la respuesta
            if (data && data.error) {
                // Si hay un campo 'error' en la respuesta, considerarlo como un error
                console.error('Error en la respuesta del servidor:', data.error);
                throw new Error(data.error);
            } else if (data && data.message) {
                // Si hay un campo 'message', considerarlo como un mensaje exitoso
                console.log('Mensaje exitoso del servidor:', data.message);
                // Puedes hacer algo más con el mensaje si es necesario
                return data;
            } else {
                // Si la respuesta no tiene un formato esperado, manejarlo según tus necesidades
                console.error('Respuesta del servidor inesperada:', data);
                throw new Error('Respuesta inesperada del servidor');
            }
        } catch (error) {
            console.error('Error al realizar la solicitud de registro:', error);
            throw error;
        }
    };
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
            console.log('soy error', error)
            throw error
        }
    }
};

export const getUsers = (status) => {
    return async (dispatch) => {
        try {
            const response = await axios.post(`all?status=${status}`)
            const data = response.data
            dispatch(getAllUsers(data))
        } catch (error) {
            console.error("Error al enviar los datos:", error)
            throw error;
        }
    }
};

export const pendingEmail = (email, username) => {
    return async (dispatch) => {
        try {
            // Corregir la URL añadiendo el símbolo "&" y "="
            const response = await axios.get(`bienvenido?email=${email}&username=${username}`);
            const data = response.data;
        } catch (error) {
            console.error("Error al enviar los datos:", error);
            throw error;
        }
    };
};

export const approveEmail = (email, username) => {
    return async (dispatch) => {
        try {
            const response = await axios('aprobado')
            const data = response.data
        } catch (error) {
            console.error("Error al enviar los datos:", error)
            throw error;
        }
    }
};

export const verifyemail = (email) => {
    return async (dispatch) => {
        try {
            const response = await axios.post(`verificacion?email=${email}`);
            const data = response.data
            return data
        } catch (error) {
            console.error("Error al enviar los datos:", error)
            throw error;
        }
    }
};

export const statusChangeUser = (id) => {
    return async (dispatch) => {
        try {
            const response = await axios.put(`status?id=${id}`);
            const data = response.data
            return data
        } catch (error) {
            console.error("Error al enviar los datos:", error)
            throw error;
        }
    }
};

export const borrarUsuario = (id) => {
    return async (dispatch) => {
        try {
            const response = await axios.delete(`borrarUsuario?id=${id}`);
            const data = response.data
            return data
        } catch (error) {
            console.error("Error al enviar los datos:", error)
            throw error;
        }
    }
};

export const recoverPass = (email) => {
    return async (dispatch) => {
        try {
            const response = await axios.post(`recuperar?email=${email}`);
            const data = response.data
            return data
        } catch (error) {
            console.error("Error al enviar los datos:", error)
            throw error;
        }
    }
};


export const verifyToken = (token) => {
    return async (dispatch) => {
        try {
            const response = await axios.get(`verificar?token=${token}`);
            const data = response.data;
            return data
        } catch (error) {
            console.error("Error al verificar el token:", error);
            throw error;
        }
    };
}

export const changePassToken = (pass, token) => {
    return async (dispatch) => {
        try {
            const response = await axios.post(`cambio?pass=${pass}&token=${token}`);
            const data = response.data;
            return data
        } catch (error) {
            console.error("Error al verificar el token:", error);
            throw error;
        }
    };
}

export const changePassDirect = (pass, userId) => {
    return async (dispatch) => {
        try {
            const response = await axios.post(`cambioDirecto?pass=${pass}&userId=${userId}`);
            const data = response.data;
            return data
        } catch (error) {
            console.error("Error al verificar el token:", error);
            throw error;
        }
    };
}