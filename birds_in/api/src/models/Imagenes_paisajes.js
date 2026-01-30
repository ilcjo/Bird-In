const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    // defino el modelo
    sequelize.define('imagenes_paisajes', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        url_paisaje: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        destacada: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        paisajes_id_paisaje: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        orden_imagen: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
    }, { timestamps: false, }
    )
}