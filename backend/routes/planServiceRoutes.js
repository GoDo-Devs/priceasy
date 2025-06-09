import express from "express";
import PlanServiceController from "../controllers/planServiceController.js";
import checkToken from "../middlewares/checkToken.js";

const router = express.Router();

router.get('/', [checkToken], PlanServiceController.getAll)
router.get('/:id', [checkToken], PlanServiceController.getServicesByPlanId)

export default router;