import express from "express";
import PlanController from "../controllers/planController.js";
import checkToken from "../middlewares/checkToken.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = express.Router();

router.post("/create", [checkToken, isAdmin], PlanController.create);
router.get("/", [checkToken], PlanController.getAll);
router.delete(
  "/:id",
  [checkToken, isAdmin],
  PlanController.removePlanById
);

export default router;
