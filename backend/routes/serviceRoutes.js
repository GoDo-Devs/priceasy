import express from "express";
import ServiceController from "../controllers/serviceController.js";
import checkToken from "../middlewares/checkToken.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = express.Router();

router.post("/create", [checkToken, isAdmin], ServiceController.create);
router.get("/", [checkToken], ServiceController.getAll);
router.delete("/:id", [checkToken, isAdmin], ServiceController.removeServiceById);

export default router;
