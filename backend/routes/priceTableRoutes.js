import express from "express";
import PriceTableController from "../controllers/priceTableController.js";
import checkToken from "../middlewares/checkToken.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = express.Router();

router.post("/create", [checkToken, isAdmin], PriceTableController.create);
router.get("/", [checkToken], PriceTableController.getAll);
router.delete(
  "/:id",
  [checkToken, isAdmin],
  PriceTableController.removePriceTableById
);
router.put(
  "/edit/:id",
  [checkToken, isAdmin],
  PriceTableController.editPriceTable
);

export default router;
