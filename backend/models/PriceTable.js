import { DataTypes, Model } from "sequelize";
import sequelize from "../db/index.js";

class PriceTable extends Model {
  static associate(models) {
    PriceTable.belongsTo(models.VehicleType, {
      foreignKey: "vehicle_type_id",
      as: "vehicle_types",
    });

    PriceTable.belongsToMany(models.VehicleCategory, {
      through: models.PriceTableCategory,
      foreignKey: "price_table_id",
      otherKey: "category_id",
      as: "categories",
    });
  }
}

PriceTable.init(
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
    brands: DataTypes.JSON,
    models: DataTypes.JSON,
    plansSelected: {
      type: DataTypes.JSON,
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
    ranges: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "PriceTable",
    tableName: "price_tables",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default PriceTable;
