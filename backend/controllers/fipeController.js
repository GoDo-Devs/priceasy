import FipeTableService from "../services/FipeTableService.js";
import VehicleType from "../models/VehicleType.js";
import FipeBrand from "../models/FipeBrand.js";
import FipeModel from "../models/FipeModel.js";
import FipeYear from "../models/FipeYear.js";

export default class FipeController {
  static async getBrands(req, res) {
    const { vehicleType } = req.body;

    const vehicleTypeId = await VehicleType.findByPk(vehicleType);

    if (!vehicleTypeId) {
      res.status(404).json({ message: "Tipo de veículo não encontrado!" });
      return;
    }

    try {
      const brands = await FipeBrand.findAll({
        where: { vehicle_type_id: vehicleType },
      });

      return res.status(200).json({
        brands: brands,
      });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  }

  static async getModels(req, res) {
    const { vehicleType, brandCode } = req.body;

    const vehicleTypeId = await VehicleType.findByPk(vehicleType);
    if (!vehicleTypeId) {
      return res
        .status(404)
        .json({ message: "Tipo de veículo não encontrado!" });
    }

    const brand = await FipeBrand.findByPk(brandCode);
    if (!brand) {
      return res.status(404).json({ message: "Marca não encontrada!" });
    }

    try {
      const models = await FipeModel.findAll({
        where: {
          fipe_brand_id: brandCode,
        },
      });

      return res.status(200).json({ models: models });
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
  }

  static async getModelYear(req, res) {
    const { vehicleType, brandCode, modelCode } = req.body;

    const vehicleTypeId = await VehicleType.findByPk(vehicleType);
    if (!vehicleTypeId) {
      return res
        .status(404)
        .json({ message: "Tipo de veículo não encontrado!" });
    }

    const brand = await FipeBrand.findByPk(brandCode);
    if (!brand) {
      return res.status(404).json({ message: "Marca não encontrada!" });
    }

    const model = await FipeModel.findByPk(modelCode)
    if (!model) {
      return res.status(404).json({ message: "Modelo não encontrado!" });
    }

    try {
      const years = await FipeYear.findAll({
        where: {
          fipe_model_id: modelCode,
        },
      });

      return res.status(200).json({ years: years });
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
  }
  
  static async getPrice(req, res) {
    const { vehicleType, brandCode, modelCode, modelYear, fuelType } = req.body;
    const fipeService = new FipeTableService();

    try {
      await fipeService.setReferenceTable();

      const fipePrice = await fipeService.searchFipePrice(
        vehicleType,
        brandCode,
        modelCode,
        Number(modelYear),
        Number(fuelType)
      );

      return res.status(200).json({
        consultResult: fipePrice,
      });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  }
}
