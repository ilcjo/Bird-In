const { Grupos, Familias, Paises, Zonas } = require('../../db/db');

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
        })
        if (!existingZona) {
            throw new Error("La zona con ID especificado no existe.");
        }
        if (idPais <= 0) {
            throw new Error("El ID del país no es válido.");
        }
        // Verifica que zona sea una cadena de texto no vacía
        if (typeof zona !== 'string' || zona.trim() === '') {
            throw new Error("El nombre de la zona no es válido. Debe ser una cadena de texto no vacía.");
        }
        if (zona !== existingZona.nombre_zona ||
            idPais !== existingZona.id_paises) {

            await Zonas.update({
                nombre_zona: zona,
                id_paises: idPais
            },
                {
                    where: {
                        id_zona: idZona,
                    },
                });
            return "Zona actulizada correctamente."
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

const borrarZonas = async (idZona) => {
    console.log(idZona)
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
const createFamilias = async (familia) => {
    try {
        if (familia) {
            await Familias.create({
                nombre: familia,

            });
            return "Familia creada correctamente."
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

const updateFamilias = async (nombreF, idFamilia) => {
    try {
        const existingFamilia = await Familias.findOne({
            where: {
                id_familia: idFamilia,
            },
        })
        if (!existingFamilia) {
            throw new Error("El ID de familia especificado no existe.");
        }
        if (idFamilia <= 0) {
            throw new Error("El ID no es válido.");
        }
        // Verifica que zona sea una cadena de texto no vacía
        if (typeof nombreF !== 'string' || nombreF.trim() === '') {
            throw new Error("El nombre de la Familia no es válido. Debe ser una cadena de texto no vacía.");
        }
        if (nombreF !== existingFamilia.nombre) {

            await Familias.update({
                nombre: nombreF,
            },
                {
                    where: {
                        id_familia: idFamilia,
                    },
                });
            return "Familia actulizada correctamente."
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

const borrarFamilias = async (idZona) => {
    console.log(idZona)
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
    createFamilias,
    updateFamilias,
    borrarFamilias,
}