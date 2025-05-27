import { DataTypes, Model } from "sequelize";
import sequelize from "../db/index.js";

class Simulation extends Model {
  static associate(models) {
    Simulation.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "users",
    });

    Simulation.belongsTo(models.VehicleType, {
      foreignKey: "vehicle_type_id",
      as: "vehicle_types",
    });

    Simulation.belongsTo(models.Client, {
      foreignKey: "client_id",
      as: "clients",
    });

    Simulation.belongsToMany(models.Product, {
      through: models.SimulationProduct,
      foreignKey: "simulation_id",
      otherKey: "product_id",
      as: "simulation_products",
    });

    Simulation.belongsToMany(models.Implement, {
      through: models.SimulationImplement,
      foreignKey: "simulation_id",
      otherKey: "implement_id",
      as: "simulation_implements",
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
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    download_link: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    vehicle_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "vehicle_types",
        key: "id",
      },
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "clients",
        key: "id",
      },
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
