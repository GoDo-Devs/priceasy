import express from "express";
import CategoryController from "../controllers/categoryController.js";
import checkToken from "../middlewares/checkToken.js";

const router = express.Router();

router.get('/', checkToken, CategoryController.getAll)

export default router;