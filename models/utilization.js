'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    
  class Utilization extends Model {
    static associate(models) {
        Utilization.belongsTo(models.Client, {
        foreignKey: 'ClientID',
      });
      
      Utilization.belongsTo(models.Consultant, {
        foreignKey: 'ConsultantID',
      });
    }
  }

  Utilization.init({
    UtilizationID: { 
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, 
        primaryKey: true,
      },
    ClientID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'clients', 
        key: 'ClientID'
      }
    },
    ConsultantID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'consultants', 
        key: 'ConsultantID'
      }
    },
    WeekStartDate : {
        type: DataTypes.DATE,
        allowNull: false,
    },
    UtilizedHours : {
        type: DataTypes.DECIMAL(5,1),
        allowNull: false,
    },
    BenchmarkStatus: {
        type: DataTypes.ENUM('Below', 'Within', 'Above'),
        allowNull: false
    }
  }, {
    timestamps:true,
    createdAt: 'CreatedOn',
    sequelize,
    modelName: 'Utilization',
    tableName: 'utilizations',
  });
  return Utilization;
};