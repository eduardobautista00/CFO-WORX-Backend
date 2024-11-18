'use strict';
const {Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Branch extends Model {
    static associate(models) {
      Branch.belongsToMany(models.User, {
        through: models.UserBranch,
        foreignKey: 'branch_id',
      });
    }
  }
  
  Branch.init({
    branch_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    branch_address: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    operating_hours: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'Closed',
      allowNull: false,
    }
  }, {
    timestamps:true,
    sequelize,
    modelName: 'Branch',
    tableName: 'branches',
        indexes: [
      {
        unique: true,
        fields: ['branch_name']
      }
    ]
  });
  return Branch;
};

