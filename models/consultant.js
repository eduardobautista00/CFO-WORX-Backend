'use strict';
const {Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Consultant extends Model {
    static associate(models) {
      Consultant.belongsTo(models.User,{
        foreignKey: 'user_id',
      });

      Consultant.hasMany(models.TimeSubmission, {
        foreignKey: 'consultant_id',
      });

      Consultant.belongsToMany(models.Client,{
        through: models.ClientConsultant,
        foreignKey: 'consultant_id',
      }); 
    }
  }
  
  Consultant.init({
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
          model:'users',
          key:'id'
        }
      },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    salary_per_hour: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    bill_rate: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
  }, {
    timestamps:true,
    sequelize,
    modelName: 'Consultant',
    tableName: 'consultants'
  });
  
  return Consultant;
};

