import { DataTypes, Model } from "sequelize";
import sequelize from "../db/index.js";

class VehicleCategory extends Model {
  static associate(models) {
    VehicleCategory.belongsTo(models.VehicleType, {
      foreignKey: "vehicle_type_id",
      as: "vehicle_types",
    });
  }
}

VehicleCategory.init(
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
    modelName: "VehicleCategory",
    tableName: "vehicle_categories",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default VehicleCategory;
