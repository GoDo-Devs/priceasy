import express from "express";
import { createValidator } from "express-joi-validation";
import ImplementController from "../controllers/implementController.js";
import checkToken from "../middlewares/checkToken.js";
import { createImplementSchema } from "../validations/CreateImplement.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/create",
  validator.body(createImplementSchema),
  [checkToken, isAdmin],
  ImplementController.create
);
router.get("/", [checkToken], ImplementController.getAll);
router.delete(
  "/:id",
  [checkToken, isAdmin],
  ImplementController.removeImplementById
);
router.patch(
  "/:id",
  [checkToken, isAdmin],
  ImplementController.updateImplementById
);

export default router;
