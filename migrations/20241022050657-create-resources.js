'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('resources',{
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      author: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users', 
          key: 'id'
        }
      },
      resource_title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      resource_media: {
          type: Sequelize.JSON,
          allowNull: true,
        },
      resource_body: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      additional_fields: {
      type: Sequelize.JSON,
      allowNull: true,
    },
      status: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      category: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      resource_link: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('resources');
  }
};
