'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Resource extends Model {
    static associate(models) {
        Resource.belongsTo(models.User,{
          foreignKey: 'author'
        })
    }
  }

  Resource.init({
    author: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users', 
        key: 'id'
      }
    },
    resource_title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    resource_media: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    resource_body: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    additional_fields: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resource_link: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    timestamps: true,
    sequelize,
    modelName: 'Resource',
    tableName: 'resources'
  });

  return Resource;
};
// for posting training, guide resource.