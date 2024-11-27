'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    
  class Benchmark extends Model {
    static associate(models) {
        Benchmark.belongsTo(models.Client, {
        foreignKey: 'ClientID',
      });
      
      Benchmark.belongsTo(models.Consultant, {
        foreignKey: 'ConsultantID',
      });
    }
  }

  Benchmark.init({
    BenchmarkID: { 
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, 
        primaryKey: true,
    },
    ClientID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'clients', 
        key: 'ClientID'
      }
    },
    Role: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    LowRangeHours: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    TargetHours: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    HighRangeHours: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    WeeklyHours: {
        type: DataTypes.DECIMAL(5, 1),
        allowNull: false,   
    },

  }, {
    timestamps:true,
    createdAt: 'CreatedOn',
    updatedAt: 'UpdatedOn',
    sequelize,
    modelName: 'Benchmark',
    tableName: 'benchmarks',
  });
  return Benchmark;
};