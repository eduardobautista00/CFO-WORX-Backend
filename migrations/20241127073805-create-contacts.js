'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('contacts', {
      ContactID: {
        allowNull: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4, 
        primaryKey: true,
      },
      ClientID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{
         model:'clients',
         key:'ClientID'
        }
      },
      Name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      Title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      PhoneNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      Email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      Role: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      CreatedOn: {
        allowNull: false,
        type: Sequelize.DATE
      },
      UpdatedOn: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('contacts');
  }
};