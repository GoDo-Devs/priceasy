import ProductVehicleType from "../models/ProductVehicleType.js";
import Product from "../models/Product.js";

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

    const vehicleTypesByProductId = await ProductVehicleType.findAll({
      where: { product_id: id },
    });

    if (!vehicleTypesByProductId) {
      return res.status(422).json({
        message: "Produto não encontrado!",
      });
    }

    const vehicleTypesIds = vehicleTypesByProductId.map(
      (v) => v.vehicle_type_id
    );

    try {
      return res.status(200).json(vehicleTypesIds);
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao obter os tipos de Veículos do Produto.",
        error: error.message,
      });
    }
  }

  static async allProductsByVehicleTypeId(req, res) {
    const { vehicle_type_id } = req.body;

    try {
      const productVehicleTypes = await ProductVehicleType.findAll({
        where: { vehicle_type_id },
      });

      if (!productVehicleTypes.length) {
        return res.status(404).json({
          message: "Nenhum produto encontrado para esse tipo de veículo.",
        });
      }

      const productIds = productVehicleTypes.map((pvt) => pvt.product_id);

      const products = await Product.findAll({
        where: {
          id: productIds,
        },
      });

      return res.status(200).json({ products });
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao obter produtos pelo tipo de veículo.",
        error: error.message,
      });
    }
  }
}
