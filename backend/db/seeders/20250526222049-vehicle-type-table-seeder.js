"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "vehicle_types",
      [
        {
          id: 1,
          name: "Carros",
        },
        {
          id: 2,
          name: "Motos",
        },
        {
          id: 3,
          name: "Caminhões",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      "vehicle_types",
      {
        name: ["Carros", "Motos", "Caminhões"],
      },
      {}
    );
  },
};
