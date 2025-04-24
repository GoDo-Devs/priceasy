import express from "express";
import { createValidator } from "express-joi-validation";
import authController from "../controllers/authController.js";
import checkToken from "../middlewares/checkToken.js";
import { registerSchema } from "../validations/authValidations.js";
import { loginSchema } from "../validations/authValidations.js";

const router = express.Router();
const validator = createValidator({});

router.post("/register", validator.body(registerSchema), authController.register);
router.post("/login",  validator.body(loginSchema), authController.login);
router.get("/checkuser", authController.checkUser);
router.get("/:id", authController.getUserById);
router.patch("/edit/:id",validator.body(registerSchema), checkToken, authController.editUser);

export default router;
