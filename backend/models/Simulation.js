import { DataTypes, Model, UUIDV4 } from "sequelize";
import sequelize from "../db/index.js";

class Simulation extends Model {
  static associate(models) {
    Simulation.belongsTo(models.User, {
      foreignKey: "user_id",
      targetKey: "id",
      as: "user",
    });

    Simulation.belongsTo(models.Client, {
      foreignKey: "client_id",
      targetKey: "id",
      as: "client",
    });

    Simulation.belongsTo(models.VehicleType, {
      foreignKey: "vehicle_type_id",
      targetKey: "id",
      as: "vehicleType",
    });

    Simulation.belongsTo(models.PriceTable, {
      foreignKey: "price_table_id",
      targetKey: "id",
      as: "priceTable",
    });

    Simulation.belongsTo(models.PriceTable, {
      foreignKey: "plan_id",
      targetKey: "id",
      as: "plan",
    });

    Simulation.belongsTo(models.VehicleCategory, {
      foreignKey: "category_id",
      targetKey: "id",
      as: "category",
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
      allowNull: false,
      references: {
        model: "vehicle_types",
        key: "id",
      },
    },
    vehicle_type_fipeCode: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "vehicle_categories",
        key: "id",
      },
    },
    plate: {
      type: DataTypes.STRING,
      allowNull: true,
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
    valueSelectedProducts: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    aggregates: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    selectedProducts: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    accession: {
      type: DataTypes.DECIMAL(10, 2),
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
    monthlyFee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    discountedInstallationPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    installationPrice: {
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
    isFranchisePercentage: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    franchiseValue: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    totalBasePrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    totalAccession: {
      type: DataTypes.DECIMAL(10, 2),
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

console.log("Associações do Simulation:", Simulation.associations);
