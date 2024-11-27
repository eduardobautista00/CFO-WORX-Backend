'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    
  class ClientConsultant extends Model {
    static associate(models) {
        ClientConsultant.belongsTo(models.Client, {
        foreignKey: 'ClientID',
      });
      
      ClientConsultant.belongsTo(models.Consultant, {
        foreignKey: 'ConsultantID',
      });
    }
  }

  ClientConsultant.init({
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
    }
  }, {
    timestamps:true,
    createdAt: 'CreatedOn',
    updatedAt: 'UpdatedOn',
    sequelize,
    modelName: 'ClientConsultant',
    tableName: 'clients_consultants',
  });
  return ClientConsultant;
};