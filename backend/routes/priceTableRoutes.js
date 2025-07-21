import express from "express";
import PriceTableController from "../controllers/priceTableController.js";
import checkToken from "../middlewares/checkToken.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = express.Router();

router.post("/create", [checkToken, isAdmin], PriceTableController.create);
router.get("/", [checkToken], PriceTableController.getAll);
router.get("/:id", [checkToken], PriceTableController.getPriceTableId);
router.post("/filter", PriceTableController.getPriceTablesByFilter);
router.post("/plans", PriceTableController.getPlansByPriceTableModelValue);
router.delete(
  "/:id",
  [checkToken, isAdmin],
  PriceTableController.removePriceTableById
);
router.patch(
  "/edit/:id",
  [checkToken, isAdmin],
  PriceTableController.editPriceTable
);

export default router;
