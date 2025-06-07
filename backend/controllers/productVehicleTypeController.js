import ProductVehicleType from "../models/ProductVehicleType.js";

export default class ProductVehicleTypeController {
  static async getAll(req, res) {
    try {
      const data = await ProductVehicleType.findAll();
      return res.status(200).json({ data });
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao obter os Produtos Tipos de Veículos.",
        error: error.message,
      });
    }
  }

  static async getProductById(req, res) {
    const id = req.params.id;

    const productIdExists = await ProductVehicleType.findAll({
      where: { product_id: id },
    });

    if (!productIdExists) {
      return res.status(422).json({
        message: "Produto não encontrado!",
      });
    }

    try {
      return res.status(200).json({ productIdExists });
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao obter os tipos de Veículos do Produto.",
        error: error.message,
      });
    }
  }
}
