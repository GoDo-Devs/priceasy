import { DataTypes, Model } from "sequelize";
import sequelize from "../db/index.js";

class ProductVehicleType extends Model {}

ProductVehicleType.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    vehicle_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "vehicle_types",
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
    modelName: "ProductVehicleType",
    tableName: "product_vehicle_types",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        unique: true,
        fields: ["product_id", "vehicle_type_id"],
      },
    ],
  }
);

export default ProductVehicleType;
