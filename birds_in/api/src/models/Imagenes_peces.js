const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    // defino el modelo
    sequelize.define('imagenes_peces', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        url_peces: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        destacada: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        orden_imagen: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        peces_id_pez: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    }, { timestamps: false, }
    )
}