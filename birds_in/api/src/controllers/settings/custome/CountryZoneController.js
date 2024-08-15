const { Zonas } = require("../../../config/db/db");

const createZonas = async (zona, paisId) => {
    try {
        if (zona && paisId) {
            await Zonas.create({
                nombre_zona: zona,
                id_paises: paisId
            });
            return "Zona creada correctamente."
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

const updateZonas = async (idZona, zona, idPais) => {
    try {
        const existingZona = await Zonas.findOne({
            where: {
                id_zona: idZona,
            },
        });
        if (!existingZona) {
            throw new Error("La zona con el ID especificado no existe.");
        }

        const updates = {}; // Objeto para almacenar los campos que se actualizarán

        // Verifica si se proporciona un nuevo valor de nombre de zona válido y diferente
        if (zona && zona !== existingZona.nombre_zona) {
            updates.nombre_zona = zona;
        }

        // Verifica si se proporciona un nuevo valor de país válido y diferente
        if (idPais > 0 && idPais !== existingZona.id_paises) {
            updates.id_paises = idPais;
        }

        // Verifica si hay algo para actualizar
        if (Object.keys(updates).length > 0) {
            await Zonas.update(updates, {
                where: {
                    id_zona: idZona,
                },
            });
            return "Zona actualizada correctamente.";
        } else {
            return "No se proporcionaron cambios para actualizar la zona.";
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

const borrarZonas = async (idZona) => {
    try {
        // Buscar la zona que se va a eliminar
        const existingZona = await Zonas.findByPk(idZona);

        if (!existingZona) {
            throw new Error("La zona con el ID especificado no existe.");
        }
        // Eliminar las relaciones de la zona con aves
        await existingZona.setZoAves([]);

        // Eliminar la zona
        await existingZona.destroy();

        return "Zona eliminada correctamente junto con sus relaciones de aves.";
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

module.exports = {
    createZonas,
    updateZonas,
    borrarZonas,
}