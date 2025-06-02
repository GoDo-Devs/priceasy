import express from "express";
import ProductVehicleTypeController from "../controllers/productVehicleTypeController.js"
import checkToken from "../middlewares/checkToken.js";

const router = express.Router();

router.get("/", [checkToken], ProductVehicleTypeController.getAll);

export default router;