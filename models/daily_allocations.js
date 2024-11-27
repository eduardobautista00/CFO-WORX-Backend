'use strict';
const {Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class DailyAllocation extends Model {
    static associate(models) {
       DailyAllocation.belongsTo(models.Timecard,{
        foreignKey: 'TimecardID'
       });

    }
  }
  DailyAllocation.init({
    TimecardID:{
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'timecards',
        key: 'TimecardID'
      }
    },
    day_of_week: {
      type: DataTypes.ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'),
      allowNull: false,
    },
    client_facing_hours: {
        type: DataTypes.DECIMAL(5, 1),
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
        type: DataTypes.DECIMAL(5, 1),
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
        type: DataTypes.DECIMAL(5, 1),
        allowNull: false,
        validate: {
            maxValue(value) {
              if (value > 12) {
                throw new Error("Daily hours must not exceed 12 hours.");
              }
            }
          }
    },
  }, {
    timestamps:true,
    sequelize,
    modelName: 'DailyAllocation',
    tableName: 'daily_allocations',
    indexes : [
        {fields: ['TimecardID']}
    ]
  });
  return DailyAllocation;
};

