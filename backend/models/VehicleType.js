import { DataTypes, Model } from "sequelize";
import sequelize from "../db/index.js";

class VehicleType extends Model {
  static associate(models) {
    VehicleType.belongsToMany(models.Product, {
      through: models.ProductVehicleType,
      foreignKey: "vehicle_type_id",
      otherKey: "product_id",
      as: "products",
    });
  }
}

VehicleType.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fipeCode: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    aggregate: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "VehicleType",
    tableName: "vehicle_types",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default VehicleType;
