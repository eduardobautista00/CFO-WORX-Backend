'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('time_submissions',{
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      client_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'clients',
          key: 'id'
        }
      },
      consultant_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'consultants',
          key: 'id'
        }
      },
      week_start : {
        type: Sequelize.DATE,
        allowNull: false,
      },
      total_hours: {
        type: Sequelize.DECIMAL(5, 1),
        allowNull: false,
        validate: {
          maxValue(value) {
            if (value > 40) {
              throw new Error("Total hours must not exceed 40.");
            }
          }
        }      
      },
      submissionStatus: {
        type: Sequelize.ENUM('Unsubmitted', 'Submitted'),
        allowNull: false,
        defaultValue: 'Unsubmitted',
      },
      approvalStatus: {
        type: Sequelize.ENUM('Approved', 'Pending', 'Rejected'),
        allowNull: false,
        defaultValue: 'Pending',
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
    await queryInterface.dropTable('time_submissions');
  }
};
