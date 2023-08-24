const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    // defino el modelo
    sequelize.define('nombres_comunes', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        }, 
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
    },
    )
}