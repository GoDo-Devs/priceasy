import express from "express";
import VehicleTypeController from "../controllers/vehicleTypeController.js";
import checkToken from "../middlewares/checkToken.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = express.Router();

router.post(
  "/create",
  [checkToken, isAdmin],
  VehicleTypeController.create
);
router.get("/", [checkToken], VehicleTypeController.getAll);
router.delete("/:id", [checkToken, isAdmin], VehicleTypeController.removeVehicleTypeById);

export default router;
