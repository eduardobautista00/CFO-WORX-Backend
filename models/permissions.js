'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Permissions extends Model {
    static associate(models) {
      Permissions.belongsToMany(models.Role, {
        through: models.RolePermission,
        foreignKey: 'permission_id',
      });
    }
  }
  Permissions.init({
    permission_name: {
      type: DataTypes.STRING, 
      allowNull: false
    }
  }, {
    timestamps:true,
    sequelize,
    modelName: 'Permission',
    tableName: 'permissions'
  });
  return Permissions;
};