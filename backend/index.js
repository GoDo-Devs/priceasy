import express from "express";
import cors from "cors";
const app = express();
import authRoutes from "./routes/authRoutes.js";

app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.static("public"));

app.use("/", authRoutes);

app.listen(4000, "0.0.0.0", () => {
  console.log("Backend running on port 4000");
});
