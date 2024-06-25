const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
    sequelize.define('VistaAvesOrdenadaAll', {
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
        nombre_grupo: {
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
        url_Ebird: {
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
    }, {
        tableName: 'vista_aves_ordenada_all', // Nombre de la vista en tu base de datos
        timestamps: false,
    });
}