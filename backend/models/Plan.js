import { DataTypes, Model } from "sequelize";
import sequelize from "../db/index.js";

class Plan extends Model {
  static associate(models) {
    Plan.belongsTo(models.VehicleType, {
      foreignKey: "vehicle_type_id",
      as: "vehicle_types",
    });

    Plan.belongsToMany(models.Service, {
      through: models.PlansService,
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
    vehicle_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "vehicle_types",
        key: "id",
      },
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
