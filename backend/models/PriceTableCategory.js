import { DataTypes, Model } from "sequelize";
import sequelize from "../db/index.js";

class PriceTableCategory extends Model {}

PriceTableCategory.init(
  {
    price_table_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "price_tables",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "vehicle_categories",
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    modelName: "PriceTableCategory",
    tableName: "price_table_categories",
    timestamps: false,
  }
);

export default PriceTableCategory;
