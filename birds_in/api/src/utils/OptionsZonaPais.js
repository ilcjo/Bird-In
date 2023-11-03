const { Zonas } = require('../db/db');

const obtenerIdDeZonas = async (idPais) => {
    // console.log('LLEGUE A ID ZONA')
    // Realiza una consulta para obtener los IDs de zonas relacionadas al país
    const zonas = await Zonas.findAll({
        where: {
            id_paises: idPais, // Supongamos que el campo que relaciona las zonas con los países se llama id_pais
        },
        attributes: ['id_zona'], // Nombre del campo que contiene el ID de la zona
    });

    // Extrae los IDs de las zonas de los resultados
    const idZonas = zonas.map(zona => zona.id_zona);

    return idZonas;
};

const obtenerIdDePais = async (idZona) => {
    // console.log('LLEGUE A IDPAIS')
     // Realiza una consulta para obtener los IDs de zonas relacionadas al país
     const zonas = await Zonas.findAll({
        where: {
            id_zona: idZona, // Supongamos que el campo que relaciona las zonas con los países se llama id_pais
        },
        attributes: ['id_paises'], // Nombre del campo que contiene el ID de la zona
    });

    // Extrae los IDs de las zonas de los resultados
    const idZonas = zonas.map(zona => zona.dataValues.id_paises);

    return idZonas;
};


module.exports = {
    obtenerIdDeZonas,
    obtenerIdDePais
}