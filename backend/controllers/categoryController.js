import Category from "../models/Category.js";

export default class CategoryController {
  static async getAll(req, res) {
    try {
      const categories = await Category.findAll({
        order: [["name", "ASC"]],
      });
      return res.status(200).json({ categories});
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao obter as Categorias.",
        error: error.message,
      });
    }
  }
}
