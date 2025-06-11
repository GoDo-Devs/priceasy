"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("price_tables", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      brands: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      startingYear: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      finalYear: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      plansSelected: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      vehicle_type_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "vehicle_types",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET DEFAULT",
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "vehicle_categories",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET DEFAULT",
      },
      ranges: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      created_at: {
        allowNull: false,
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        allowNull: false,
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("price_tables");
  },
};
