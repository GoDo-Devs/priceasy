import { DataTypes, Model } from "sequelize";
import sequelize from "../db/index.js";

class PriceTablePlan extends Model {}

PriceTablePlan.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    price_table_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "price_tables",
        key: "id",
      },
    },
    plan_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "plans",
        key: "id",
      },
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "PriceTablePlan",
    tableName: "price_table_plans",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        unique: true,
        fields: ["price_table_id", "plan_id"],
      },
    ],
  }
);

export default PriceTablePlan;
