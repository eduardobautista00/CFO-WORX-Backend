'use strict';
const {Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Consultant extends Model {
    static associate(models) {
      Consultant.belongsTo(models.User,{
        foreignKey: 'user_id',
      });

      Consultant.hasMany(models.Timecard, {
        foreignKey: 'ConsultantID',
      });

      Consultant.belongsToMany(models.Client,{
        through: models.ClientConsultant,
        foreignKey: 'ConsultantID',
      }); 
    
    }
  }
  
  Consultant.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references:{
        model:'users',
        key:'id'
      }
    },
    ConsultantID: { 
      allowNull: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, 
      primaryKey: true,
    },
    FirstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    LastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    CompanyEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    PersonalEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    EmergencyContactName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    EmergencyContactPhone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    JobTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    HireDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    PayType: {
      type: DataTypes.ENUM('Hourly', 'Flat Rate'),
      allowNull: false,
    },
    PayRate: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    TimecardCycle: {
      type: DataTypes.ENUM('Weekly', 'Bi-Weekly', 'Monthly'),
      allowNull: false,
    },
    DomesticInternational: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    Status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    Address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    CreatedBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    UpdatedBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    timestamps:true,
    createdAt: 'CreatedOn', 
    updatedAt: 'UpdatedOn',
    sequelize,
    modelName: 'Consultant',
    tableName: 'consultants'
  });
  
  return Consultant;
};

