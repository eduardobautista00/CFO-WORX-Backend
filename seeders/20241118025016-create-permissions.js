'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('permissions', [
      { permission_name: 'Submit Report', "createdAt": new Date(), "updatedAt": new Date() },
      { permission_name: 'Approve Report', "createdAt": new Date(), "updatedAt": new Date()},
      { permission_name: 'Reject Report',"createdAt": new Date(), "updatedAt": new Date() },
      { permission_name: 'View Reports', "createdAt": new Date(), "updatedAt": new Date() },
      { permission_name: 'Edit Reports', "createdAt": new Date(), "updatedAt": new Date() },
      { permission_name: 'Delete Reports', "createdAt": new Date(), "updatedAt": new Date() },
      { permission_name: 'Download Reports', "createdAt": new Date(), "updatedAt": new Date() },
      { permission_name: 'Add Consultant', "createdAt": new Date(), "updatedAt": new Date() },
      { permission_name: 'Manage Consultants', "createdAt": new Date(), "updatedAt": new Date() },
      { permission_name: 'Remove Consultant', "createdAt": new Date(), "updatedAt": new Date() },
      { permission_name: 'Access Client Details' , "createdAt": new Date(), "updatedAt": new Date()},
      { permission_name: 'Add Client', "createdAt": new Date(), "updatedAt": new Date() },
      { permission_name: 'Remove Client', "createdAt": new Date(), "updatedAt": new Date() },
      { permission_name: 'Edit Client', "createdAt": new Date(), "updatedAt": new Date() },
      { permission_name: 'Notify Consultant', "createdAt": new Date(), "updatedAt": new Date() },
      { permission_name: 'Manage Permissions', "createdAt": new Date(), "updatedAt": new Date() },
      { permission_name: 'Manage System Settings', "createdAt": new Date(), "updatedAt": new Date() },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('permissions', null, {});
  }
};
