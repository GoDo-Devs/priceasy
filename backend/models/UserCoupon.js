import { DataTypes, Model } from "sequelize";
import sequelize from "../db/index.js";

class UserCoupon extends Model {
  static associate(models) {
    UserCoupon.belongsTo(models.Coupon, {
      foreignKey: "coupon_id",
      as: "Coupon",
    });
    UserCoupon.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "User",
    });
  }
}

UserCoupon.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    coupon_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "coupons",
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "UserCoupon",
    tableName: "user_coupons",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        unique: true,
        fields: ["user_id", "coupon_id"],
      },
    ],
  }
);

export default UserCoupon;
