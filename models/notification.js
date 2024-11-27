'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    
  class Notification extends Model {
    static associate(models) {

    }
  }

  Notification.init({
    NotificationID: { 
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, 
        primaryKey: true,
      },
    RecipientEmail: {
        type: DataTypes.STRING,
        allowNull: false
    },
    NotificationType: {
        type: DataTypes.ENUM('Reminder', 'Approval Update', 'Rejection Note'),
        allowNull: false
    },
    Status: {
        type: DataTypes.ENUM('Sent', 'Pending', 'Failed'),
        allowNull: false
    },
    Message: {
        type: DataTypes.STRING,
        allowNull: false
    },
    SentOn: {
        type: DataTypes.DATE,
        allowNull: false
    }
  }, {
    timestamps:true,
    createdAt: 'CreatedOn',
    sequelize,
    modelName: 'Notification',
    tableName: 'Notifications',
  });
  return Notification;
};