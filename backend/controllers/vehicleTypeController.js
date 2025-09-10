import VehicleType from "../models/VehicleType.js";
import { Op } from "sequelize";

export default class VehicleTypeController {
  static async create(req, res) {
    const { name } = req.body;

    const nameExists = await VehicleType.findOne({ where: { name: name } });

    if (nameExists) {
      return res.status(422).json({
        message: "Tipo de Veiculo já cadastrado, por favor utilize outro nome!",
      });
    }

    try {
      const newVehicleType = await VehicleType.create({
        name,
      });

      return res.status(200).json({
        message: "Tipo de Veiculo criado com sucesso!",
        vehicleType: newVehicleType,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao criar o Tipo de Veiculo!",
        error: error.message,
      });
    }
  }

  static async getDefaultVehicleTypes(req, res) {
    try {
      const vehicleTypes = await VehicleType.findAll({
        where: {
          id: {
            [Op.in]: [1, 2, 3, 8],
          },
        },
      });

      return res.status(200).json({ vehicleTypes });
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao obter os Tipos de Veículos padrão.",
        error: error.message,
      });
    }
  }

  static async getAll(req, res) {
    try {
      const vehicleTypes = await VehicleType.findAll();
      return res.status(200).json({ vehicleTypes: vehicleTypes });
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao obter os Tipos de Veiculos.",
        error: error.message,
      });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const vehicleType = await VehicleType.findByPk(id);

      if (!vehicleType) {
        return res
          .status(404)
          .json({ message: "Tipo de veículo não encontrado!" });
      }

      return res.status(200).json(vehicleType);
    } catch (error) {
      console.error("Erro ao buscar tipo de veículo:", error);
      return res.status(500).json({
        message: "Erro ao buscar tipo de veículo.",
        error: error.message,
      });
    }
  }
}
