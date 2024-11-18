'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class StaffLog extends Model {
    static associate(models) {
      StaffLog.belongsTo(models.User, {
        foreignKey: 'user_id',
      });
    }
  }

  StaffLog.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references:{
        model:'users',
        key:'id'
      }
    },
    action: {
      type: DataTypes.ENUM('login', 'logout'),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    timestamps: true,
    sequelize,
    modelName: 'StaffLog',
    tableName: 'staff_logs'
  });

  return StaffLog;
};
