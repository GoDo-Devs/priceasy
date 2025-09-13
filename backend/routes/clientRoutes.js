import express from "express";
import { createValidator } from "express-joi-validation";
import ClientController from "../controllers/clientController.js";
import checkToken from "../middlewares/checkToken.js";
import { createClientSchema } from "../validations/CreateClient.js";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/create",
  validator.body(createClientSchema),
  [checkToken],
  ClientController.create
);
router.get("/", [checkToken], ClientController.getAll);
router.get("/:id", [checkToken], ClientController.getClientById);
router.post("/cpf", [checkToken], ClientController.getByCpf);
router.post("/search", [checkToken], ClientController.searchCpfs);

export default router;
