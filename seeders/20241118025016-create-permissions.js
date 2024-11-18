'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('permissions', [
      { permission_name: 'Submit Report' },
      { permission_name: 'Approve Report' },
      { permission_name: 'Reject Report' },
      { permission_name: 'View Reports' },
      { permission_name: 'Edit Reports' },
      { permission_name: 'Delete Reports' },
      { permission_name: 'Download Reports' },
      { permission_name: 'Add Consultant' },
      { permission_name: 'Manage Consultants' },
      { permission_name: 'Remove Consultant' },
      { permission_name: 'Access Client Details' },
      { permission_name: 'Add Client' },
      { permission_name: 'Remove Client' },
      { permission_name: 'Edit Client' },
      { permission_name: 'Notify Consultant' },
      { permission_name: 'Manage Permissions' },
      { permission_name: 'Manage System Settings' },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('permissions', null, {});
  }
};
