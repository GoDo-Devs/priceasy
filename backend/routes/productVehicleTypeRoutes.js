import express from "express";
import ProductVehicleTypeController from "../controllers/productVehicleTypeController.js";
import checkToken from "../middlewares/checkToken.js";

const router = express.Router();

router.get("/", [checkToken], ProductVehicleTypeController.getAll);
router.get("/:id", [checkToken], ProductVehicleTypeController.getProductById);
router.post(
  "/vehicle-type",
  [checkToken],
  ProductVehicleTypeController.allProductsByVehicleTypeId
);

export default router;
