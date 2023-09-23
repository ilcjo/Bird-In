const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    // defino el modelo
    sequelize.define('imagenes_aves', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        url: {
            type: DataTypes.TEXT,
            allowNull: false
        },
    },{ timestamps: false, }
    )
}