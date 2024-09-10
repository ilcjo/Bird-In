const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
    sequelize.define('vistaReptilesOrdenadaAll', {
        nombre_ingles: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        nombre_cientifico: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        nombre_comun: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        nombre_genero: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        nombre_familia: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        paises: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        zonas: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        url_wiki: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        imagenes: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        tiene_portada: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        tableName: 'vista_reptiles_ordenada_all', // Nombre de la vista en tu base de datos
        timestamps: false,
    });
}