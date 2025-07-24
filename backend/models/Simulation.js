import { DataTypes, Model, UUIDV4 } from "sequelize";
import sequelize from "../db/index.js";

class Simulation extends Model {
  static associate(models) {
    Simulation.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "users",
    });

    Simulation.belongsTo(models.Client, {
      foreignKey: "client_id",
      as: "clients",
    });

    Simulation.belongsTo(models.VehicleType, {
      foreignKey: "vehicle_type_id",
      as: "vehicle_types",
    });

    Simulation.belongsTo(models.PriceTable, {
      foreignKey: "price_table_id",
      as: "price_tables",
    });

    Simulation.belongsTo(models.PriceTable, {
      foreignKey: "plan_id",
      as: "plans",
    });
  }
}

Simulation.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "clients",
        key: "id",
      },
    },
    vehicle_type_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "vehicle_types",
        key: "id",
      },
    },
    brand_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    model_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    price_table_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "price_tables",
        key: "id",
      },
    },
    protectedValue: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    fipeValue: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    fipeCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    plan_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "plans",
        key: "id",
      },
    },
    monthlyFee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    valueSelectedProducts: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    implementList: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    selectedProducts: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    discountedAccession: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    discountedMonthlyFee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    discountedInstallationPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    discountedAccessionCouponId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    discountedMonthlyFeeCouponId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    discountedInstallationPriceCouponId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Simulation",
    tableName: "simulations",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Simulation;
