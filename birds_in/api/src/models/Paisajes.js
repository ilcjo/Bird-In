const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('paisajes', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    descripcion: {
      type: DataTypes.STRING, // O el tipo de dato adecuado para tu descripción
      allowNull: true,
      defaultValue: null
    },
    url: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null
    },
    map: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null
  },
  });

};