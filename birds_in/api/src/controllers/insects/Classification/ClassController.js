const { Insectos, Familias_insectos, Grupos_insectos } = require("../../../config/db/db");

const createFamilias = async (familia) => {
    try {
        if (familia) {
            await Familias_insectos.create({
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
        const existingFamilia = await Familias_insectos.findOne({
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

            await Familias_insectos.update({
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
        // Buscar todas las Insectos que tienen el ID de la familia a cambiar
        const RegistrosConIdFamilia = await Insectos.findAll({
            where: {
                familias_id_familia: idF,
            },
        });
        // Cambiar el ID de familia solo en las Insectos encontradas
        await Insectos.update(
            {
                familias_id_familia: 3, // Cambiar el ID de familia al valor 130
            },
            {
                where: {
                    familias_id_familia: idF,
                },
            }
        );

        await Familias_insectos.destroy({
            where: {
                id_familia: idF,
            },
        });

        return `Se actualizaron ${RegistrosConIdFamilia.length} Insectos al nuevo ID de familia  y Grupo a not specified.`;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

const createGrupos = async (grupo) => {
    try {
        if (grupo) {
            await Grupos_insectos.create({
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
        const existingGrupos = await Grupos_insectos.findOne({
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

            await Grupos_insectos.update({
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
        // Buscar todas las Insectos que tienen el ID de la familia a cambiar
        const RegistrosConIdGrupos = await Insectos.findAll({
            where: {
                grupos_id_grupo: idG,
            },
        });

        // Cambiar el ID de familia solo en las Insectos encontradas
        await Insectos.update(
            {
                grupos_id_grupo: 4, // Cambiar el ID de familia al valor not specified
            },
            {
                where: {
                    grupos_id_grupo: idG,
                },
            }
        );

        await Grupos_insectos.destroy({
            where: {
                id_grupo: idG,
            },
        });

        return `Se actualizaron ${RegistrosConIdGrupos.length} Insectos al nuevo ID de Grupo  y Familia a not specified.`;
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