'use strict';
const {Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Contact extends Model {
    static associate(models) {
      Contact.hasMany(models.Client, {
        foreignKey: 'ClientID',
      });
    }
  }
  
  Contact.init({
    ClientID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references:{
       model:'clients',
       key:'ClientID'
      }
    },
    ContactID: {
      allowNull: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, 
      primaryKey: true,
    },
    Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    PhoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    timestamps:true,
    createdAt: 'CreatedOn',
    updatedAt: 'UpdatedOn',
    sequelize,
    modelName: 'Contact',
    tableName: 'contacts'
  });
  
  return Contact;
};

