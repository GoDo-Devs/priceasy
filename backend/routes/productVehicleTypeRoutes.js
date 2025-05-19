import express from "express";
import ProductVehicleTypeController from "../controllers/productVehicleTypeController.js"
import checkToken from "../middlewares/checkToken.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = express.Router();

router.get("/", [checkToken, isAdmin], ProductVehicleTypeController.getAll);

export default router;