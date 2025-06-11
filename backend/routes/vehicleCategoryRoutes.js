import express from "express";
import VehicleCategoryController from "../controllers/vehicleCategoryController.js";
import checkToken from "../middlewares/checkToken.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = express.Router();

router.post("/create", [checkToken, isAdmin], VehicleCategoryController.create);
router.get("/", [checkToken], VehicleCategoryController.getAll);
router.get(
  "/:id",
  [checkToken],
  VehicleCategoryController.getVehicleCategoryByIdVehicleTypeId
);
router.delete(
  "/:id",
  [checkToken, isAdmin],
  VehicleCategoryController.removeVehicleCategoryById
);

export default router;
