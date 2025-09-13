import { Model, DataTypes } from "sequelize";
import sequelize from "../db/index.js";

class FipeYear extends Model {
  static associate(models) {
    FipeYear.belongsTo(models.FipeModel, {
      foreignKey: "fipe_model",
      as: "fipe_model",
    });
  }
}

FipeYear.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      autoIncrement: true,
    },
    year: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fuel: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fipe_model_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "fipe_models",
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "FipeYear",
    tableName: "fipe_years",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default FipeYear;