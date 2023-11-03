const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
    // defino el modelo
    sequelize.define('zonas', {
        id_zona: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        nombre_zona: {
            type: DataTypes.STRING,
            allowNull: false
        },
        id_paises: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    }, { timestamps: false, }
    )
}