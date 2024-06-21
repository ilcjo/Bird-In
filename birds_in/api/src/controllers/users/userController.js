const { Usuarios, Token } = require('../../db/db');
const { sendApprovalEmail } = require('../../utils/emailService');
const { format } = require('date-fns');
const bcrypt = require('bcrypt');

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
            order: [['nombre', 'ASC']], // Ordenar por nombre en orden ascendente (alfabético)
        });
        // Formatear la fecha createdAt para que solo muestre la parte de la fecha
        const usersWithFormattedDate = users.map(user => ({
            ...user.dataValues,
            createdAt: format(new Date(user.createdAt), 'yyyy-MM-dd') // Formatear la fecha
        }));

        // Notificar al usuario que su registro se ha realizado correctamente.
        return usersWithFormattedDate;
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
            throw new Error('Usuario no encontrado.');
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
const verifyTokenDb = async (token) => {
    try {
        const tokenRecord = await Token.findOne({ where: { token: token } });

        if (!tokenRecord) {
            return 'Token inválido';
        }

        if (tokenRecord.expiresAt < new Date()) {
            return 'Token expirado';
        }

        return tokenRecord;
    } catch (error) {
        throw new Error(error.message); // Lanzar el error para manejarlo en el contexto donde se llama
    }
};

const saveTokenToDatabase = async (token, email) => {
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos a partir de ahora

    await Token.create({
        token: token,
        email: email,
        expiresAt: expiresAt,
        used: false
    });
};

const updatePass = async (pass, token) => {
    try {
        // Buscar el token en la base de datos
        const tokenRecord = await Token.findOne({ where: { token: token } });

        if (!tokenRecord) {
            throw new Error('Token no encontrado');
        }

        // Obtener el correo electrónico del tokenRecord
        const userEmail = tokenRecord.email;

        // Buscar al usuario en la base de datos de usuarios
        const userRecord = await Usuarios.findOne({ where: { email: userEmail } });

        if (!userRecord) {
            throw new Error('Usuario no encontrado');
        }
        // Actualizar la contraseña del usuario
        userRecord.pass = hashPassword(pass);

        // Guardar los cambios en la base de datos
        await userRecord.save();

        return { message: 'Contraseña actualizada correctamente' };
    } catch (error) {
        throw new Error(error.message); // Lanzar el error para manejarlo en el contexto donde se llama
    }
};


module.exports = {
    saveRegister,
    getAllUsersDb,
    changeApprovedStatus,
    deleteCompleteU,
    verifyTokenDb,
    saveTokenToDatabase,
    updatePass
}