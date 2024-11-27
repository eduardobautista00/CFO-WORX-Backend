'use strict';
const {Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Client extends Model {
    static associate(models) {
      Client.hasMany(models.Timecard, {
        foreignKey: 'ClientID',
      });

      Client.belongsToMany(models.Consultant,{
        through: models.ClientConsultant,
        foreignKey: 'ClientID',
      }); 
    }
  }
  
  Client.init({
    ClientID: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    ClientName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ClientAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    BillingEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    PhoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    InitialContractLength: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    MonthlyRevenue: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    OnboardingFee: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    AccountingSystem: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    RevenueRange: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ActiveStatus: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },

  }, {
    timestamps:true,
    createdAt: 'CreatedOn',
    updatedAt: 'UpdatedOn',
    sequelize,
    modelName: 'Client',
    tableName: 'clients'
  });
  
  return Client;
};

