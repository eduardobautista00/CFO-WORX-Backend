'use strict';
const {Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TimeSubmission extends Model {
    static associate(models) {
       TimeSubmission.belongsTo(models.Client,{
        foreignKey: 'client_id'
       });

       TimeSubmission.belongsTo(models.Consultant,{
        foreignKey: 'consultant_id'
       });

       TimeSubmission.hasMany(models.DailyAllocation, {
         foreignKey: 'time_submission_id'
       });
    }
  }
  TimeSubmission.init({
    client_id:{
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'clients',
        key: 'id'
      }
    },
    consultant_id:{
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'consultants',
        key: 'id'
      }
    },
    week_start : {
      type: DataTypes.DATE,
      allowNull: false,
    },
    total_hours: {
      type: DataTypes.DECIMAL(5, 1),
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
      type: DataTypes.ENUM('Unsubmitted', 'Submitted'),
      allowNull: false,
      defaultValue: 'Unsubmitted',
    },
    approvalStatus: {
      type: DataTypes.ENUM('Approved', 'Pending', 'Rejected'),
      allowNull: false,
      defaultValue: 'Pending',
    },
  }, {
    timestamps:true,
    sequelize,
    modelName: 'TimeSubmission',
    tableName: 'time_submissions',
    indexes : [
      {fields: ['client_id']},
      {fields: ['consultant_id']}
  ]
  });
  return TimeSubmission;
};

