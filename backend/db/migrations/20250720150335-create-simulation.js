"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("simulations", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
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
        allowNull: true,
        references: {
          model: "vehicle_types",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET DEFAULT",
      },
      brand_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      model_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      year: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      price_table_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "price_tables",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET DEFAULT",
      },
      protectedValue: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      fipeValue: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      fipeCode: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      plan_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "plans",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET DEFAULT",
      },
      monthlyFee: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      valueSelectedProducts: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      implementList: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      selectedProducts: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      discountedAccession: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      discountedMonthlyFee: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      discountedInstallationPrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      discountedAccessionCouponId: {
        type: Sequelize.UUID,
        allowNull: true, 
      },

      discountedMonthlyFeeCouponId: {
        type: Sequelize.UUID,
        allowNull: true,
      },

      discountedInstallationPriceCouponId: {
        type: Sequelize.UUID,
        allowNull: true,
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
