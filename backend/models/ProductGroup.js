import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/index.js';

class ProductGroup extends Model {}

ProductGroup.init({
  id: {
    type: DataTypes.NUMBER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'ProductGroup',
  tableName: 'product_groups',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default ProductGroup;