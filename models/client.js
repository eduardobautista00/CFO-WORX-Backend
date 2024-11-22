'use strict';
const {Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Client extends Model {
    static associate(models) {
      Client.hasMany(models.TimeSubmission, {
        foreignKey: 'client_id',
      });

      Client.belongsToMany(models.Consultant,{
        through: models.ClientConsultant,
        foreignKey: 'client_id',
      }); 
    }
  }
  
  Client.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    client_code: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    services: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    utilization_target: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    revenue: {
        type: DataTypes.FLOAT,
        allowNull: true,
    }
  }, {
    timestamps:true,
    sequelize,
    modelName: 'Client',
    tableName: 'clients'
  });
  
  return Client;
};

