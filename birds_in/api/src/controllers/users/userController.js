const { Usuarios } = require('../../db/db')

const saveRegister = async (email, nombre, pais, pass,) => {
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
        return { message: 'Registro exitoso. Esperando aprobación.' };
    } catch (error) {
        // Loguea el error para facilitar la depuración
        console.error('Error al registrar usuario:', error);

        // Verificar si es un error de duplicado y devolver un mensaje específico
        if (error.name === 'SequelizeUniqueConstraintError') {
            // Retornar un objeto con la propiedad 'error' sin lanzar la excepción
            return { error: 'El correo electrónico ya está registrado' };
        }

        // Re-lanzar la excepción si no es un error de duplicado
        throw error;
    }
};

const getAllUsersDb = async () => {
    try {
        const users = await Usuarios.findAll({
            where: {
                tipo: 'user',
            },
        });
        // Notificar al usuario que su registro se ha realizado correctamente.
        return users
    } catch (error) {
        // Manejar errores, por ejemplo, si no se puede crear el usuario.
        console.error('Error al registrar usuario:', error);
        return { success: false, message: 'Hubo un error en el registro. Inténtelo de nuevo más tarde.' };
    }
};


module.exports = {
    saveRegister,
    getAllUsersDb
}