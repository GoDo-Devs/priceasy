import express from "express";
import PlanController from "../controllers/planController.js";
import checkToken from "../middlewares/checkToken.js";

const router = express.Router();

router.post("/create", checkToken, PlanController.create);
router.get("/", checkToken, PlanController.getAll);

export default router;
