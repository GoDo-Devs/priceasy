import express from "express";
import PlanController from "../controllers/planController.js";
import checkToken from "../middlewares/checkToken.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = express.Router();

router.post("/create", [checkToken, isAdmin], PlanController.create);
router.get("/", [checkToken], PlanController.getAll);
router.get("/:id", [checkToken], PlanController.getPlanById);
router.delete("/:id", [checkToken, isAdmin], PlanController.removePlanById);
router.patch("/edit/:id", [checkToken, isAdmin], PlanController.updatePlanById);

export default router;
