import express from "express";
import { createValidator } from "express-joi-validation";
import ClientController from "../controllers/clientController.js";
import checkToken from "../middlewares/checkToken.js";
import { createClientSchema } from "../validations/CreateClient.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/create",
  validator.body(createClientSchema),
  [checkToken, isAdmin],
  ClientController.create
);
router.get("/", [checkToken, isAdmin], ClientController.getAll);

export default router;
