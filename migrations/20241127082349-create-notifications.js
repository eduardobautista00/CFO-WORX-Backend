'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('notifications', {
      NotificationID: { 
        allowNull: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4, 
        primaryKey: true,
      },
    RecipientEmail: {
        type: Sequelize.STRING,
        allowNull: false
    },
    NotificationType: {
        type: Sequelize.ENUM('Reminder', 'Approval Update', 'Rejection Note'),
        allowNull: false
    },
    Status: {
        type: Sequelize.ENUM('Sent', 'Pending', 'Failed'),
        allowNull: false
    },
    Message: {
        type: Sequelize.STRING,
        allowNull: false
    },
    SentOn: {
        type: Sequelize.DATE,
        allowNull: false
    },
      CreatedOn: {
        allowNull: false,
        type: Sequelize.DATE
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('notifications');
  }
};