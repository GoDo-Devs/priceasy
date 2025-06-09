import { DataTypes, Model } from "sequelize";
import sequelize from "../db/index.js";

class Plan extends Model {
  static associate(models) {
    Plan.belongsToMany(models.Service, {
      through: models.PlanService,
      foreignKey: "plan_id",
      otherKey: "service_id",
      as: "services",
    });
  }
}

Plan.init(
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
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Plan",
    tableName: "plans",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Plan;
