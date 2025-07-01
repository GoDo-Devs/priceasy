import { DataTypes, Model } from "sequelize";
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
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
    brand_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    model_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    year: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price_table_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "price_tables",
        key: "id",
      },
    },
    protectedValue: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    plan_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "plans",
        key: "id",
      },
    },
    monthlyFee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    implementList: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    selectedProducts: {
      type: DataTypes.JSON,
      allowNull: false,
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
