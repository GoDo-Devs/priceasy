import { DataTypes, Model } from "sequelize";
import sequelize from "../db/index.js";

class SimulationProduct extends Model {}

SimulationProduct.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    simulation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "simulations",
        key: "id",
      },
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "products",
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "SimulationProduct",
    tableName: "simulation_products",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        unique: true,
        fields: ["simulation_id", "product_id"],
      },
    ],
  }
);

export default SimulationProduct;
