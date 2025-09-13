import express from "express";
import { createValidator } from "express-joi-validation";
import CouponController from "../controllers/couponController.js";
import checkToken from "../middlewares/checkToken.js";
import isAdmin from "../middlewares/isAdmin.js";
import { createCouponSchema } from "../validations/CreateCoupon.js";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/create",
  validator.body(createCouponSchema),
  [checkToken, isAdmin],
  CouponController.create
);
router.get("/", [checkToken], CouponController.getAll);
router.delete("/:id", [checkToken, isAdmin], CouponController.removeCouponById);
router.patch(
  "/:id",
  [checkToken, isAdmin],
  CouponController.updateCouponById
);

export default router;
