import express from "express";
import SimulationController from "../controllers/simulationController.js";
import checkToken from "../middlewares/checkToken.js";

const router = express.Router();

router.post("/create", [checkToken], SimulationController.createSimulation);
router.get("/metrics", [checkToken], SimulationController.getMetrics);
router.get("/", [checkToken], SimulationController.getAllSimulations);
router.get("/:id", [checkToken], SimulationController.getSimulationById);
router.put("/:id", [checkToken], SimulationController.updateSimulationById);

export default router;
