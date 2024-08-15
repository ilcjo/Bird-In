const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    // defino el modelo
    sequelize.define('imagenes_reptiles', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        url_reptil: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        destacada: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
    }, { timestamps: false, }
    )
}