const { Aves, Grupos, Familias, Paises, Zonas } = require('../../db/db');

const getAllZonas = async () => {
    try {
        const allZonas = await Zonas.findAll({
            attributes: [['id_zona', 'id'], ['nombre_zona', 'nombre'],],
        });
        return allZonas
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

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

module.exports = {
    getAllZonas,
    createZonas
}