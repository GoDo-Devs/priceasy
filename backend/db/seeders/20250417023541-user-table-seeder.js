'use strict';
import { v4 as uuidv4 } from 'uuid';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [{
      id: uuidv4(),
      name: 'Teste User',
      email: 'test@example.com',
      password: '123',
      is_admin: true,
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', { email: 'admin@priceasy.com' }, {});
  }
};
