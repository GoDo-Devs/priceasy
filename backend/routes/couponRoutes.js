import express from "express";
import CouponController from "../controllers/couponController.js";
import checkToken from "../middlewares/checkToken.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = express.Router();

router.post("/create", [checkToken, isAdmin], CouponController.create);
router.get("/", [checkToken], CouponController.getAll);
router.delete("/:id", [checkToken, isAdmin], CouponController.removeCouponById);
router.patch(
  "/:id",
  [checkToken, isAdmin],
  CouponController.updateCouponById
);

export default router;
