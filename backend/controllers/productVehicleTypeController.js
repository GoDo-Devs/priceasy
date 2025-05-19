import ProductVehicleType from "../models/ProductVehicleType.js";

export default class ProductVehicleTypeController {
  static async getAll(req, res) {
    try {
      const data = await ProductVehicleType.findAll();
      return res.status(200).json({data});
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao obter os Produtos Tipos de Veículos.",
        error: error.message,
      });
    }
  }
}