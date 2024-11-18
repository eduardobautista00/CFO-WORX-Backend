'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

      await queryInterface.bulkInsert('user_branches', [
        {user_id: 1,
        branch_id: 1},
        {user_id: 2,
        branch_id: 1}
      ], {});
    
  },

  async down (queryInterface, Sequelize) {

      await queryInterface.bulkDelete('user_branches', null, {});
     
  }
};
