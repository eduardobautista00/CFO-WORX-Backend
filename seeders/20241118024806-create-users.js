'use strict';
const bcrypt = require('bcryptjs'); // Import bcrypt

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Hash the passwords before inserting
    const hashedAdminPassword = await bcrypt.hash('admin', 10);
    const hashedConsultantPassword = await bcrypt.hash('password', 10);

    await queryInterface.bulkInsert(
      'users',
      [
        {
          first_name: 'Admin',
          last_name: 'User',
          sex: 'Male',
          email: 'eduardoculladobautista1113@gmail.com',
          password: hashedAdminPassword,
          "createdAt": new Date(),
          "updatedAt": new Date() 
        },
        {
          first_name: 'Sample',
          last_name: 'Consultant',
          sex: 'Female',
          email: 'sampleconsultant@email.com',
          password: hashedConsultantPassword,
          "createdAt": new Date(),
          "updatedAt": new Date()
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
