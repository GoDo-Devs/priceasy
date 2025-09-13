import PriceTableCategory from "../models/PriceTableCategory.js";
import VehicleCategory from "../models/VehicleCategory.js";
import { Op } from "sequelize";

export default class PriceTableCategoryController {
  static async getAllCategoryByPriceTableId(req, res) {
    const { price_table_id } = req.body; 

    try {
      const priceTableCategories = await PriceTableCategory.findAll({
        where: { price_table_id },
      });

      if (!priceTableCategories.length) {
        return res.status(404).json({
          message: "Nenhuma categoria encontrada para essa Tabela de Preços.",
        });
      }

      const categoryIds = priceTableCategories.map((pvt) => pvt.category_id);

      const categories = await VehicleCategory.findAll({
        where: {
          id: { [Op.in]: categoryIds },
        },
      });

      return res.status(200).json({ categories });
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao obter categorias pela Tabela de Preços.",
        error: error.message,
      });
    }
  }
}
