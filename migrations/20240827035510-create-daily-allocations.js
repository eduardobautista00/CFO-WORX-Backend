'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('daily_allocations',{
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      TimecardID:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'timecards',
          key: 'TimecardID'
        }
      },
      day_of_week: {
        type: Sequelize.ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'),
        allowNull: false,
      },
      client_facing_hours: {
          type: Sequelize.DECIMAL(5, 1),
          allowNull: false,
          validate: {
              maxValue(value) {
                if (value > 12) {
                  throw new Error("Daily hours must not exceed 12 hours.");
                }
              }
            }
      },
      non_client_facing_hours: {
          type: Sequelize.DECIMAL(5, 1),
          allowNull: false,
          validate: {
              maxValue(value) {
                if (value > 12) {
                  throw new Error("Daily hours must not exceed 12 hours.");
                }
              }
            }
      },
      other_task_hours: {
          type: Sequelize.DECIMAL(5, 1),
          allowNull: false,
          validate: {
              maxValue(value) {
                if (value > 12) {
                  throw new Error("Daily hours must not exceed 12 hours.");
                }
              }
            }
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
    await queryInterface.dropTable('daily_allocations');
  }
};
