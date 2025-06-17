import PriceTable from "../models/PriceTable.js";
import VehicleType from "../models/VehicleType.js";
import VehicleCategory from "../models/VehicleCategory.js";
import FipeTableService from "../services/FipeTableService.js";
import { validatePriceTable } from "../validations/CreatePriceTable.js";

export default class PriceTableController {
  static async create(req, res) {
    const {
      name,
      vehicle_type_id,
      category_id,
      ranges,
      plansSelected,
      brands: receivedBrands,
      models: receivedModels,
    } = req.body;

    const fipeService = new FipeTableService();

    const nameExists = await PriceTable.findOne({ where: { name } });
    if (nameExists) {
      return res.status(422).json({
        message:
          "Tabela de Preços já cadastrada, por favor utilize outro nome!",
      });
    }

    const vehicleTypeExists = await VehicleType.findByPk(vehicle_type_id);
    if (!vehicleTypeExists) {
      return res
        .status(404)
        .json({ message: "Tipo de veículo não encontrado!" });
    }

    const categoryExists = await VehicleCategory.findByPk(category_id);
    if (!categoryExists) {
      return res
        .status(404)
        .json({ message: "Categoria de Veículo não encontrada!" });
    }

    try {
      let brands = receivedBrands || [];
      let reducedModels = receivedModels || [];

      if ((!brands.length || !reducedModels.length) && vehicle_type_id !== 4) {
        await fipeService.setReferenceTable();
        brands = await fipeService.searchBrands(vehicle_type_id);

        const allModels = [];
        for (const brand of brands) {
          const modelsResponse = await fipeService.searchModels(
            vehicle_type_id,
            brand.Value || brand.value || brand
          );
          const modelos = modelsResponse.Modelos || [];

          for (const model of modelos) {
            allModels.push(model.Value || model.value || model);
          }

          await new Promise((res) => setTimeout(res, 500));
        }

        reducedModels = reducedModels.map((model) =>
          typeof model === "number" ? model : Number(model)
        );
      }

      validatePriceTable({
        name,
        vehicle_type_id,
        brands,
        models: reducedModels,
        category_id,
        ranges,
        plansSelected,
      });

      const newTable = await PriceTable.create({
        name,
        vehicle_type_id,
        brands,
        models: reducedModels,
        category_id,
        ranges,
        plansSelected,
      });

      return res.status(201).json(newTable);
    } catch (error) {
      console.error("Erro ao salvar tabela de preços:", error);
      return res.status(400).json({ error: error.message });
    }
  }

  static async getAll(req, res) {
    try {
      const priceTables = await PriceTable.findAll();
      return res.status(200).json({ priceTables: priceTables });
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao obter as Tabelas de Preços.",
        error: error.message,
      });
    }
  }

  static async getPriceTableId(req, res) {
    const id = req.params.id;

    try {
      const priceTableId = await PriceTable.findByPk(id);

      if (!priceTableId) {
        return res.status(404).json({ message: "Tabela não encontrada!" });
      }

      return res.status(200).json(priceTableId);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Erro ao obter a tabela.", error: error.message });
    }
  }

  static async removePriceTableById(req, res) {
    const id = req.params.id;

    const priceTableExists = await PriceTable.findByPk(id);
    if (!priceTableExists) {
      res.status(404).json({ message: "Tabela de Preços não encontrada!" });
      return;
    }

    try {
      await PriceTable.destroy({ where: { id: id } });
      res
        .status(200)
        .json({ message: "Tabela de Preços removida com sucesso!" });
    } catch (error) {
      res.status(404).json({ message: "Tabela de Preços não encontrada!" });
      return;
    }
  }

  static async editPriceTable(req, res) {
    const id = req.params.id;
    const { name, ranges, brands, models } = req.body;

    try {
      const table = await PriceTable.findByPk(id);
      if (!table)
        return res.status(404).json({ error: "Tabela não encontrada" });

      if (name) table.name = name;
      if (ranges) table.ranges = ranges;
      if (brands) table.brands = brands;
      if (models) table.models = models;

      await table.save();

      res.json({ message: "Tabela atualizada com sucesso", table });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao atualizar a Tabela" });
    }
  }
}
