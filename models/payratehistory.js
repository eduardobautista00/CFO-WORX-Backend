'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    
  class PayRateHistory extends Model {
    static associate(models) {
      PayRateHistory.belongsTo(models.Consultant, {
        foreignKey: 'ConsultantID',
      });
    }
  }

  PayRateHistory.init({
    PayRateHistoryID: { 
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, 
        primaryKey: true,
    },
    ConsultantID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'consultants', 
        key: 'ConsultantID'
      }
    },
    PayType: {
        type: DataTypes.ENUM('Hourly', 'Flat Rate'),
        allowNull: false,
    },
    PayRate: {
        type: DataTypes.DECIMAL(5, 1),
        allowNull: false,
    },
  }, {
    timestamps:true,
    createdAt: 'CreatedOn',
    updatedAt: 'UpdatedOn',
    sequelize,
    modelName: 'PayRateHistory',
    tableName: 'pay_rate_histories',
  });
  return PayRateHistory;
};