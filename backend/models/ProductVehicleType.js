import { DataTypes, Model } from "sequelize";
import sequelize from "../db/index.js";

class ProductVehicleType extends Model {}

ProductVehicleType.init(
  {
    vehicle_type_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "vehicle_types",
        key: "id",
      },
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
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
  }
);

export default ProductVehicleType;
