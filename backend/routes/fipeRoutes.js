import express from "express";
import { createValidator } from "express-joi-validation";
import checkToken from "../middlewares/checkToken.js";
import FipeController from "../controllers/fipeController.js";
import { brandsSchema, modelsSchema, modelYearSchema, priceSchema } from "../validations/FipeValidators.js";

const router = express.Router();
const validator = createValidator({});

router.post("/brands", validator.body(brandsSchema), [checkToken], FipeController.getBrands);
router.get("/models", validator.body(modelsSchema), [checkToken], FipeController.getModels);
router.get("/years", validator.body(modelYearSchema), [checkToken], FipeController.getModelYear);
router.get("/price", validator.body(priceSchema), [checkToken], FipeController.getPrice);

export default router;