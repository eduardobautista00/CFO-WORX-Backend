'use strict';
const {Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Timecard extends Model {
    static associate(models) {
       Timecard.belongsTo(models.Client,{
        foreignKey: 'ClientID'
       });

       Timecard.belongsTo(models.Consultant,{
        foreignKey: 'ConsultantID'
       });

       Timecard.hasMany(models.DailyAllocation, {
         foreignKey: 'TimecardID'
       });
    }
  }
  Timecard.init({
    TimecardID: {
      allowNull: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, 
      primaryKey: true,
    },
    ClientID:{
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'clients',
        key: 'ClientID'
      }
    },
    ConsultantID:{
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'consultants',
        key: 'ConsultantID'
      }
    },
    WeekStartDate : {
      type: DataTypes.DATE,
      allowNull: false,
    },
    WeekEndDate : {
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
      type: DataTypes.ENUM('Approved', 'Pending', 'Rejected', 'Paid'),
      allowNull: false,
      defaultValue: 'Pending',
    },
    Notes: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    BenchmarkStatus: {
      type: DataTypes.ENUM('Below', 'Within', 'Above'),
      allowNull: false,
    },
    ApprovedBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    RejectedNotes: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    timestamps:true,
    createdAt: 'CreatedOn',
    updatedAt: 'UpdatedOn',
    sequelize,
    modelName: 'Timecard',
    tableName: 'timecards',
    indexes : [
      {fields: ['ClientID']},
      {fields: ['ConsultantID']}
  ]
  });
  return Timecard;
};

