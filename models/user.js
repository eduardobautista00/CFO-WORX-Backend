'use strict';
const {Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsToMany(models.Role, {
        through: models.UserRole,
        foreignKey: 'user_id',
      });
      
      User.hasOne(models.ResetPassword, {
        foreignKey: "user_id"
      });

      User.hasMany(models.Consultant, {
        foreignKey: 'user_id'
      });

      User.hasMany(models.Admin,{
        foreignKey: 'user_id'
      });
      
    }
  }
  
  User.init({
    sex: {
      type: DataTypes.STRING,
      allowNull: false,
      },
    email:  {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isEmail: true },
      unique: true
    },
    password: {
      type:DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Password Required" },
      },
    },
  }, {
    timestamps:true,
    createdAt: 'CreatedOn',
    updatedAt: 'UpdatedOn',
    sequelize,
    modelName: 'User',
    tableName: 'users'
  });

    User.addHook('beforeSave', async (user) => {
    if (user.changed('password')) {
      user.password = await bcrypt.hash(user.password, 10);
    }
  });
  
  return User;
};

