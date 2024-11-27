'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('benchmarks', {
      BenchmarkID: { 
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
    Role: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    LowRangeHours: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    TargetHours: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    HighRangeHours: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    WeeklyHours: {
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
    await queryInterface.dropTable('benchmarks');
  }
};