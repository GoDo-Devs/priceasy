import dotenv from 'dotenv';
dotenv.config();

import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: "localhost",
    dialect: "mysql",
  }
);

try {
  await sequelize.authenticate();
  console.log("Conectado ao MySQL!");
} catch (err) {
  console.log(`Não foi possível conectar: ${err}`);
}

export default sequelize;
