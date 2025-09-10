"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "vehicle_types",
      [
        {
          id: 1,
          fipeCode: 1,
          aggregate: 0,
          name: "Carro",
        },
        {
          id: 2,
          fipeCode: 2,
          aggregate: 0,
          name: "Moto",
        },
        {
          id: 3,
          fipeCode: 3,
          aggregate: 0,
          name: "Caminhão",
        },
        {
          id: 4,
          fipeCode: 3,
          aggregate: 1,
          name: "Caminhão + 1 Agregado",
        },
        {
          id: 5,
          fipeCode: 3,
          aggregate: 2,
          name: "Caminhão + 2 Agregados",
        },
        {
          id: 6,
          fipeCode: 3,
          aggregate: 3,
          name: "Caminhão + 3 Agregados",
        },
        {
          id: 7,
          fipeCode: 3,
          aggregate: 4,
          name: "Caminhão + 4 Agregados",
        },
        {
          id: 8,
          fipeCode: 4,
          aggregate: 0,
          name: "Agregado",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("vehicle_types", null, {});
  },
};
