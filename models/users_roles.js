'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserRole extends Model {
    static associate(models) {
      UserRole.belongsTo(models.User, {
        foreignKey: 'user_id',
      });
      UserRole.belongsTo(models.Role, {
        foreignKey: 'role_id',
      });
    }
  }
  UserRole.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users', 
        key: 'id'
      }
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'roles', 
        key: 'id'
      }
    }
  }, {
    timestamps:true,
    sequelize,
    modelName: 'UserRole',
    tableName: 'user_roles',
       indexes: [
      {
        unique: true,
        fields: ['user_id', 'role_id']
      }
    ]
  });
  return UserRole;
};