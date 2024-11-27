'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pay_rate_histories', {
      PayRateHistoryID: { 
        allowNull: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4, 
        primaryKey: true,
    },
    ConsultantID: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'consultants', 
        key: 'ConsultantID'
      }
    },
    PayType: {
        type: Sequelize.ENUM('Hourly', 'Flat Rate'),
        allowNull: false,
    },
    PayRate: {
        type: Sequelize.DECIMAL(5, 1),
        allowNull: false,
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
    await queryInterface.dropTable('pay_rate_histories');
  }
};