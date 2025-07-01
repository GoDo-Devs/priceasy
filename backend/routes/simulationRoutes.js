import express from "express";
import SimulationController from "../controllers/simulationController.js";
import checkToken from "../middlewares/checkToken.js";

const router = express.Router();

router.post("/create", [checkToken], SimulationController.createSimulation);
router.get("/", checkToken, SimulationController.getAllSimulations);
router.get("/:id", SimulationController.getSimulationById); 

export default router;
