'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('consultant_alerts',{
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      consultant_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'consultants',
          key: 'id'
        }
      },
      alert_days: {
          type: Sequelize.STRING,
          allowNull: true,
      },
      alert_message: {
          type: Sequelize.STRING,
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
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('consultant_alerts');
  }
};
