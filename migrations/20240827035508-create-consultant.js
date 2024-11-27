'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('consultants', {
      ConsultantID: { 
        allowNull: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4, 
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{
          model:'users',
          key:'id'
        }
      },
      FirstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      LastName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      CompanyEmail: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      PersonalEmail: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      EmergencyContactName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      EmergencyContactPhone: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      JobTitle: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      HireDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      PayType: {
        type: Sequelize.ENUM('Hourly', 'Flat Rate'),
        allowNull: false,
      },
      PayRate: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      TimecardCycle: {
        type: Sequelize.ENUM('Weekly', 'Bi-Weekly', 'Monthly'),
        allowNull: false,
      },
      DomesticInternational: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      Status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      Address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      CreatedBy: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      UpdatedBy: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('consultants');
  }
};