'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      Role.belongsToMany(models.User, {
        through: models.UserRole,
        foreignKey: 'role_id',
      });
      Role.belongsToMany(models.Permission, {
        through: models.RolePermission,
        foreignKey: 'role_id',
      });
    }
  }
  Role.init({
    role_name: {
      type: DataTypes.STRING, 
      allowNull: false,
      unique: true
    },
    role_description: {
      type: DataTypes.STRING,
      allowNull:true
    },
  }, 
  {
    timestamps: true,  
    sequelize,
    modelName: 'Role',
    tableName: 'roles',
     indexes: [
      {
        unique: true,
        fields: ['role_name']
      }
    ]
  });
  return Role;
};