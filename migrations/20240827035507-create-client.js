'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('clients', {
      ClientID: { 
        allowNull: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4, 
        primaryKey: true,
      },
      ClientName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ClientAddress: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      BillingEmail: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      PhoneNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      InitialContractLength: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      MonthlyRevenue: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      OnboardingFee: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      AccountingSystem: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      RevenueRange: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      ActiveStatus: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
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
    await queryInterface.dropTable('clients');
  }
};