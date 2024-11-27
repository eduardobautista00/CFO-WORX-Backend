'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('timecards',{
      TimecardID: {
        allowNull: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4, 
        primaryKey: true,
      },
      ClientID:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'clients',
          key: 'ClientID'
        }
      },
      ConsultantID:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'consultants',
          key: 'ConsultantID'
        }
      },
      WeekStartDate : {
        type: Sequelize.DATE,
        allowNull: false,
      },
      WeekEndDate : {
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
        type: Sequelize.ENUM('Approved', 'Pending', 'Rejected', 'Paid'),
        allowNull: false,
        defaultValue: 'Pending',
      },
      Notes: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      BenchmarkStatus: {
        type: Sequelize.ENUM('Below', 'Within', 'Above'),
        allowNull: false,
      },
      ApprovedBy: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      RejectedNotes: {
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
    await queryInterface.dropTable('timecards');
  }
};
