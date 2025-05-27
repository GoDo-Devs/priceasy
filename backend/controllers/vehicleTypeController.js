import VehicleType from "../models/VehicleType.js";

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

  static async removeVehicleTypeById(req, res) {
    const id = req.params.id;

    const vehicleTypeExists = await VehicleType.findByPk(id);
    if (!vehicleTypeExists) {
      res.status(404).json({ message: "Tipo de Veículos não encontrado!" });
      return;
    }

    try {
      await VehicleType.destroy({ where: { id: id } });
      res
        .status(200)
        .json({ message: "Tipo de Veículos removido com sucesso!" });
    } catch (error) {
      res.status(404).json({ message: "Tipo de Veículos não encontrado!" });
      return;
    }
  }
}
