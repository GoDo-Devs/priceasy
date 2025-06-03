import { DataTypes, Model } from "sequelize";
import sequelize from "../db/index.js";

class PriceTable extends Model {
  static associate(models) {
    PriceTable.belongsToMany(models.Plan, {
      through: models.PriceTablePlan,
      foreignKey: "table_price_id",
      otherKey: "plan_id",
      as: "plans",
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
