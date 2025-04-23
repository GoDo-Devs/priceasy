import express from "express";
const router = express.Router();

import authController from "../controllers/authController.js";
import checkToken from "../middlewares/checkToken.js";

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/checkuser", authController.checkUser);
router.get("/:id", authController.getUserById);
router.patch("/edit/:id", checkToken, authController.editUser);

export default router;
