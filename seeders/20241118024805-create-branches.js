'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

      await queryInterface.bulkInsert('branches', [{
        "branch_name": "Main", 
        "branch_address": "Address", 
        "operating_hours": '{ "open": "8:00", "close": "16:00" }', 
        "status": "Closed",
        "createdAt": new Date(),
        "updatedAt": new Date()
      }], {});
    
  },

  async down (queryInterface, Sequelize) {

     await queryInterface.bulkDelete('branches', null, {});
     
  }
};
