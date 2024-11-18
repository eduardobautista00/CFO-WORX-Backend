'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    
  class UserBranch extends Model {
    static associate(models) {
        UserBranch.belongsTo(models.User, {
        foreignKey: 'user_id',
      });
      
      UserBranch.belongsTo(models.Branch, {
        foreignKey: 'branch_id',
      });
    }
  }

  UserBranch.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users', 
        key: 'id'
      }
    },
   branch_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'branches', 
        key: 'id'
      }
    }
  }, {
    timestamps:true,
    sequelize,
    modelName: 'UserBranch',
    tableName: 'user_branches',
       indexes: [
      {
        unique: true,
        fields: ['user_id', 'branch_id']
      }
    ]
  });
  return UserBranch;
};