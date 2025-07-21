import { DataTypes, Model } from "sequelize";
import sequelize from "../db/index.js";

class Coupon extends Model {
  static associate(models) {
    Coupon.belongsToMany(models.User, {
      through: models.UserCoupon,
      foreignKey: "coupon_id",
      otherKey: "user_id",
      as: "users",
    });
  }
}

Coupon.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    validity: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    discountPercentage: {
      type: DataTypes.NUMBER,
      allowNull: false,
    }
  },
  {
    sequelize,
    modelName: "Coupon",
    tableName: "coupons",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Coupon;
