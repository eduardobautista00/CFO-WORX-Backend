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
    }
  }
  TimeSubmission.init({
    data: {
      type: DataTypes.JSON,
      allowNull: true,
    },
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
  }, {
    timestamps:true,
    sequelize,
    modelName: 'TimeSubmission',
    tableName: 'time_submissions'
  });
  return TimeSubmission;
};

