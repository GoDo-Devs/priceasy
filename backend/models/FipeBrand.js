
import { DataTypes, Model } from "sequelize";
import sequelize from "../db/index.js";

class FipeBrand extends Model {
  static associate(models) {
    FipeBrand.belongsTo(models.VehicleType, {
        foreignKey: "vehicle_type_id",
        as: "vehicle_type",
    })
  }
}

FipeBrand.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vehicle_type_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "vehicle_types",
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "FipeBrand",
    tableName: "fipe_brands",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default FipeBrand;