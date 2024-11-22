'use strict';
const {Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ConsultantAlert extends Model {
    static associate(models) {
       ConsultantAlert.belongsTo(models.Consultant,{
        foreignKey: 'consultant_id'
       });

    }
  }
  ConsultantAlert.init({
    consultant_id:{
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'consultants',
        key: 'id'
      }
    },
    alert_days: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    alert_message: {
        type: DataTypes.STRING,
        allowNull: true,
    }
  }, {
    timestamps:true,
    sequelize,
    modelName: 'ConsultantAlert',
    tableName: 'consultant_alerts',
  });
  return ConsultantAlert;
};

