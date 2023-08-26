const { QueryTypes } = require("sequelize");
const { conn } = require("../../db/db");
const { Aves } = require('../../db/db')

const fetchBirds = async () => {
    const fetchInfo = await conn.query(
        'SELECT * FROM view_all_birds', // Aquí tu consulta a la vista
        { type: QueryTypes.SELECT }
    );

    return fetchInfo
}


module.exports = {
    fetchBirds,
}