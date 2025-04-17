import dotenv from 'dotenv';
dotenv.config();

import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  }
);

try {
  await sequelize.authenticate();
} catch (err) {
  console.log(`Não foi possível conectar MySQL: ${err}`);
}

export default sequelize;
