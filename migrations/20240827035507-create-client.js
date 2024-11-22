'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('clients', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: false,
      },
      client_code: {
          type: Sequelize.INTEGER,
          allowNull: false,
          unique: true
      },
      services: {
          type: Sequelize.STRING,
          allowNull: false,
      },
      utilization_target: {
          type: Sequelize.STRING,
          allowNull: true,
      },
      revenue: {
          type: Sequelize.FLOAT(0.0),
          allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('clients');
  }
};