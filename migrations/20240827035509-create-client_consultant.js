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
      ClientID: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'clients', 
          key: 'ClientID'
        }
      },
      ConsultantID: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'consultants', 
          key: 'ConsultantID'
        }
      },
      CreatedOn: {
        allowNull: false,
        type: Sequelize.DATE
      },
      UpdatedOn: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('clients_consultants');
  }
};