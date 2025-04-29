import { DataTypes, Model, UUIDV4 } from 'sequelize';
import sequelize from '../db/index.js';

class Client extends Model {}

Client.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cpf: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Client',
  tableName: 'clients',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default Client;
