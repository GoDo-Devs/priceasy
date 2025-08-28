import express from "express";
import userController from "../controllers/userController.js";
import checkToken from "../middlewares/checkToken.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = express.Router();

router.get("/", [checkToken, isAdmin], userController.getAll);
router.post("/by-id", [checkToken, isAdmin], userController.getUserById);

export default router;
