const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    // defino el modelo
    sequelize.define('familias_mamiferos', {
        id_familia: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    },{ timestamps: false, }
    )
}