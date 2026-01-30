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
        destacada: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        orden_imagen: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        aves_id_ave: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    }, { timestamps: false, }
    )
}