import { DataTypes, Model } from "sequelize";
import sequelize from "../db/index.js";

class Service extends Model {
  static associate(models) {
    Service.belongsTo(models.Category, {
      foreignKey: "category_id",
      as: "categories",
    });
  }
}

Service.init(
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
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: null,
      references: {
        model: "categories",
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "Service",
    tableName: "services",
    timestamps: true,
    createdAt: "created_at", 
    updatedAt: "updated_at",
  }
);

export default Service;
