import express from "express";
import userCouponController from "../controllers/userCouponController.js";
import checkToken from "../middlewares/checkToken.js";

const router = express.Router();

router.get("/:id", [checkToken], userCouponController.getUserByCouponId);

export default router;
