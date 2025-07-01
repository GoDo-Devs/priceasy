"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("simulations", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET DEFAULT",
      },
      client_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "clients",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET DEFAULT",
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
      brand_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      model_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      year: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      price_table_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "price_tables",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET DEFAULT",
      },
      protectedValue: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      plan_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "plans",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET DEFAULT",
      },
      monthlyFee: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      implementList: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      selectedProducts: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("simulations");
  },
};
