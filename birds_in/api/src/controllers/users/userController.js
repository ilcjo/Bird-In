const { Usuarios } = require('../../db/db')

const saveRegister = async (email, nombre, pais, pass, ) => {
    try {
        // Crea un nuevo usuario en la base de datos
        const newUser = await Usuarios.create({
            email,
            nombre,
            pais,
            pass,
            status: 'pending', // Establece el estado como 'pending'
            tipo: 'user'
        });

        // Notificar al usuario que su registro se ha realizado correctamente.
        return { success: true, message: 'Registro exitoso. Esperando aprobación.' };
    } catch (error) {
        // Manejar errores, por ejemplo, si no se puede crear el usuario.
        console.error('Error al registrar usuario:', error);
        return { success: false, message: 'Hubo un error en el registro. Inténtelo de nuevo más tarde.' };
    }
}

module.exports = {
    saveRegister
}