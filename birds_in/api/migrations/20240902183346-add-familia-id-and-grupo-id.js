'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('grupos', 'familia_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'familias',
        key: 'id_familia'
      },
      allowNull: true, // Temporalmente permitir null hasta que migres los datos
    });
    await queryInterface.addColumn('aves', 'grupo_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'grupos',
        key: 'id_grupo'
      },
      allowNull: true, // Temporalmente permitir null hasta que migres los datos
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('grupos', 'familia_id');
    await queryInterface.removeColumn('aves', 'grupo_id');
  }
};
