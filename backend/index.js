import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { initializeModels } from "./models/index.js";
import sequelize from "./db/index.js";

const app = express();

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import productGroupRoutes from "./routes/productGroupRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import vehicleTypeRoutes from "./routes/vehicleTypeRoutes.js";
import productVehicleTypeRoutes from "./routes/productVehicleTypeRoutes.js";
import implementRoutes from "./routes/implementRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import planRoutes from "./routes/planRoutes.js";
import planServiceRoutes from "./routes/planServiceRoutes.js";
import vehicleCategoryRoutes from "./routes/vehicleCategoryRoutes.js";
import priceTableRoutes from "./routes/priceTableRoutes.js";
import fipeRoutes from "./routes/fipeRoutes.js";
import simulationRoutes from "./routes/simulationRoutes.js";
import pdfRoutes from "./routes/pdfRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import userCouponRoutes from "./routes/userCouponRoutes.js";

app.use(bodyParser.json());
app.use(cors({ credentials: true, origin: process.env.FRONTEND_URL }));
app.use(express.static("public"));

app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/product-groups", productGroupRoutes);
app.use("/clients", clientRoutes);
app.use("/users", userRoutes);
app.use("/vehicle-types", vehicleTypeRoutes);
app.use("/product-vehicle-types", productVehicleTypeRoutes);
app.use("/implements", implementRoutes);
app.use("/categories", categoryRoutes);
app.use("/services", serviceRoutes);
app.use("/plans", planRoutes);
app.use("/plan-services", planServiceRoutes);
app.use("/vehicle-categories", vehicleCategoryRoutes);
app.use("/price-tables", priceTableRoutes);
app.use("/fipe", fipeRoutes);
app.use("/simulations", simulationRoutes);
app.use("/pdf", pdfRoutes);
app.use("/coupons", couponRoutes);
app.use("/user-coupons", userCouponRoutes);

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
