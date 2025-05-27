"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "categories",
      [
        {
          id: 1,
          name: "Cobertura",
        },
        {
          id: 2,
          name: "Assistência",
        }
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      "categories",
      {
        name: ["Cobertura", "Assistência"],
      },
      {}
    );
  },
};
