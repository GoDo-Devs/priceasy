import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { initializeModels } from "./models/index.js";
import sequelize from "./db/index.js";

import routes from "./routes/index.js";

const app = express();

app.use(bodyParser.json());
app.use(cors({ credentials: true, origin: process.env.FRONTEND_URL }));
app.use(express.static("public"));

app.use("/", routes);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexão com o banco de dados estabelecida com sucesso");

    await initializeModels();

    app.listen(4000, "0.0.0.0", () => {
      console.log("✅ Backend running on port 4000");
    });
  } catch (error) {
    console.error("❌ Erro ao iniciar o servidor:", error);
    process.exit(1);
  }
};

startServer();
