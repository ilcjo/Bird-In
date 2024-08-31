const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    // defino el modelo
    sequelize.define('mamiferos', {
        id_mamifero: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        nombre_comun: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        nombre_ingles: {
            type: DataTypes.TEXT,
            unique: true,
            allowNull: false
        },
        nombre_cientifico: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        url_wiki: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        // grupos_id_grupo: {
        //     type: DataTypes.INTEGER,
        //     references: {
        //         model: 'grupos_mamiferos', // Nombre de la tabla asociada
        //         key: 'id_grupo' // Nombre de la columna clave primaria en la tabla asociada
        //     },
        //     allowNull: false
        // },
    }, { timestamps: true, }
    )
}
