import { DataTypes, Model } from "sequelize";
import sequelize from "../db/index.js";

class PlanService extends Model {
  static associate(models) {
    PlanService.belongsTo(models.Service, {
      foreignKey: "service_id",
      as: "services",
    });
  }
}

PlanService.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    plan_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "plans",
        key: "id",
      },
    },
    service_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "services",
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "PlanService",
    tableName: "plan_services",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        unique: true,
        fields: ["plan_id", "service_id"],
      },
    ],
  }
);

export default PlanService;
