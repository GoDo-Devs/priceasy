import { DataTypes, Model } from "sequelize";
import sequelize from "../db/index.js";

class SimulationImplement extends Model {}

SimulationImplement.init(
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
    implement_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "implements",
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "SimulationImplement",
    tableName: "simulation_implements",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        unique: true,
        fields: ["simulation_id", "implement_id"],
      },
    ],
  }
);

export default SimulationImplement;
