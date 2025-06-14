import FipeTableService from "../services/FipeTableService.js";

class FipeController {
  static async getBrands(req, res) {
    const { vehicleType } = req.body;
    const fipeService = new FipeTableService();

    try {
      await fipeService.setReferenceTable();

      const brands = await fipeService.searchBrands(vehicleType);

      return res.status(200).json({
        brands: brands,
      });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  }

  static async getModels(req, res) {
    const { vehicleType, brandCode } = req.body;
    const fipeService = new FipeTableService();

    try {
      await fipeService.setReferenceTable();

      const models = await fipeService.searchModels(vehicleType, brandCode);

      return res.status(200).json({
        models: models["Modelos"],
      });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  }

  static async getModelYear(req, res) {
    const { vehicleType, brandCode, modelCode } = req.body;
    const fipeService = new FipeTableService();

    try {
      await fipeService.setReferenceTable();

      const years = await fipeService.searchModelYear(
        vehicleType,
        brandCode,
        modelCode
      );

      return res.status(200).json({
        years: years,
      });
    } catch (e) {
      res.status(400).json({ error: e.message });
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

export default FipeController;
