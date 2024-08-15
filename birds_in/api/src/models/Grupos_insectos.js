const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    // defino el modelo
    sequelize.define('grupos_insectos', {
        id_grupo: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    },{ timestamps: false, }
    )
}