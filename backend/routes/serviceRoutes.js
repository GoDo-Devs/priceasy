import express from "express";
import ServiceController from "../controllers/serviceController.js";
import checkToken from "../middlewares/checkToken.js";

const router = express.Router();

router.post('/create', checkToken, ServiceController.create)
router.get('/', checkToken, ServiceController.getAll)

export default router;