import VehicleCategory from "../models/VehicleCategory.js";
import VehicleType from "../models/VehicleType.js";
import PriceTableCategory from "../models/PriceTableCategory.js";
import PriceTable from "../models/PriceTable.js";
import { Op } from "sequelize";

export default class VehicleCategoryController {
  static async create(req, res) {
    const { name, fipeCode, vehicle_type_id } = req.body;

    const nameExists = await VehicleCategory.findOne({ where: { name: name } });

    if (nameExists) {
      return res.status(422).json({
        message:
          "Categoria de Veículo já cadastrada, por favor utilize outro nome!",
      });
    }

    const vehicleTypeExists = await VehicleType.findByPk(vehicle_type_id);

    if (!vehicleTypeExists) {
      return res.status(404).json({
        message: "Categoria de Veículo não encontrada!",
      });
    }

    try {
      const newCategoryVehicle = await VehicleCategory.create({
        name,
        fipeCode,
        vehicle_type_id,
      });

      return res.status(200).json({
        message: "Categoria de Veículo criada com sucesso!",
        categoryVehicle: newCategoryVehicle,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao criar a Categoria de Veículo!",
        error: error.message,
      });
    }
  }

  static async getAll(req, res) {
    try {
      const vehicleCategories = await VehicleCategory.findAll();
      return res.status(200).json({ vehicleCategories: vehicleCategories });
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao obter as Categorias de Veículos.",
        error: error.message,
      });
    }
  }

  static async getVehicleCategoryByIdVehicleTypeId(req, res) {
    const vehicle_type_id = req.params.id;

    try {
      const vehicleCategoriesByVehicleTypeId = await VehicleCategory.findAll({
        where: { vehicle_type_id: vehicle_type_id },
      });

      if (!vehicleCategoriesByVehicleTypeId) {
        return res.status(422).json({
          message: "Categorias não encontradas!",
        });
      }

      return res.status(200).json(vehicleCategoriesByVehicleTypeId);
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao obter as Categorias de Veículos",
        error: error.message,
      });
    }
  }

  static async getVehicleCategoriesByPriceTable(req, res) {
    const { id: price_table_id } = req.params;

    try {
      const priceTable = await PriceTable.findByPk(price_table_id, {
        include: [
          {
            model: VehicleCategory,
            as: "categories",
            through: { attributes: [] },
          },
        ],
      });

      if (!priceTable || !priceTable.categories.length) {
        return res.status(404).json({
          message: "Nenhuma categoria vinculada a esta tabela.",
        });
      }

      return res.status(200).json(priceTable.categories);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Erro ao buscar categorias da tabela de preços",
        error: error.message,
      });
    }
  }

  static async getVehicleCategoriesFilterPriceTable(req, res) {
    const { vehicle_type_id } = req.body;

    try {
      const usedCategories = await PriceTableCategory.findAll({
        attributes: ["category_id"],
        raw: true,
      });

      const usedIds = usedCategories.map((c) => c.category_id);

      const vehicleCategoriesByVehicleTypeId = await VehicleCategory.findAll({
        where: {
          vehicle_type_id,
          id: { [Op.notIn]: usedIds },
        },
      });

      if (!vehicleCategoriesByVehicleTypeId.length) {
        return res.status(422).json({
          message: "Categorias não encontradas!",
        });
      }

      return res.status(200).json(vehicleCategoriesByVehicleTypeId);
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao obter as Categorias de Veículos",
        error: error.message,
      });
    }
  }

  static async getVehicleCategoryByFipeCode(req, res) {
    const { id: fipeCode } = req.params;

    try {
      const category = await VehicleCategory.findAll({ where: { fipeCode } });

      if (!category) {
        return res.status(404).json({
          message: `Categoria de veículo com fipeCode ${fipeCode} não encontrada!`,
        });
      }

      return res.status(200).json(category);
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao buscar categoria de veículo pelo fipeCode",
        error: error.message,
      });
    }
  }

  static async removeVehicleCategoryById(req, res) {
    const id = req.params.id;

    const vehicleCategoryExists = await VehicleCategory.findByPk(id);
    if (!vehicleCategoryExists) {
      res.status(404).json({ message: "Categoria de Veículo não encontrada!" });
      return;
    }

    try {
      await VehicleCategory.destroy({ where: { id: id } });
      res
        .status(200)
        .json({ message: "Categoria de Veículo removido com sucesso!" });
    } catch (error) {
      res
        .status(404)
        .json({ message: "Não foi possível remover a Categoria de Veículo." });
      return;
    }
  }
  static async updateVehicleCategoryById(req, res) {
    const id = req.params.id;
    const { name, vehicle_type_id } = req.body;

    const vehicleCategory = await VehicleCategory.findByPk(id);
    if (!vehicleCategory) {
      return res.status(404).json({
        message: "Categoria de Veículo não encontrada!",
      });
    }

    const nameExists = await VehicleCategory.findOne({
      where: {
        name,
        id: { [Op.ne]: id },
      },
    });

    if (nameExists) {
      return res.status(422).json({
        message:
          "Categoria de Veículo já cadastrada, por favor utilize outro nome!",
      });
    }

    const vehicleTypeExists = await VehicleType.findByPk(vehicle_type_id);
    if (!vehicleTypeExists) {
      return res.status(404).json({
        message: "Tipo de Veículo não encontrado!",
      });
    }

    try {
      await vehicleCategory.update({ name, vehicle_type_id });

      return res.status(200).json({
        message: "Categoria de Veículo atualizada com sucesso!",
        categoryVehicle: vehicleCategory,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao atualizar a Categoria de Veículo!",
        error: error.message,
      });
    }
  }
}
