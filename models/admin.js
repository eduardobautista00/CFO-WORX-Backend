'use strict';
const {Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {
    static associate(models) {
      Admin.belongsTo(models.User,{
        foreignKey: 'user_id',
      });
    }
  }
  
  Admin.init({
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
          model:'users',
          key:'id'
        }
      },
    auto_report_date: {
        type: DataTypes.DATE,
        allowNull: false
    }
  }, {
    timestamps:true,
    sequelize,
    modelName: 'Admin',
    tableName: 'admins'
  });
  
  return Admin;
};

