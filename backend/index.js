import express from "express";
import cors from "cors";
import bodyParser from 'body-parser'
const app = express();
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";

app.use(bodyParser.json());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.static("public"));

app.use("/users", authRoutes);
app.use("/products", productRoutes);

app.listen(4000, "0.0.0.0", () => {
  console.log("Backend running on port 4000");
});
