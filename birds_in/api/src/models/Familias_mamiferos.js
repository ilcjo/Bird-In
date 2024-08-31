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
        },
        // grupo_id: {
        //     type: DataTypes.INTEGER,
        //     references: {
        //         model: 'grupos_mamiferos', // Nombre de la tabla asociada
        //         key: 'id_grupo' // Clave primaria de la tabla asociada
        //     },
        //     allowNull: false
        // }
    },{ timestamps: false, }
    )
}