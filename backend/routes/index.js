import { Router } from "express";

import authRoutes from "./authRoutes.js";
import productRoutes from "./productRoutes.js";
import productGroupRoutes from "./productGroupRoutes.js";
import clientRoutes from "./clientRoutes.js";
import userRoutes from "./userRoutes.js";
import vehicleTypeRoutes from "./vehicleTypeRoutes.js";
import productVehicleTypeRoutes from "./productVehicleTypeRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import serviceRoutes from "./serviceRoutes.js";
import planRoutes from "./planRoutes.js";
import planServiceRoutes from "./planServiceRoutes.js";
import vehicleCategoryRoutes from "./vehicleCategoryRoutes.js";
import priceTableRoutes from "./priceTableRoutes.js";
import fipeRoutes from "./fipeRoutes.js";
import simulationRoutes from "./simulationRoutes.js";
import pdfRoutes from "./pdfRoutes.js";
import couponRoutes from "./couponRoutes.js";
import userCouponRoutes from "./userCouponRoutes.js";
import priceTableCategoryRoutes from "./priceTableCategoryRoutes.js"

const router = Router();

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/product-groups", productGroupRoutes);
router.use("/clients", clientRoutes);
router.use("/users", userRoutes);
router.use("/vehicle-types", vehicleTypeRoutes);
router.use("/product-vehicle-types", productVehicleTypeRoutes);
router.use("/categories", categoryRoutes);
router.use("/services", serviceRoutes);
router.use("/plans", planRoutes);
router.use("/plan-services", planServiceRoutes);
router.use("/vehicle-categories", vehicleCategoryRoutes);
router.use("/price-tables", priceTableRoutes);
router.use("/fipe", fipeRoutes);
router.use("/simulations", simulationRoutes);
router.use("/pdf", pdfRoutes);
router.use("/coupons", couponRoutes);
router.use("/user-coupons", userCouponRoutes);
router.use("/price-table-categories", priceTableCategoryRoutes);

export default router;
