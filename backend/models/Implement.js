import { DataTypes, Model } from "sequelize";
import sequelize from "../db/index.js";

class Implement extends Model {
  static associate(models) {
    Implement.belongsToMany(models.Simulation, {
      through: models.Simulation,
      foreignKey: "product_id",
      otherKey: "simulation_id",
      as: "simulations",
    });
  }
}

Implement.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Implement",
    tableName: "implements",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Implement;
