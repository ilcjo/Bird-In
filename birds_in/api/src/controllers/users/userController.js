const { Usuarios } = require('../../db/db');
const { sendApprovalEmail } = require('../../utils/emailService');

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

const getAllUsersDb = async (status) => {
    try {
        const users = await Usuarios.findAll({
            attributes: ['id', 'nombre', 'email', 'tipo', 'createdAt', 'status'],
            where: {
                status: status,
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

const changeApprovedStatus = async (userId) => {
    try {
        // Buscar el usuario por su ID
        const userToUpdate = await Usuarios.findByPk(userId);

        // Verificar si el usuario existe
        if (!userToUpdate) {
            throw new Error ('Usuario no encontrado.' );
        }

        // Actualizar el estado a 'approved'
        await userToUpdate.update({ status: 'approved' });
          // Enviar el correo de aprobación
        const emailResponse = await sendApprovalEmail(
            
                userToUpdate.email,
                userToUpdate.nombre,
            
        );

        // Puedes hacer algo con emailResponse si es necesario
        console.log('Correo enviado:', emailResponse);
        return 'Estado actualizado correctamente.';

    } catch (error) {
        console.error('Error al actualizar el estado del usuario:', error);
        throw error;
    }
};


const deleteCompleteU = async (userId) => {
    try {
        // Buscar el usuario por su ID
        const userToDelete = await Usuarios.findByPk(userId);

        // Verificar si el usuario existe
        if (!userToDelete) {
            throw new Error('Usuario no encontrado.');
        }

        // Eliminar el usuario de la base de datos
        await userToDelete.destroy();

        return 'Usuario eliminado correctamente.';
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        throw error;
    }
};



module.exports = {
    saveRegister,
    getAllUsersDb,
    changeApprovedStatus,
    deleteCompleteU
}