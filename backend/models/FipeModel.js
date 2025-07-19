import { DataTypes, Model } from "sequelize";
import sequelize from "../db/index.js";

class FipeModel extends Model {
  static associate(models) {
    FipeModel.belongsTo(models.FipeBrand, {
      foreignKey: "fipe_brand_id",
      as: "fipe_brand",
    })
    FipeModel.hasMany
  }
}

FipeModel.init(  
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fipe_brand_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "fipe_brands",
        key: "id",
      }
    }
},  
  {
    sequelize,
    tableName: "fipe_models",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    modelName: "FipeModel",
  }
)

export default FipeModel;