import express from "express";
import { createValidator } from "express-joi-validation";
import ProductController from "../controllers/productController.js";
import checkToken from "../middlewares/checkToken.js";
import { createProductSchema } from "../validations/CreateProduct.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/create",
  validator.body(createProductSchema),
  [checkToken, isAdmin],
  ProductController.create
);
router.get("/", [checkToken, isAdmin], ProductController.getAll);
router.get("/:id", [checkToken, isAdmin], ProductController.getProductById);
router.delete("/:id", [checkToken, isAdmin], ProductController.removeProductById);
router.patch(
  "/:id",
  validator.body(createProductSchema),
  [checkToken, isAdmin],
  ProductController.updateProductById
);

export default router;
