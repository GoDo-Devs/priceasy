import express from "express";
import { createValidator } from "express-joi-validation";
import AuthController from "../controllers/authController.js";
import checkToken from "../middlewares/checkToken.js";
import { registerSchema } from "../validations/AuthUser.js";
import { loginSchema } from "../validations/AuthUser.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/register",
  validator.body(registerSchema),
  AuthController.register
);
router.post("/login", validator.body(loginSchema), AuthController.login);
router.get("/checkuser", AuthController.checkUser);
router.get("/:id", [checkToken, isAdmin], AuthController.getUserById);
router.patch(
  "/edit/:id",
  validator.body(registerSchema),
  [checkToken, isAdmin],
  AuthController.editUser
);

export default router;
