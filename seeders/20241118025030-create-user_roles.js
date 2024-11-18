'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

      await queryInterface.bulkInsert('user_roles', [
        {user_id: 1,
        role_id: 1},
        
        {user_id: 2,
        role_id: 2}
      ], {});
    
  },

  async down (queryInterface, Sequelize) {

      await queryInterface.bulkDelete('user_roles', null, {});
     
  }
};
