import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
const app = express();
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import productGroupRoutes from "./routes/productGroupRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import vehicleTypeRoutes from "./routes/vehicleTypeRoutes.js";
import productVehicleTypeRoutes from "./routes/productVehicleTypeRoutes.js"
import implementRoutes from "./routes/implementRoutes.js"
import categoryRoutes from "./routes/categoryRoutes.js"
import serviceRoutes from "./routes/serviceRoutes.js"
import planRoutes from "./routes/planRoutes.js"
import planServiceRoutes from "./routes/planServiceRoutes.js"
import vehicleCategoryRoutes from "./routes/vehicleCategoryRoutes.js"
import fipeRoutes from "./routes/fipeRoutes.js";

app.use(bodyParser.json());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
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
app.use("/fipe", fipeRoutes);

app.listen(4000, "0.0.0.0", () => {
  console.log("Backend running on port 4000");
});
