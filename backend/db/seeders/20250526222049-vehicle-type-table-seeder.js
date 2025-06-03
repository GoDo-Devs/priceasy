"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "vehicle_types",
      [
        {
          id: 1,
          name: "Carro",
        },
        {
          id: 2,
          name: "Moto",
        },
        {
          id: 3,
          name: "Caminhão",
        },
        {
          id: 3,
          name: "Agregado",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      "vehicle_types",
      {
        name: ["Carro", "Moto", "Caminhão", "Agregado"],
      },
      {}
    );
  },
};
