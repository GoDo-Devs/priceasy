import VehicleCategory from "../models/VehicleCategory.js";
import VehicleType from "../models/VehicleType.js";

export default class VehicleCategoryController {
  static async create(req, res) {
    const { name, vehicle_type_id } = req.body;

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
        message: "Erro ao obter os serviços do plano.",
        error: error.message,
      });
    }
  }

  static async removeVehicleCategoryById(req, res) {
    const id = req.params.id;

    const vehicleCategoryExists = await VehicleType.findByPk(id);
    if (!vehicleCategoryExists) {
      res.status(404).json({ message: "Categoria de Veículo não encontrado!" });
      return;
    }

    try {
      await VehicleType.destroy({ where: { id: id } });
      res
        .status(200)
        .json({ message: "Categoria de Veículo removido com sucesso!" });
    } catch (error) {
      res.status(404).json({ message: "Categoria de Veículo não encontrado!" });
      return;
    }
  }
}
