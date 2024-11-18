'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RolePermission extends Model {
    static associate(models) {
      RolePermission.belongsTo(models.Role, {
        foreignKey: 'role_id',
      });

      RolePermission.belongsTo(models.Permission, {
        foreignKey: 'permission_id',
      });
    }
  }
  RolePermission.init({
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'roles', 
        key: 'id'
      }
    },
    permission_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'permissions', 
        key: 'id'
      }
    }
  }, {
    timestamps:true,
    sequelize,
    modelName: 'RolePermission',
    tableName: 'role_permissions'
  });
  return RolePermission;
};