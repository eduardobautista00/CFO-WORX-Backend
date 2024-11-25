'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('clients_consultants', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      client_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'clients', 
          key: 'id'
        }
      },
      consultant_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'consultants', 
          key: 'id'
        }
      },
      expected_work_hours: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      actual_utilization: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('clients_consultants');
  }
};