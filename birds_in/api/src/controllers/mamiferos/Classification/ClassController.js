const { Mamiferos, Familias_mamiferos, Order_mamiferos } = require("../../../config/db/db");

const createFamilias = async (familia) => {
    try {
        if (familia) {
            await Familias_mamiferos.create({
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
        const existingFamilia = await Familias_mamiferos.findOne({
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

            await Familias_mamiferos.update({
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
        // Buscar todas las Mamiferos que tienen el ID de la familia a cambiar
        const RegistrosConIdFamilia = await Mamiferos.findAll({
            where: {
                familias_id_familia: idF,
            },
        });
        // Cambiar el ID de familia solo en las Mamiferos encontradas
        await Mamiferos.update(
            {
                familias_id_familia: 3, // Cambiar el ID de familia al valor 130
            },
            {
                where: {
                    familias_id_familia: idF,
                },
            }
        );

        await Familias_mamiferos.destroy({
            where: {
                id_familia: idF,
            },
        });

        return `Se actualizaron ${RegistrosConIdFamilia.length} Mamiferos al nuevo ID de familia  y Order a not specified.`;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

const createOrder = async (nombreG, nombreC) => {
    console.log(nombreC, nombreG)
    try {
        if (nombreC && nombreG) {
            await Order_mamiferos.create({
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
        const existingOrder = await Order_mamiferos.findOne({
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
            await Order_mamiferos.update(
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
        const RegistrosConIdOrder = await Mamiferos.findAll({
            where: {
                orders_id_order: idG,
            },
        });

        // Cambiar el ID de familia solo en las Mamiferos encontradas
        await Mamiferos.update(
            {
                orders_id_order: 4, // Cambiar el ID de familia al valor not specified
            },
            {
                where: {
                    orders_id_order: idG,
                },
            }
        );

        await Order_mamiferos.destroy({
            where: {
                id_order: idG,
            },
        });

        return `Se actualizaron ${RegistrosConIdOrder.length} Mamiferos al nuevo ID de Order  y Familia a not specified.`;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};


module.exports = {
    createFamilias,
    updateFamilias,
    borrarFamilias,
    createOrder,
    updateOrder,
    borrarOrder,
}