const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    // defino el modelo
    sequelize.define('paises', {
        id_pais: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        nombre: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        code:{
            type:DataTypes.INTEGER,
            allowNull: true
        }
    },)
}