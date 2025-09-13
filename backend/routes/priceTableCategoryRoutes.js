import express from "express";
import PriceTableCategoryController from "../controllers/priceTableCategoryController.js";
import checkToken from "../middlewares/checkToken.js";

const router = express.Router();

router.post(
  "/price-table",
  [checkToken],
  PriceTableCategoryController.getAllCategoryByPriceTableId
);

export default router;
