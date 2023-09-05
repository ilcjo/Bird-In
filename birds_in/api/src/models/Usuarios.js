const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    // defino el modelo
    sequelize.define('usuarios', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        pass: {
            type: DataTypes.STRING,
            allowNull: false
        },
        tipo: {
            type: DataTypes.ENUM('admin', 'user'),
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('pending', 'approved', 'denied'),
            allowNull: false
        },
        pais: {
            type: DataTypes.STRING,
            allowNull: false
        },
    }, { timestamps: true, }
    )
}