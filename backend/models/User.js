import { DataTypes, Model, UUIDV4 } from "sequelize";
import sequelize from "../db/index.js";

class User extends Model {
  static associate(models) {
    User.belongsToMany(models.Coupon, {
      through: models.UserCoupon,
      foreignKey: "user_id",
      otherKey: "coupon_id",
      as: "coupons",
    });
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    is_admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default User;
