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
        nombre_ingles: {
            type: DataTypes.TEXT,
            unique: true,
            allowNull: false
        },
        nombre_cientifico: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        nombre_comun: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        url_wiki: {
            type: DataTypes.TEXT,
            allowNull: true
        },
          // 👇 FK a Familias
        familias_id_familia: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        // 👇 FK a Grupos
        grupos_id_grupo: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
      

    }, { timestamps: true, }
    )
}
