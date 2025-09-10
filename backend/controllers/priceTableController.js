import PriceTable from "../models/PriceTable.js";
import VehicleType from "../models/VehicleType.js";
import VehicleCategory from "../models/VehicleCategory.js";
import Plan from "../models/Plan.js";
import { validatePriceTable } from "../validations/CreatePriceTable.js";
import PriceTableCategory from "../models/PriceTableCategory.js";
import { Op } from "sequelize";

export default class PriceTableController {
  static async create(req, res) {
    const {
      name,
      vehicle_type_id,
      category_ids,
      ranges,
      plansSelected,
      brands: receivedBrands,
      models: receivedModels,
    } = req.body;

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

    const categoriesExist = await VehicleCategory.findAll({
      where: { id: { [Op.in]: category_ids } },
    });

    if (categoriesExist.length !== category_ids.length) {
      return res.status(404).json({
        message: "Uma ou mais categorias de veículo não foram encontradas!",
      });
    }

    try {
      const brands = receivedBrands || [];
      const reducedModels = receivedModels?.map((m) => Number(m)) || [];

      validatePriceTable({
        name,
        vehicle_type_id,
        brands,
        models: reducedModels,
        ranges,
        plansSelected,
      });

      const newTable = await PriceTable.create({
        name,
        vehicle_type_id,
        brands,
        models: reducedModels,
        ranges,
        plansSelected,
      });

      const priceTableCategoryData = category_ids.map((category_id) => ({
        price_table_id: newTable.id,
        category_id,
      }));

      await PriceTableCategory.bulkCreate(priceTableCategoryData);

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

  static async getPriceTablesByFilter(req, res) {
    const { model, vehicle_type_id } = req.body;

    try {
      const allTables = await PriceTable.findAll();

      if (vehicle_type_id) {
        const filteredByVehicleType = allTables.filter(
          (table) => table.vehicle_type_id === vehicle_type_id
        );
        return res.status(200).json({ priceTables: filteredByVehicleType });
      }

      if (model && typeof model === "number") {
        const filteredByModel = allTables.filter(
          (table) => Array.isArray(table.models) && table.models.includes(model)
        );
        return res.status(200).json({ priceTables: filteredByModel });
      }

      return res.status(200).json({ priceTables: allTables });
    } catch (error) {
      console.error("Erro ao buscar tabelas de preço:", error);
      return res.status(500).json({
        message: "Erro ao buscar tabelas de preço.",
        error: error.message,
      });
    }
  }

  static async getPlansByPriceTableModelValue(req, res) {
    const price_table_id = Number(req.body.price_table_id);
    const model_id =
      req.body.model_id !== undefined ? Number(req.body.model_id) : null;
    const vehicle_type_fipeCode =
      req.body.vehicle_type_fipeCode !== undefined
        ? Number(req.body.vehicle_type_fipeCode)
        : null;
    const vehiclePrice = Number(req.body.vehiclePrice);

    if (isNaN(price_table_id) || isNaN(vehiclePrice)) {
      return res
        .status(400)
        .json({ message: "Dados inválidos ou incompletos." });
    }

    if (vehicle_type_fipeCode !== 4 && (model_id === null || isNaN(model_id))) {
      return res
        .status(400)
        .json({ message: "Modelo inválido ou não informado." });
    }

    try {
      const priceTable = await PriceTable.findByPk(price_table_id);

      if (!priceTable) {
        return res
          .status(404)
          .json({ message: "Tabela de preço não encontrada." });
      }

      if (vehicle_type_fipeCode !== 4) {
        if (
          !Array.isArray(priceTable.models) ||
          !priceTable.models.includes(model_id)
        ) {
          return res.status(404).json({
            message:
              "O modelo informado não pertence à tabela de preço selecionada.",
          });
        }
      }

      const selectedRange = priceTable.ranges.find((range) => {
        return vehiclePrice >= range.min && vehiclePrice <= range.max;
      });

      if (!selectedRange) {
        return res.status(404).json({
          message: "Nenhum intervalo encontrado para o valor informado.",
        });
      }

      const planIdsInRange = selectedRange.pricePlanId.map((p) => p.plan_id);
      const plans = await Plan.findAll({ where: { id: planIdsInRange } });

      const result = plans.map((plan) => {
        const priceInfo = selectedRange.pricePlanId.find(
          (p) => p.plan_id === plan.id
        );
        return {
          id: plan.id,
          name: plan.name,
          basePrice: priceInfo?.basePrice ?? null,
        };
      });

      return res.status(200).json({
        plans: result,
        rangeDetails: {
          accession: selectedRange.accession,
          quota: selectedRange.quota,
          installationPrice: selectedRange.installationPrice,
          franchiseValue: selectedRange.franchiseValue,
          isFranchisePercentage: selectedRange.isFranchisePercentage,
        },
      });
    } catch (error) {
      console.error("Erro ao buscar planos:", error);
      return res.status(500).json({
        message: "Erro ao buscar planos para a tabela de preço.",
        error: error.message,
      });
    }
  }

  static async getRangeDetailsByAggregate(req, res) {
    const { category_id, price } = req.body;

    if (!category_id || isNaN(price)) {
      return res
        .status(400)
        .json({ message: "Dados inválidos ou incompletos." });
    }

    try {
      const priceTableCategory = await PriceTableCategory.findOne({
        where: { category_id },
      });

      if (!priceTableCategory) {
        return res.status(404).json({
          message: "Relação categoria ↔ tabela de preço não encontrada.",
        });
      }

      const priceTable = await PriceTable.findByPk(
        priceTableCategory.price_table_id
      );

      if (!priceTable) {
        return res
          .status(404)
          .json({ message: "Tabela de preço não encontrada." });
      }

      const selectedRange = priceTable.ranges.find((range) => {
        return price >= range.min && price <= range.max;
      });

      if (!selectedRange) {
        return res.status(404).json({
          message: "Nenhum intervalo encontrado para o valor informado.",
        });
      }

      const planIdsInRange = selectedRange.pricePlanId.map((p) => p.plan_id);
      const plans = await Plan.findAll({ where: { id: planIdsInRange } });

      const result = plans.map((plan) => {
        const priceInfo = selectedRange.pricePlanId.find(
          (p) => p.plan_id === plan.id
        );
        return {
          id: plan.id,
          name: plan.name,
          basePrice: priceInfo?.basePrice ?? null,
        };
      });

      return res.status(200).json({
        plans: result,
        rangeDetails: {
          accession: selectedRange.accession,
          quota: selectedRange.quota,
          installationPrice: selectedRange.installationPrice,
          franchiseValue: selectedRange.franchiseValue,
          isFranchisePercentage: selectedRange.isFranchisePercentage,
        },
      });
    } catch (error) {
      console.error("Erro ao buscar planos por agregado:", error);
      return res.status(500).json({
        message: "Erro ao buscar planos para o agregado",
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
      res
        .status(422)
        .json({ message: "Não foi possível remover a Tabela de Preços." });
      return;
    }
  }

  static async editPriceTable(req, res) {
    const id = req.params.id;
    const { name, ranges, brands, models, category_ids } = req.body;

    try {
      const table = await PriceTable.findByPk(id);
      if (!table)
        return res.status(404).json({ error: "Tabela não encontrada" });

      if (name) table.name = name;
      if (ranges) table.ranges = ranges;
      if (brands) table.brands = brands;
      if (models) table.models = models;

      await table.save();

      if (Array.isArray(category_ids)) {
        await PriceTableCategory.destroy({ where: { price_table_id: id } });

        const priceTableCategoryData = category_ids.map((category_id) => ({
          price_table_id: id,
          category_id,
        }));

        await PriceTableCategory.bulkCreate(priceTableCategoryData);
      }

      res.json({ message: "Tabela atualizada com sucesso", table });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao atualizar a Tabela" });
    }
  }
}
