const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
    sequelize.define('PaisesconAves', {
        id_pais: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
        },

    }, {
        tableName: 'paises_con_aves', // Nombre de la vista en tu base de datos
        timestamps: false,
    });
}