const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    // defino el modelo
    sequelize.define('order_reptiles', {
        id_order: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        nombre_comun: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    },{ timestamps: false, }
    )
}