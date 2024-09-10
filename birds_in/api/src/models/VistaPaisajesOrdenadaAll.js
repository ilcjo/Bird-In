const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('vistaPaisajesOrdenadaAll', {
        descripcion: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        map: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        pais: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        zona: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        imagenes: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        tiene_portada: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        tableName: 'vista_paisajes_ordenada_all', // Nombre de la vista en tu base de datos
        timestamps: false,
        // Asegúrate de que Sequelize no espera una clave primaria
        // primaryKey: false,
        // autoIncrement: false 
    });
};
