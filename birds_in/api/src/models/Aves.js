const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    // defino el modelo
    sequelize.define('aves', {
        id_ave: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        nombre_ingles: {
            type: DataTypes.TEXT,
            unique: true,
            allowNull: false
        },
        nombre_cientifico: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        nombre_comun: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        zonas: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        url_wiki: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        url_bird: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        url_avi: {
            type: DataTypes.TEXT,
            allowNull: true
        },
    }, { timestamps: true }
    );
};

