import express from "express";
import PlanServiceController from "../controllers/planServiceController.js";
import checkToken from "../middlewares/checkToken.js";

const router = express.Router();

router.get('/', [checkToken], PlanServiceController.getAll)

export default router;