const { Reptiles, Familias_reptiles, Grupos_reptiles, Order_reptiles } = require("../../../config/db/db");

const createFamilias = async (familia) => {
    try {
        if (familia) {
            await Familias_reptiles.create({
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
        const existingFamilia = await Familias_reptiles.findOne({
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

            await Familias_reptiles.update({
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
        // Buscar todas las Reptiles que tienen el ID de la familia a cambiar
        const RegistrosConIdFamilia = await Reptiles.findAll({
            where: {
                familias_id_familia: idF,
            },
        });
        // Cambiar el ID de familia solo en las Reptiles encontradas
        await Reptiles.update(
            {
                familias_id_familia: 3, // Cambiar el ID de familia al valor 130
            },
            {
                where: {
                    familias_id_familia: idF,
                },
            }
        );

        await Familias_reptiles.destroy({
            where: {
                id_familia: idF,
            },
        });

        return `Se actualizaron ${RegistrosConIdFamilia.length} Reptiles al nuevo ID de familia  y Grupo a not specified.`;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

const createGrupos = async (grupo) => {
    console.log('que llegi:', grupo )
    try {
        if (grupo) {
            await Grupos_reptiles.create({
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
        const existingGrupos = await Grupos_reptiles.findOne({
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

            await Grupos_reptiles.update({
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
        // Buscar todas las Reptiles que tienen el ID de la familia a cambiar
        const RegistrosConIdGrupos = await Reptiles.findAll({
            where: {
                grupos_id_grupo: idG,
            },
        });

        // Cambiar el ID de familia solo en las Reptiles encontradas
        await Reptiles.update(
            {
                grupos_id_grupo: 4, // Cambiar el ID de familia al valor not specified
            },
            {
                where: {
                    grupos_id_grupo: idG,
                },
            }
        );

        await Grupos_reptiles.destroy({
            where: {
                id_grupo: idG,
            },
        });

        return `Se actualizaron ${RegistrosConIdGrupos.length} Reptiles al nuevo ID de Grupo  y Familia a not specified.`;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

const createOrder = async (nombreG, nombreC) => {
    console.log(nombreC, nombreG)
    try {
        if (nombreC && nombreG) {
            await Order_reptiles.create({
                nombre: nombreG,
                nombre_comun: nombreC

            });
            return "Orden creado correctamente."
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

const updateOrder = async (nombreG, nombreComun, idOrder) => {
    try {
        // Verifica si el ID de la Order existe
        const existingOrder = await Order_reptiles.findOne({
            where: { id_order: idOrder },
        });

        if (!existingOrder) {
            throw new Error("El ID de Order especificado no existe.");
        }

        if (idOrder <= 0) {
            throw new Error("El ID no es válido.");
        }

        // Verifica que los nombres sean cadenas de texto no vacías
        if (typeof nombreG !== 'string' || nombreG.trim() === '') {
            throw new Error("El nombre científico no es válido. Debe ser una cadena de texto no vacía.");
        }

        if (typeof nombreComun !== 'string' || nombreComun.trim() === '') {
            throw new Error("El nombre común no es válido. Debe ser una cadena de texto no vacía.");
        }

        // Verifica si hay cambios antes de actualizar
        if (nombreG !== existingOrder.nombre || nombreComun !== existingOrder.nombre_comun) {
            await Order_reptiles.update(
                { nombre: nombreG, nombre_comun: nombreComun },
                { where: { id_order: idOrder } }
            );
            return "Order actualizado correctamente.";
        } else {
            return "No se realizaron cambios, los valores son los mismos.";
        }
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};


const borrarOrder = async (idG) => {
    try {
        // Buscar todas las Mamiferos que tienen el ID de la familia a cambiar
        const RegistrosConIdOrder = await Reptiles.findAll({
            where: {
                orders_id_order: idG,
            },
        });

        // Cambiar el ID de familia solo en las Mamiferos encontradas
        await Reptiles.update(
            {
                orders_id_order: 4, // Cambiar el ID de familia al valor not specified
            },
            {
                where: {
                    orders_id_order: idG,
                },
            }
        );

        await Order_reptiles.destroy({
            where: {
                id_order: idG,
            },
        });

        return `Se actualizaron ${RegistrosConIdOrder.length} Reptiles al nuevo ID de Order  y Familia .`;
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
    createOrder,
    updateOrder,
    borrarOrder,
}