import express from "express";
import ProductGroupController from "../controllers/productGroupController.js";
import checkToken from "../middlewares/checkToken.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = express.Router();

router.get('/', [checkToken], ProductGroupController.getAll)
router.delete("/:id", [checkToken, isAdmin], ProductGroupController.removeProductGroupById);

export default router;