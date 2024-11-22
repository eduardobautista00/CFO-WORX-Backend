'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    
  class ClientConsultant extends Model {
    static associate(models) {
        ClientConsultant.belongsTo(models.Client, {
        foreignKey: 'client_id',
      });
      
      ClientConsultant.belongsTo(models.Consultant, {
        foreignKey: 'consultant_id',
      });
    }
  }

  ClientConsultant.init({
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'clients', 
        key: 'id'
      }
    },
    consultant_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'consultants', 
        key: 'id'
      }
    },
    expected_work_hours: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    actual_utilization: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  }, {
    timestamps:true,
    sequelize,
    modelName: 'ClientConsultant',
    tableName: 'clients_consultants',
  });
  return ClientConsultant;
};