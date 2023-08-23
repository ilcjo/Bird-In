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
            allowNull: true
        },
        nombre_cientifico: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        zonas: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        descripcion: {
            type: DataTypes.TEXT,
            allowNull: true
        },
    },
    )
}
