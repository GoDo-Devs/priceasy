import express from "express";
import { createValidator } from "express-joi-validation";
import ProductController from "../controllers/productController.js";
import checkToken from "../middlewares/checkToken.js";
import { createProductSchema } from "../validations/CreateProduct.js";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/create",
  validator.body(createProductSchema),
  checkToken,
  ProductController.create
);
router.get("/", checkToken, ProductController.getAll);
router.get("/:id", checkToken, ProductController.getProductById);
router.delete("/:id", checkToken, ProductController.removeProductById);
router.patch(
  "/:id",
  validator.body(createProductSchema),
  checkToken,
  ProductController.updateProductById
);

export default router;
