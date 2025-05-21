import { DataTypes, Model } from "sequelize";
import sequelize from "../db/index.js";

class Product extends Model {
  static associate(models) {
    Product.belongsTo(models.ProductGroup, {
      foreignKey: "product_group_id",
      as: "product_groups",
    });

    Product.belongsToMany(models.VehicleType, {
      through: models.ProductVehicleType,
      foreignKey: "product_id",
      otherKey: "vehicle_type_id",
      as: "vehicle_types",
    });

    Product.belongsToMany(models.Simulation, {
      through: models.Simulation,
      foreignKey: "product_id",
      otherKey: "simulation_id",
      as: "simulations",
    });
  }
}

Product.init(
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
    product_group_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      references: {
        model: "product_groups",
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "Product",
    tableName: "products",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Product;
