'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('utilizations', {
      UtilizationID: { 
        allowNull: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4, 
        primaryKey: true,
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
    WeekStartDate : {
        type: Sequelize.DATE,
        allowNull: false,
    },
    UtilizedHours : {
        type: Sequelize.DECIMAL(5,1),
        allowNull: false,
    },
    BenchmarkStatus: {
        type: Sequelize.ENUM('Below', 'Within', 'Above'),
        allowNull: false
    },
      CreatedOn: {
        allowNull: false,
        type: Sequelize.DATE
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('utilizations');
  }
};