const { Aves, Familias, Grupos } = require("../../../config/db/db");

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
            return "Familia actualizada correctamente."
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

const borrarFamilias = async (idF) => {
    try {
        // Buscar todas las aves que tienen el ID de la familia a cambiar
        const avesConIdFamilia = await Aves.findAll({
            where: {
                familias_id_familia: idF,
            },
        });

        // Cambiar el ID de familia solo en las aves encontradas
        await Aves.update(
            {
                familias_id_familia: 130, // Cambiar el ID de familia al valor 130
            },
            {
                where: {
                    familias_id_familia: idF,
                },
            }
        );

        await Familias.destroy({
            where: {
                id_familia: idF,
            },
        });

        return `Se actualizaron ${avesConIdFamilia.length} aves al nuevo ID de familia  y Grupo a not specified.`;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

const createGrupos = async (grupo) => {
    try {
        if (grupo) {
            await Grupos.create({
                nombre: grupo,

            });
            return "Grupo creado correctamente."
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

const updateGrupo = async (nombreG, idGrupo) => {
    try {
        const existingGrupos = await Grupos.findOne({
            where: {
                id_grupo: idGrupo,
            },
        })
        if (!existingGrupos) {
            throw new Error("El ID de Grupo especificado no existe.");
        }
        if (idGrupo <= 0) {
            throw new Error("El ID no es válido.");
        }
        // Verifica que zona sea una cadena de texto no vacía
        if (typeof nombreG !== 'string' || nombreG.trim() === '') {
            throw new Error("El nombre de la Grupo no es válido. Debe ser una cadena de texto no vacía.");
        }
        if (nombreG !== existingGrupos.nombre) {

            await Grupos.update({
                nombre: nombreG,
            },
                {
                    where: {
                        id_grupo: idGrupo,
                    },
                });
            return "Grupo actualizado correctamente."
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

const borrarGrupos = async (idG) => {
    try {
        // Buscar todas las aves que tienen el ID de la familia a cambiar
        const avesConIdGrupos = await Aves.findAll({
            where: {
                grupos_id_grupo: idG,
            },
        });

        // Cambiar el ID de familia solo en las aves encontradas
        await Aves.update(
            {
                grupos_id_grupo: 161, // Cambiar el ID de familia al valor 130
            },
            {
                where: {
                    grupos_id_grupo: idG,
                },
            }
        );

        await Grupos.destroy({
            where: {
                id_grupo: idG,
            },
        });

        return `Se actualizaron ${avesConIdGrupos.length} aves al nuevo ID de Grupo  y Familia a not specified.`;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};


module.exports = {
    createFamilias,
    updateFamilias,
    borrarFamilias,
    createGrupos,
    updateGrupo,
    borrarGrupos,
}